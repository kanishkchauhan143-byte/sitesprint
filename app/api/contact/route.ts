import { NextRequest, NextResponse } from 'next/server';
import { validateContactForm, ContactFormData } from '@/lib/validation';
import { getFirestoreDb, getFirebaseDiagnostics } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

// GET: Safe health check and configuration verification (no secrets exposed)
export async function GET() {
  const diagnostics = getFirebaseDiagnostics();
  return NextResponse.json(
    {
      status: 'ok',
      endpoint: '/api/contact',
      timestamp: new Date().toISOString(),
      firebase: {
        isConfigured: diagnostics.isConfigured,
        projectId: diagnostics.projectId, // Public identifier
        hasApiKey: diagnostics.hasApiKey,
        hasAuthDomain: diagnostics.hasAuthDomain,
        hasStorageBucket: diagnostics.hasStorageBucket,
        hasMessagingSenderId: diagnostics.hasMessagingSenderId,
        hasAppId: diagnostics.hasAppId,
        missingFields: diagnostics.missingFields,
      },
      email: {
        hasResendKey: Boolean(process.env.RESEND_API_KEY),
      },
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  try {
    let body: ContactFormData;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON request payload.' },
        { status: 400 }
      );
    }

    // Validate incoming form data
    const errors = validateContactForm(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          errors,
          message: 'Please review and fill in all required fields correctly.',
        },
        { status: 400 }
      );
    }

    // Verify Firestore database instance
    const { db, projectId, error: dbInitError } = getFirestoreDb();
    if (!db) {
      console.error('[SiteSprint API /contact] Firestore initialization failed:', dbInitError);
      return NextResponse.json(
        {
          success: false,
          message:
            'Database service is currently unavailable. Please try again later or email us directly at team.sitesprint@gmail.com',
          error: 'DATABASE_UNAVAILABLE',
        },
        { status: 503 }
      );
    }

    const leadPayload = {
      fullName: body.name.trim(),
      businessName: body.businessName.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || '',
      businessType: body.businessType,
      projectType: body.need,
      websiteUrl: body.websiteUrl?.trim() || '',
      message: body.message?.trim() || '',
      createdAt: serverTimestamp(),
      receivedAt: new Date().toISOString(),
    };

    console.log('[SiteSprint API /contact] Persisting lead to Firestore "inquiries" on project:', projectId, {
      fullName: leadPayload.fullName,
      businessName: leadPayload.businessName,
      email: leadPayload.email,
    });

    // Write to Firestore collection "inquiries" with strict 7s timeout
    let docId: string;
    try {
      const firestorePromise = addDoc(collection(db, 'inquiries'), leadPayload);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore write timed out after 7000ms')), 7000)
      );

      const docRef = await Promise.race([firestorePromise, timeoutPromise]);
      docId = docRef.id;
      console.log('[SiteSprint API /contact] Successfully persisted to Firestore "inquiries" with docId:', docId);
    } catch (firestoreErr: unknown) {
      const errMsg = firestoreErr instanceof Error ? firestoreErr.message : String(firestoreErr);
      console.error('[SiteSprint API /contact] Firestore write failed:', errMsg);
      return NextResponse.json(
        {
          success: false,
          message:
            'Unable to save your inquiry at this moment. Please try again or email us directly at team.sitesprint@gmail.com',
          error: 'DATABASE_WRITE_FAILED',
        },
        { status: 500 }
      );
    }

    // Optional email notification dispatch via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'SiteSprint Inquiries <onboarding@resend.dev>',
            to: [process.env.CONTACT_NOTIFICATION_EMAIL || 'team.sitesprint@gmail.com'],
            subject: `New Project Inquiry: ${leadPayload.businessName} (${leadPayload.fullName})`,
            html: `
              <h2>New Project Inquiry Received</h2>
              <p><strong>Name:</strong> ${leadPayload.fullName}</p>
              <p><strong>Business Name:</strong> ${leadPayload.businessName}</p>
              <p><strong>Email:</strong> ${leadPayload.email}</p>
              <p><strong>Phone:</strong> ${leadPayload.phone || 'N/A'}</p>
              <p><strong>Business Type:</strong> ${leadPayload.businessType}</p>
              <p><strong>Service Needed:</strong> ${leadPayload.projectType}</p>
              <p><strong>Website:</strong> ${leadPayload.websiteUrl || 'N/A'}</p>
              <p><strong>Project Notes:</strong></p>
              <p style="white-space: pre-wrap; background: #f4f4f5; padding: 12px; border-radius: 6px;">${
                leadPayload.message || 'No additional notes provided.'
              }</p>
              <hr />
              <p><small>Document ID: ${docId} | Received at ${leadPayload.receivedAt}</small></p>
            `,
          }),
          signal: AbortSignal.timeout(6000),
        });

        if (resendResponse.ok) {
          console.log('[SiteSprint API /contact] Notification email dispatched.');
        } else {
          const errBody = await resendResponse.text();
          console.warn('[SiteSprint API /contact] Resend API responded with error:', resendResponse.status, errBody);
        }
      } catch (emailErr) {
        console.error('[SiteSprint API /contact] Failed to send email notification:', emailErr);
      }
    }

    // Return HTTP 200 ONLY after Firestore write has succeeded
    return NextResponse.json(
      {
        success: true,
        message: "Thanks — we've received your project details and will be in touch soon!",
        docId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[SiteSprint API /contact] Unexpected server error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          'Something went wrong while submitting. Please try again or email us directly at team.sitesprint@gmail.com',
      },
      { status: 500 }
    );
  }
}
