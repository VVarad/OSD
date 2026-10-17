import express from 'express';
import { env } from '../config/env.js';
import { transporter } from '../config/mailer.js';
import { validateRegistrationPayload } from '../middleware/validator.js';
import { emailRateLimiter } from '../middleware/rateLimiter.js';
import {
  generateRegistrationEmailHtml,
  generateRegistrationEmailText,
} from '../templates/registrationEmail.js';

export const emailRouter = express.Router();

emailRouter.post(
  '/send-registration-email',
  emailRateLimiter,
  validateRegistrationPayload,
  async (req, res) => {
    const data = req.validatedData;

    if (!env.EMAIL_USER || !env.EMAIL_APP_PASSWORD) {
      console.error('[Email API] EMAIL_USER or EMAIL_APP_PASSWORD not set.');
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured on the server.',
      });
    }

    try {
      const htmlContent = generateRegistrationEmailHtml(data);
      const textContent = generateRegistrationEmailText(data);

      const senderAddress = env.EMAIL_FROM_NAME
        ? `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_USER}>`
        : env.EMAIL_USER;

      console.log(`[Email API] Sending OSD 2K26 confirmation to ${data.email} (${data.pass_id})...`);

      const info = await transporter.sendMail({
        from: senderAddress,
        to: data.email,
        subject: 'Welcome to OSD 2K26! Your Registration is Confirmed 🚀',
        html: htmlContent,
        text: textContent,
      });

      console.log('[Email API] Email sent successfully. MessageId:', info.messageId);

      return res.status(200).json({
        success: true,
        message: 'Registration confirmation email sent successfully.',
        passId: data.pass_id,
      });
    } catch (err) {
      // Securely log internal error details on the server without exposing to client
      console.error('[Email API] Delivery error:', {
        message: err.message,
        code: err.code,
        responseCode: err.responseCode,
        command: err.command,
      });

      // Handle specific SMTP error categories
      if (err.code === 'EAUTH' || err.responseCode === 535) {
        return res.status(502).json({
          success: false,
          message: 'Failed to authenticate with the email provider. Please contact the organizers.',
        });
      }

      if (err.code === 'ESOCKET' || err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
        return res.status(503).json({
          success: false,
          message: 'Email service connection timeout. Please try again later.',
        });
      }

      if (err.code === 'EENVELOPE' || (err.rejected && err.rejected.length > 0)) {
        return res.status(400).json({
          success: false,
          message: 'The recipient email address was rejected by the mail server.',
        });
      }

      // Safe fallback error response
      return res.status(500).json({
        success: false,
        message: 'Could not send confirmation email due to an internal mail service issue.',
      });
    }
  },
);
