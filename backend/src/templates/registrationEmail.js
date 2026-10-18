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
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Open Source Day 2k26 Registration</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;">

<table role="presentation"
       width="100%"
       border="0"
       cellpadding="0"
       cellspacing="0"
       style="border-collapse:collapse;background:#f4f4f4;padding:40px 0;">

<tr>
<td align="center">

<table role="presentation"
       width="600"
       border="0"
       cellpadding="0"
       cellspacing="0"
       style="border-collapse:collapse;width:100%;max-width:600px;background:#ffffff;">

    <!-- Banner -->
    <tr>
        <td style="padding:0;margin:0;line-height:0;font-size:0;">
            <img
                src="https://res.cloudinary.com/yy2txahg/image/upload/f_auto/q_auto/WhatsApp_Image_2026-10-17_at_10.33.18_PM_njhnkf.jpg"
                alt="Open Source Day 2k26"
                width="600"
                style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:none;text-decoration:none;">
        </td>
    </tr>

    <!-- Main Content -->
    <tr>
        <td style="padding:35px 40px;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;color:#555555;font-size:17px;line-height:1.6;text-align:center;">

            <h1 style="margin:0 0 25px;font-size:26px;color:#2c3e50;font-weight:600;">
                Hola Open Source Enthusiasts! 🐧
            </h1>

            <div style="display:inline-block;background:#9a59e2;color:#ffffff;padding:10px 24px;border-radius:25px;font-weight:600;">
                Registration Confirmed
            </div>

            <p>
                We are <strong>pleased to inform you</strong> that your registration
                for <strong>Open Source Day 2k26</strong> was successful! 🎉
            </p>

            <p>
                The event will be held on
                <strong>25th October 2026</strong>,
            </p>

            <p>
                You will have access to all sessions and activities as a registered participant.
            </p>

            <!-- Event Details -->
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

                     

            <p>
                Please don't hesitate to contact us if you have any questions.
            </p>

            <p>
                <strong>Website:</strong><br>
                <a href="https://osd2k26.wcewlug.org/"
                   style="color:#9a59e2;text-decoration:none;">
                    osd2k26.wcewlug.org
                </a>
            </p>

            
            <p><em>We look forward to seeing you there!</em></p>

            <p>
                Thanks and regards,<br><br>

                <strong>Walchand Linux Users' Group</strong><br>
                Community | Knowledge | Share
            </p>

        </td>
    </tr>

    <!-- Footer -->
    <tr>
        <td style="background:#000000;padding:25px;text-align:center;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;font-size:14px;color:#ffffff;">

            <p style="margin:0 0 15px;">
                <a href="https://linkedin.com/company/wlug-club" style="color:#cea1ff;text-decoration:none;">LinkedIn</a>
                &nbsp; | &nbsp;
                <a href="https://instagram.com/wcewlug" style="color:#cea1ff;text-decoration:none;">Instagram</a>
                &nbsp; | &nbsp;
                <a href="https://twitter.com/wcewlug" style="color:#cea1ff;text-decoration:none;">Twitter</a>
            </p>

            <p style="margin:0;">
                © 2026 WCE WLUG • Walchand College of Engineering, Sangli
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
