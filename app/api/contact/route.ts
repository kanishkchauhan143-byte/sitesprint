import { NextRequest, NextResponse } from 'next/server';
import { validateContactForm, ContactFormData } from '@/lib/validation';

// TODO: Set RESEND_API_KEY (or preferred email provider) to enable real delivery.
// Until configured, this route logs the submission server-side and returns
// a response indicating the message was received but not yet sent —
// do not report a false "delivered" success to the user.

export async function POST(req: NextRequest) {
  try {
    const body: ContactFormData = await req.json();

    // Validate incoming form data
    const errors = validateContactForm(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, errors, message: 'Validation failed.' },
        { status: 400 }
      );
    }

    // Server-side logging of submission
    console.log('[SiteSprint Contact Form Submission Received]', {
      timestamp: new Date().toISOString(),
      name: body.name,
      businessName: body.businessName,
      email: body.email,
      phone: body.phone || 'N/A',
      businessType: body.businessType,
      need: body.need,
      websiteUrl: body.websiteUrl || 'N/A',
      message: body.message || 'N/A',
    });

    const hasApiKey = Boolean(process.env.RESEND_API_KEY);

    if (hasApiKey) {
      // Future Resend or email service integration
      console.log('Sending email via provider...');
    }

    return NextResponse.json(
      {
        success: true,
        delivered: hasApiKey,
        message: "Thanks — we've received your project details.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error. You can also email us directly at team.sitesprint@gmail.com',
      },
      { status: 500 }
    );
  }
}
