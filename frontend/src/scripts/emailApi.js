/**
 * WLUG Open Source Day 2026 — Email API Client
 * Sends registration confirmation emails through the Node.js Nodemailer backend.
 */

const BACKEND_URL = (
  import.meta.env?.VITE_BACKEND_URL ||
  import.meta.env?.VITE_EMAIL_API_URL ||
  'http://localhost:5000'
)
  .trim()
  .replace(/\/+$/, '');

/**
 * Calls the Node.js backend to dispatch a confirmation email via Nodemailer.
 *
 * @param {Object} data - Registration details
 * @param {string} data.name
 * @param {string} data.email
 * @param {string} data.mobile_number
 * @param {string} data.year
 * @param {string} data.department
 * @param {string} data.college_name
 * @param {string} [data.pass_id]
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendRegistrationConfirmationEmail(data) {
  const endpoint = `${BACKEND_URL}/api/send-registration-email`;

  const payload = {
    name: data.name,
    email: data.email,
    mobile_number: data.mobile_number,
    year: data.year,
    department: data.department,
    college_name: data.college_name,
    pass_id: data.pass_id || data.passId,
  };

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('[Email API] Network error connecting to email service:', err);
    throw new Error('Could not connect to the confirmation email service.', { cause: err });
  }

  let result = null;
  try {
    result = await response.json();
  } catch {
    // Non-JSON response
  }

  if (!response.ok) {
    const errorMsg =
      result?.message || `Email delivery failed with status ${response.status}.`;
    console.error('[Email API] Error response:', { status: response.status, message: errorMsg });
    throw new Error(errorMsg);
  }

  return result || { success: true, message: 'Email sent successfully.' };
}
