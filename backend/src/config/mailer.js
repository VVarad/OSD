import nodemailer from 'nodemailer';
import { env } from './env.js';

export function createMailerTransporter() {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // SSL on 465, STARTTLS on 587
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 30000,
  });
}

export const transporter = createMailerTransporter();

export async function verifyMailer() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD) {
    console.warn('[Mailer] SMTP credentials not fully configured.');
    return false;
  }

  try {
    await transporter.verify();
    console.log('[Mailer] SMTP connection verified successfully.');
    return true;
  } catch (err) {
    console.log('[debug]', env.SMTP_HOST, env.SMTP_PORT, env.SMTP_USER);
    console.error('[Mailer] SMTP verification failed:', err.message);
    return false;
  }
}