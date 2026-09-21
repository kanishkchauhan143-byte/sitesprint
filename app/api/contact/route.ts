import { NextRequest, NextResponse } from 'next/server';
import { validateContactForm, ContactFormData } from '@/lib/validation';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

    // Server-side audit logging: captures lead even if external services are down
    console.log('[SiteSprint Project Inquiry Received]', {
      timestamp: leadPayload.receivedAt,
      fullName: leadPayload.fullName,
      businessName: leadPayload.businessName,
      email: leadPayload.email,
      phone: leadPayload.phone || 'N/A',
      businessType: leadPayload.businessType,
      projectType: leadPayload.projectType,
      websiteUrl: leadPayload.websiteUrl || 'N/A',
      messagePreview: leadPayload.message ? `${leadPayload.message.slice(0, 80)}...` : 'N/A',
    });

    // 1. Persist to Cloud Firestore if configured (with strict 5s timeout to prevent hanging)
    let firestoreStored = false;
    if (isFirebaseConfigured && db) {
      try {
        const firestorePromise = addDoc(collection(db, 'inquiries'), leadPayload);
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Firestore write timed out after 5000ms')), 5000)
        );

        const docRef = await Promise.race([firestorePromise, timeoutPromise]);
        firestoreStored = true;
        console.log('[SiteSprint API /contact] Successfully persisted to Firestore:', docRef.id);
      } catch (firestoreErr) {
        console.error('[SiteSprint API /contact] Firestore save error or timeout:', firestoreErr);
      }
    } else {
      console.warn(
        '[SiteSprint API /contact] Firebase is not configured in this environment. Lead logged to server console.'
      );
    }

    // 2. Dispatch email notification via Resend REST API if RESEND_API_KEY is configured
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
              <p><small>Received at ${leadPayload.receivedAt} | Stored in DB: ${firestoreStored ? 'Yes' : 'No'}</small></p>
            `,
          }),
          signal: AbortSignal.timeout(6000),
        });

        if (resendResponse.ok) {
          console.log('[SiteSprint API /contact] Notification email dispatched successfully.');
        } else {
          const errBody = await resendResponse.text();
          console.warn('[SiteSprint API /contact] Resend API responded with error:', resendResponse.status, errBody);
        }
      } catch (emailErr) {
        console.error('[SiteSprint API /contact] Failed to send email notification:', emailErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thanks — we've received your project details and will be in touch soon!",
        stored: firestoreStored,
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
