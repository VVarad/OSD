import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory first, then root directory if needed
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  SMTP_HOST: (process.env.SMTP_HOST || '').trim(),
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '465', 10),
  SMTP_USER: (process.env.SMTP_USER || '').trim(),
  SMTP_PASSWORD: (process.env.SMTP_PASSWORD || '').trim(),
  EMAIL_FROM_NAME: (process.env.EMAIL_FROM_NAME || 'OSD 2K26 Team').trim(),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};

export function validateEnv() {
  const missing = [];
  if (!env.SMTP_HOST) missing.push('SMTP_HOST');
  if (!env.SMTP_USER) missing.push('SMTP_USER');
  if (!env.SMTP_PASSWORD) missing.push('SMTP_PASSWORD');

  if (missing.length > 0) {
    console.warn(`[Config] Warning: Missing environment variables: ${missing.join(', ')}`);
  } else {
    console.log(`[Config] Nodemailer configured for ${env.SMTP_USER} via ${env.SMTP_HOST}:${env.SMTP_PORT}`);
  }
}