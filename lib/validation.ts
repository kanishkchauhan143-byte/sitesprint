export interface ContactFormData {
  name: string;
  businessName: string;
  email: string;
  phone?: string;
  businessType: string;
  need: string;
  websiteUrl?: string;
  message?: string;
}

export interface ValidationErrors {
  name?: string;
  businessName?: string;
  email?: string;
  businessType?: string;
  need?: string;
  websiteUrl?: string;
}

export function validateContactForm(data: ContactFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'Please enter your name';
  }

  if (!data.businessName || !data.businessName.trim()) {
    errors.businessName = 'Please enter your business name';
  }

  if (!data.email || !data.email.trim()) {
    errors.email = 'Please enter your email address';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
  }

  if (!data.businessType || !data.businessType.trim()) {
    errors.businessType = 'Please select your business type';
  }

  if (!data.need || !data.need.trim()) {
    errors.need = 'Please select what service you need';
  }

  if (data.websiteUrl && data.websiteUrl.trim()) {
    const url = data.websiteUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.includes('.')) {
      errors.websiteUrl = 'Please enter a valid URL (e.g. example.com)';
    }
  }

  return errors;
}
