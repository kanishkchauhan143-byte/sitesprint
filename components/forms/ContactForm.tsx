'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { validateContactForm, ContactFormData, ValidationErrors } from '@/lib/validation';
import { BUSINESS_TYPES, SERVICE_NEEDS } from '@/lib/content';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ContactFormProps {
  onSuccess?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    businessType: '',
    need: '',
    websiteUrl: '',
    message: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[ContactForm] Stage 1: Form submit event triggered. Form data:', formData);
    setSubmitStatus(null);
    setErrors({});

    const validationErrors = validateContactForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      console.warn('[ContactForm] Stage 2: Client-side validation failed with errors:', validationErrors);
      setErrors(validationErrors);
      return;
    }
    console.log('[ContactForm] Stage 2: Client-side validation passed.');

    setIsSubmitting(true);
    console.log('[ContactForm] Stage 3: Setting isSubmitting to true.');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn('[ContactForm] AbortController timed out after 15s');
      controller.abort();
    }, 15000);

    try {
      console.log('[ContactForm] Stage 4: Dispatching fetch POST request to /api/contact...');
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('[ContactForm] Stage 5: Received response from /api/contact. HTTP status:', response.status, response.statusText);

      let result: { success?: boolean; message?: string; errors?: ValidationErrors } = {};
      try {
        result = await response.json();
        console.log('[ContactForm] Stage 6: Successfully parsed response JSON:', result);
      } catch (jsonErr) {
        console.error('[ContactForm] Stage 6: Failed to parse JSON response:', jsonErr);
        throw new Error(`Server returned HTTP ${response.status} with invalid JSON`);
      }

      if (!response.ok || !result.success) {
        console.warn('[ContactForm] Stage 7: Submission rejected by API:', result);
        if (result.errors) {
          setErrors(result.errors);
        }
        setSubmitStatus({
          success: false,
          message:
            result.message ||
            'Something went wrong while submitting. Please try again or email us directly at team.sitesprint@gmail.com',
        });
        return;
      }

      console.log('[ContactForm] Stage 7: Submission succeeded! Updating UI and resetting form.');
      setSubmitStatus({
        success: true,
        message:
          result.message ||
          "Thanks — we've received your project details and will be in touch soon!",
      });

      setFormData({
        name: '',
        businessName: '',
        email: '',
        phone: '',
        businessType: '',
        need: '',
        websiteUrl: '',
        message: '',
      });

      if (onSuccess) {
        setTimeout(onSuccess, 2200);
      }
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      console.error('[ContactForm] Error in submit handler:', error);

      const isAbort = error instanceof DOMException && error.name === 'AbortError';
      const errorMessage = isAbort
        ? 'Request timed out. Please check your connection or email us directly at team.sitesprint@gmail.com'
        : 'Something went wrong while submitting. Please try again or email us directly at team.sitesprint@gmail.com';

      setSubmitStatus({
        success: false,
        message: errorMessage,
      });
    } finally {
      console.log('[ContactForm] Stage 8: In finally block — resetting isSubmitting to false.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:gap-3 text-left">
      {submitStatus && (
        <div
          className={`p-3 sm:p-3.5 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm border ${
            submitStatus.success
              ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#34D399]'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
          role="alert"
        >
          {submitStatus.success ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{submitStatus.message}</span>
        </div>
      )}

      {/* Row 1: Name & Business Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-xs font-medium text-[var(--paper)] mb-1"
          >
            Full Name <span className="text-[var(--current-bright)]">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[var(--void)] border border-[var(--hairline)] text-sm text-[var(--paper)] placeholder-[var(--mist)]/50 focus:border-[var(--current-bright)] focus:outline-none transition-colors"
          />
          {errors.name && (
            <p className="mt-0.5 text-[11px] text-red-400">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-business"
            className="block text-xs font-medium text-[var(--paper)] mb-1"
          >
            Business Name <span className="text-[var(--current-bright)]">*</span>
          </label>
          <input
            id="contact-business"
            name="businessName"
            type="text"
            required
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Acme Studio"
            className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[var(--void)] border border-[var(--hairline)] text-sm text-[var(--paper)] placeholder-[var(--mist)]/50 focus:border-[var(--current-bright)] focus:outline-none transition-colors"
          />
          {errors.businessName && (
            <p className="mt-0.5 text-[11px] text-red-400">{errors.businessName}</p>
          )}
        </div>
      </div>

      {/* Row 2: Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        <div>
          <label
            htmlFor="contact-email"
            className="block text-xs font-medium text-[var(--paper)] mb-1"
          >
            Email Address <span className="text-[var(--current-bright)]">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="jane@example.com"
            className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[var(--void)] border border-[var(--hairline)] text-sm text-[var(--paper)] placeholder-[var(--mist)]/50 focus:border-[var(--current-bright)] focus:outline-none transition-colors"
          />
          {errors.email && (
            <p className="mt-0.5 text-[11px] text-red-400">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-phone"
            className="block text-xs font-medium text-[var(--paper)] mb-1"
          >
            Phone / WhatsApp Number <span className="text-[var(--mist)]">(optional)</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[var(--void)] border border-[var(--hairline)] text-sm text-[var(--paper)] placeholder-[var(--mist)]/50 focus:border-[var(--current-bright)] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Row 3: Business Type & Need */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        <div>
          <label
            htmlFor="contact-business-type"
            className="block text-xs font-medium text-[var(--paper)] mb-1"
          >
            Business Type <span className="text-[var(--current-bright)]">*</span>
          </label>
          <select
            id="contact-business-type"
            name="businessType"
            required
            value={formData.businessType}
            onChange={handleChange}
            className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[var(--void)] border border-[var(--hairline)] text-sm text-[var(--paper)] focus:border-[var(--current-bright)] focus:outline-none transition-colors cursor-pointer"
          >
            <option value="">Select industry...</option>
            {BUSINESS_TYPES.map((type) => (
              <option key={type} value={type} className="bg-[var(--elevated)]">
                {type}
              </option>
            ))}
          </select>
          {errors.businessType && (
            <p className="mt-0.5 text-[11px] text-red-400">{errors.businessType}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-need"
            className="block text-xs font-medium text-[var(--paper)] mb-1"
          >
            What can we help you with? <span className="text-[var(--current-bright)]">*</span>
          </label>
          <select
            id="contact-need"
            name="need"
            required
            value={formData.need}
            onChange={handleChange}
            className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[var(--void)] border border-[var(--hairline)] text-sm text-[var(--paper)] focus:border-[var(--current-bright)] focus:outline-none transition-colors cursor-pointer"
          >
            <option value="">Select project type...</option>
            {SERVICE_NEEDS.map((need) => (
              <option key={need} value={need} className="bg-[var(--elevated)]">
                {need}
              </option>
            ))}
          </select>
          {errors.need && (
            <p className="mt-0.5 text-[11px] text-red-400">{errors.need}</p>
          )}
        </div>
      </div>

      {/* Website URL */}
      <div>
        <label
          htmlFor="contact-url"
          className="block text-xs font-medium text-[var(--paper)] mb-1"
        >
          Current Website URL <span className="text-[var(--mist)]">(optional)</span>
        </label>
        <input
          id="contact-url"
          name="websiteUrl"
          type="text"
          value={formData.websiteUrl}
          onChange={handleChange}
          placeholder="https://yourbusiness.com"
          className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[var(--void)] border border-[var(--hairline)] text-sm text-[var(--paper)] placeholder-[var(--mist)]/50 focus:border-[var(--current-bright)] focus:outline-none transition-colors"
        />
        {errors.websiteUrl && (
          <p className="mt-0.5 text-[11px] text-red-400">{errors.websiteUrl}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="contact-message"
          className="block text-xs font-medium text-[var(--paper)] mb-1"
        >
          Message / Project Notes <span className="text-[var(--mist)]">(optional)</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={2}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your business, website goals, or anything you'd like us to know..."
          className="w-full px-3 py-2 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl bg-[var(--void)] border border-[var(--hairline)] text-sm text-[var(--paper)] placeholder-[var(--mist)]/50 focus:border-[var(--current-bright)] focus:outline-none transition-colors resize-none no-scrollbar"
        />
      </div>

      {/* Submit Button */}
      <div className="mt-1 sm:mt-1.5">
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitting}
          className="w-full text-sm py-3"
          icon={
            isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )
          }
        >
          {isSubmitting ? 'Sending Request...' : 'Send Project Inquiry'}
        </Button>
      </div>
    </form>
  );
};
