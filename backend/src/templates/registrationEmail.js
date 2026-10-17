/**
 * Utility to escape user-provided strings for safe insertion into HTML.
 * Prevents HTML/script injection in email clients.
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Generates the HTML template for OSD 2K26 Registration Confirmation Email.
 *
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.email
 * @param {string} data.mobile_number
 * @param {string} data.year
 * @param {string} data.department
 * @param {string} data.college_name
 * @param {string} [data.pass_id]
 * @returns {string} Fully rendered HTML email string
 */
export function generateRegistrationEmailHtml(data) {
  const name = escapeHtml(data.name || 'Participant');
  const email = escapeHtml(data.email || '');
  const mobile = escapeHtml(data.mobile_number || '');
  const year = escapeHtml(data.year || '');
  const department = escapeHtml(data.department || '');
  const college = escapeHtml(data.college_name || '');
  const passId = escapeHtml(data.pass_id || data.passId || 'OSD26-CONFIRMED');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to OSD 2K26!</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #1f2937;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; border-collapse: separate;">
          
          <!-- Black Header with Orange Branding -->
          <tr>
            <td style="background-color: #0b0c10; padding: 28px 24px; border-radius: 12px 12px 0 0; text-align: center; border-bottom: 3px solid #ff7700;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <span style="display: inline-block; background-color: #ff7700; color: #0b0c10; font-size: 11px; font-weight: 800; letter-spacing: 2px; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; margin-bottom: 8px;">
                      WLUG PRESENTS
                    </span>
                    <h2 style="margin: 6px 0 0 0; color: #ff7700; font-size: 26px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">
                      OPEN SOURCE DAY 2K26
                    </h2>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- White Content Card -->
          <tr>
            <td style="background-color: #ffffff; padding: 36px 32px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06); border: 1px solid #e5e7eb; border-top: none;">
              
              <!-- Registration Confirmed Badge -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 9999px; padding: 6px 14px;">
                    <span style="color: #065f46; font-size: 13px; font-weight: 700; letter-spacing: 0.5px;">
                      &#10003; Registration Confirmed
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Main Heading -->
              <h1 style="margin: 0 0 16px 0; color: #111827; font-size: 24px; font-weight: 800; line-height: 1.3;">
                Welcome to OSD 2K26! &#128640;
              </h1>

              <!-- Personalized Greeting -->
              <p style="margin: 0 0 14px 0; font-size: 16px; color: #374151; line-height: 1.6;">
                Hi <strong>${name}</strong>,
              </p>
              
              <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563; line-height: 1.6;">
                Your registration for <strong>Open Source Day 2026</strong> has been received and verified. We are thrilled to welcome you to this celebration of Linux, open source technologies, and community spirit!
              </p>

              <!-- Ticket / Registration Details Box -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 28px;">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                  <tr>
                    <td style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">
                      Registration Pass
                    </td>
                    <td align="right" style="font-family: monospace; font-size: 14px; font-weight: 700; color: #ff7700;">
                      ${passId}
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="6">
                  <tr>
                    <td width="35%" style="font-size: 13px; color: #64748b; font-weight: 600;">Attendee Name</td>
                    <td width="65%" style="font-size: 14px; color: #1e293b; font-weight: 600;">${name}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 13px; color: #64748b; font-weight: 600;">Email Address</td>
                    <td style="font-size: 14px; color: #1e293b;">${email}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 13px; color: #64748b; font-weight: 600;">Mobile Number</td>
                    <td style="font-size: 14px; color: #1e293b;">${mobile}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 13px; color: #64748b; font-weight: 600;">Year of Study</td>
                    <td style="font-size: 14px; color: #1e293b;">${year}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 13px; color: #64748b; font-weight: 600;">Department</td>
                    <td style="font-size: 14px; color: #1e293b;">${department}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 13px; color: #64748b; font-weight: 600;">College</td>
                    <td style="font-size: 14px; color: #1e293b;">${college}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 13px; color: #64748b; font-weight: 600; border-top: 1px dashed #cbd5e1; padding-top: 10px;">Date</td>
                    <td style="font-size: 14px; color: #1e293b; font-weight: 600; border-top: 1px dashed #cbd5e1; padding-top: 10px;">Sunday, 25 October 2026</td>
                  </tr>
                  <tr>
                    <td style="font-size: 13px; color: #64748b; font-weight: 600;">Venue</td>
                    <td style="font-size: 14px; color: #1e293b; font-weight: 600;">Walchand College of Engineering, Sangli</td>
                  </tr>
                </table>
              </div>

              <!-- Note / Guidelines -->
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #4b5563; line-height: 1.6;">
                Please preserve this email or your Pass ID (<strong>${passId}</strong>) for desk check-in at the venue.
              </p>

              <!-- Thank you & Sign-off -->
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #374151; line-height: 1.6;">
                Thank you for being a part of this journey with us. See you at OSD 2K26!
              </p>
              
              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9;">
                <p style="margin: 0; font-size: 14px; color: #4b5563;">Warm regards,</p>
                <p style="margin: 4px 0 0 0; font-size: 15px; font-weight: 700; color: #111827;">
                  Walchand Linux Users&#39; Group (WLUG)
                </p>
                <p style="margin: 2px 0 0 0; font-size: 13px; color: #64748b;">
                  Walchand College of Engineering, Sangli
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 16px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #6b7280;">
                Walchand Linux Users&#39; Group &bull; Community | Knowledge | Share
              </p>
              <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                This confirmation was sent automatically following your registration on the WLUG OSD 2K26 portal.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generates the plain-text alternative fallback for email clients without HTML support.
 *
 * @param {Object} data
 * @returns {string} Plain text email content
 */
export function generateRegistrationEmailText(data) {
  const name = data.name || 'Participant';
  const passId = data.pass_id || data.passId || 'OSD26-CONFIRMED';

  return `WLUG OPEN SOURCE DAY 2K26 — REGISTRATION CONFIRMED
======================================================

Welcome to OSD 2K26! 🚀

Hi ${name},

Thank you for registering for Open Source Day 2026 organized by Walchand Linux Users' Group (WLUG). Your registration has been confirmed!

REGISTRATION DETAILS:
---------------------
Pass ID:        ${passId}
Attendee Name:  ${data.name || ''}
Email:          ${data.email || ''}
Mobile:         ${data.mobile_number || ''}
Year:           ${data.year || ''}
Department:     ${data.department || ''}
College:        ${data.college_name || ''}

EVENT DETAILS:
--------------
Date:   Sunday, 25 October 2026
Venue:  Walchand College of Engineering, Sangli

Please keep this email or your Pass ID (${passId}) for event check-in.

Thank you for joining us! We look forward to seeing you at OSD 2K26.

Warm regards,
Walchand Linux Users' Group (WLUG) Team
Walchand College of Engineering, Sangli
Community | Knowledge | Share
`;
}
