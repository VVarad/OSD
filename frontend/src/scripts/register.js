/**
 * WLUG Open Source Day 2026 — Registration Logic
 * Handles validation, accessibility, Supabase database submission, and confirmation states.
 */

import { isSupabaseConfigured, insertRegistrationToSupabase, normalizeMobileNumber } from './supabase.js';

// Available departments at Walchand College of Engineering, Sangli
export const WCE_DEPARTMENTS = [
  'Computer Science and Engineering',
  'Information Technology',
  'Electronics Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Artificial Intelligence and Machine Learning',
  'Robotics and Automation',
];

export const VALID_YEARS = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validates a single field value.
 * @param {string} fieldName - name, email, mobile_number, year, department, college_name
 * @param {string} value
 * @returns {string|null} - error message or null if valid
 */
export function validateField(fieldName, value) {
  const trimmed = typeof value === 'string' ? value.trim() : '';

  switch (fieldName) {
    case 'name':
      if (!trimmed) {
        return 'Please enter your full name.';
      }
      if (trimmed.length < 2) {
        return 'Name must be at least 2 characters.';
      }
      return null;

    case 'email':
      if (!trimmed) {
        return 'Please enter your email address.';
      }
      if (!EMAIL_REGEX.test(trimmed)) {
        return 'Please enter a valid email address (e.g. name@example.com).';
      }
      return null;

    case 'mobile_number':
    case 'mobile': {
      if (!trimmed) {
        return 'Please enter your mobile number.';
      }
      const cleaned = trimmed.replace(/[\s\-()]/g, '');
      const indianMobileRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
      if (!indianMobileRegex.test(cleaned)) {
        return 'Please enter a valid 10-digit Indian mobile number.';
      }
      return null;
    }

    case 'year':
      if (!trimmed) {
        return 'Please select your current year.';
      }
      if (!VALID_YEARS.includes(trimmed)) {
        return 'Please select a valid year option.';
      }
      return null;

    case 'department':
      if (!trimmed) {
        return 'Please select your department.';
      }
      if (!WCE_DEPARTMENTS.includes(trimmed)) {
        return 'Please choose a valid department at WCE Sangli.';
      }
      return null;

    case 'college_name':
    case 'college':
      if (!trimmed) {
        return 'Please enter your college name.';
      }
      if (trimmed.length < 2) {
        return 'College name must be at least 2 characters.';
      }
      return null;

    default:
      return null;
  }
}

/**
 * Modular submission handler.
 * Connects directly to Supabase if configured in .env,
 * otherwise falls back to custom API or local mock confirmation.
 * @param {Object} data - { name, email, mobile_number, year, department, college_name }
 * @returns {Promise<Object>} confirmation object
 */
export async function submitRegistration(data) {
  // 1. Direct Supabase integration
  if (isSupabaseConfigured()) {
    return await insertRegistrationToSupabase(data);
  }

  // 2. Custom external API endpoint if provided
  const apiUrl = window.REGISTER_API_URL || null;
  if (apiUrl) {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMsg = 'Failed to submit registration. Please try again.';
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMsg = errorData.message;
        }
      } catch {
        // use default fallback
      }
      throw new Error(errorMsg);
    }

    return await response.json();
  }

  // 3. Simulated fallback delay (when Supabase credentials are not yet added to .env)
  await new Promise((resolve) => setTimeout(resolve, 800));

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const passId = `OSD26-${randomSuffix}`;

  const rawMobile = data.mobile_number ?? data.mobile ?? '';
  const rawCollege = data.college_name ?? data.college ?? '';

  return {
    success: true,
    passId,
    timestamp: new Date().toISOString(),
    participant: {
      name: data.name.trim(),
      email: data.email.trim(),
      mobile_number: normalizeMobileNumber(rawMobile),
      year: data.year.trim(),
      department: data.department.trim(),
      college_name: rawCollege.trim(),
    },
  };
}

/**
 * Initializes the registration form interface.
 */
export function initRegistration() {
  const form = document.getElementById('register-form');
  const successCard = document.getElementById('register-success');
  const submitBtn = document.getElementById('submit-btn');
  const submitText = submitBtn?.querySelector('.btn-text');
  const generalError = document.getElementById('form-general-error');
  const registerAnotherBtn = document.getElementById('btn-register-another');

  if (!form) return;

  const fields = ['name', 'email', 'mobile_number', 'year', 'department', 'college_name'];
  const touched = {};

  function hideGeneralError() {
    if (generalError) {
      generalError.classList.remove('is-visible');
      generalError.style.display = 'none';
      generalError.innerHTML = '';
    }
  }

  function showGeneralError(msg) {
    if (generalError) {
      generalError.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <span>${msg}</span>
      `;
      generalError.classList.add('is-visible');
      generalError.style.display = 'flex';
      generalError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function setFieldError(field, error) {
    const group = document.getElementById(`group-${field}`);
    const input = document.getElementById(field);
    const errorEl = document.getElementById(`${field}-error`);

    if (!group || !input || !errorEl) return;

    if (error) {
      group.classList.add('has-error');
      group.classList.remove('is-valid');
      errorEl.textContent = error;
      errorEl.style.display = 'flex';
      input.setAttribute('aria-invalid', 'true');
    } else {
      group.classList.remove('has-error');
      if (touched[field] && input.value.trim() !== '') {
        group.classList.add('is-valid');
      } else {
        group.classList.remove('is-valid');
      }
      errorEl.textContent = '';
      errorEl.style.display = 'none';
      input.removeAttribute('aria-invalid');
    }
  }

  function validateSingle(field) {
    const input = document.getElementById(field);
    if (!input) return true;
    const error = validateField(field, input.value);
    setFieldError(field, error);
    return error === null;
  }

  // Attach blur, input and change handlers for responsive validation
  fields.forEach((field) => {
    const input = document.getElementById(field);
    if (!input) return;

    input.addEventListener('blur', () => {
      touched[field] = true;
      validateSingle(field);
    });

    input.addEventListener('input', () => {
      hideGeneralError();
      if (touched[field]) {
        validateSingle(field);
      }
    });

    input.addEventListener('change', () => {
      touched[field] = true;
      validateSingle(field);
    });
  });

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideGeneralError();

    // Mark all as touched and validate
    let hasError = false;
    let firstInvalidInput = null;

    fields.forEach((field) => {
      touched[field] = true;
      const isValid = validateSingle(field);
      if (!isValid && !hasError) {
        hasError = true;
        firstInvalidInput = document.getElementById(field);
      }
    });

    if (hasError) {
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return;
    }

    const rawMobile = document.getElementById('mobile_number')?.value || '';
    const rawCollege = document.getElementById('college_name')?.value || '';

    // Collect data
    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      mobile_number: normalizeMobileNumber(rawMobile),
      year: document.getElementById('year').value,
      department: document.getElementById('department').value,
      college_name: rawCollege.trim(),
    };

    // Set Loading State (prevent double submission)
    form.classList.add('is-submitting');
    if (submitBtn) {
      submitBtn.disabled = true;
      if (submitText) submitText.textContent = 'Summoning Registration...';
    }
    fields.forEach((f) => {
      const el = document.getElementById(f);
      if (el) el.disabled = true;
    });

    try {
      const result = await submitRegistration(formData);

      // Display Success State
      if (form) form.style.display = 'none';
      const cardHeader = document.querySelector('.register-card__header');
      if (cardHeader) cardHeader.style.display = 'none';

      if (successCard) {
        successCard.classList.add('is-active');

        // Populate ticket details
        const nameEl = document.getElementById('ticket-name');
        const emailEl = document.getElementById('ticket-email');
        const mobileEl = document.getElementById('ticket-mobile');
        const yearDeptEl = document.getElementById('ticket-year-dept');
        const collegeEl = document.getElementById('ticket-college');
        const passIdEl = document.getElementById('ticket-pass-id');

        const participant = result.participant || formData;

        if (nameEl) nameEl.textContent = participant.name;
        if (emailEl) emailEl.textContent = participant.email;
        if (mobileEl) mobileEl.textContent = participant.mobile_number;
        if (yearDeptEl) yearDeptEl.textContent = `${participant.year} • ${participant.department}`;
        if (collegeEl) collegeEl.textContent = participant.college_name;
        if (passIdEl) passIdEl.textContent = result.passId || 'OSD26-CONFIRMED';

        successCard.focus();
      }
    } catch (err) {
      showGeneralError(
        err.message || 'Something went wrong while conjuring your registration. Please try again.',
      );

      // Re-enable form
      form.classList.remove('is-submitting');
      if (submitBtn) {
        submitBtn.disabled = false;
        if (submitText) submitText.textContent = 'Register Now';
      }
      fields.forEach((f) => {
        const el = document.getElementById(f);
        if (el) el.disabled = false;
      });
    }
  });

  // Handle "Register Another" reset
  if (registerAnotherBtn) {
    registerAnotherBtn.addEventListener('click', () => {
      form.reset();
      hideGeneralError();
      fields.forEach((f) => {
        touched[f] = false;
        const el = document.getElementById(f);
        if (el) el.disabled = false;
        setFieldError(f, null);
      });

      if (submitBtn) {
        submitBtn.disabled = false;
        if (submitText) submitText.textContent = 'Register Now';
      }
      form.classList.remove('is-submitting');

      if (successCard) successCard.classList.remove('is-active');
      const cardHeader = document.querySelector('.register-card__header');
      if (cardHeader) cardHeader.style.display = 'block';
      if (form) form.style.display = 'flex';

      const firstInput = document.getElementById('name');
      if (firstInput) firstInput.focus();
    });
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRegistration, { once: true });
  } else {
    initRegistration();
  }
}
