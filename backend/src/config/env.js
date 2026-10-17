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
  EMAIL_USER: (process.env.EMAIL_USER || '').trim(),
  EMAIL_APP_PASSWORD: (process.env.EMAIL_APP_PASSWORD || '').trim().replace(/\s+/g, ''),
  EMAIL_FROM_NAME: (process.env.EMAIL_FROM_NAME || 'OSD 2K26 Team').trim(),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};

export function validateEnv() {
  const missing = [];
  if (!env.EMAIL_USER) missing.push('EMAIL_USER');
  if (!env.EMAIL_APP_PASSWORD) missing.push('EMAIL_APP_PASSWORD');

  if (missing.length > 0) {
    console.warn(`[Config] Warning: Missing environment variables: ${missing.join(', ')}`);
  } else {
    console.log(`[Config] Nodemailer configured for user: ${env.EMAIL_USER}`);
  }
}
