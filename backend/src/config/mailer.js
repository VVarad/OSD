import nodemailer from 'nodemailer';
import { env } from './env.js';

export function createMailerTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_APP_PASSWORD,
    },
  });
}

export const transporter = createMailerTransporter();

export async function verifyMailer() {
  if (!env.EMAIL_USER || !env.EMAIL_APP_PASSWORD) {
    console.warn('[Mailer] Gmail SMTP credentials not fully configured.');
    return false;
  }

  try {
    await transporter.verify();
    console.log('[Mailer] Gmail SMTP connection verified successfully.');
    return true;
  } catch (err) {
    console.error('[Mailer] Gmail SMTP verification failed:', err.message);
    return false;
  }
}
