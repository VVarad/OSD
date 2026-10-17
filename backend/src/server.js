import express from 'express';
import cors from 'cors';
import { env, validateEnv } from './config/env.js';
import { verifyMailer } from './config/mailer.js';
import { emailRouter } from './routes/email.js';

validateEnv();

const app = express();

// Enable trust proxy for correct IP identification behind Render / reverse proxies
app.set('trust proxy', 1);

// Configure CORS
const allowedOrigins = env.FRONTEND_URL
  ? env.FRONTEND_URL.split(',').map((origin) => origin.trim().replace(/\/+$/, ''))
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      // Normalize origin
      const normalizedOrigin = origin.replace(/\/+$/, '');

      // In development or if explicitly allowed
      if (
        allowedOrigins.includes(normalizedOrigin) ||
        normalizedOrigin.startsWith('http://localhost:') ||
        normalizedOrigin.startsWith('http://127.0.0.1:')
      ) {
        return callback(null, true);
      }

      console.warn(`[CORS] Blocked request from unauthorized origin: ${origin}`);
      return callback(new Error(`Origin ${origin} not allowed by CORS.`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

// Request body parser with 10kb limit to prevent payload abuse
app.use(express.json({ limit: '10kb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'WLUG OSD 2K26 Email Service',
    timestamp: new Date().toISOString(),
  });
});

// Email API routes
app.use('/api', emailRouter);

// 404 handler for undefined endpoints
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found.',
  });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[Server] Unhandled error:', err.message);

  if (err.message && err.message.includes('not allowed by CORS')) {
    return res.status(403).json({
      success: false,
      message: 'CORS error: Request origin not allowed.',
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error.',
  });
});



if (!process.env.VERCEL) {

const server = app.listen(env.PORT, () => {
  console.log(`[Server] WLUG OSD 2K26 Email backend running on port ${env.PORT}`);
  console.log(`[Server] Allowed origins: ${allowedOrigins.join(', ')}`);

  // Verify SMTP connection
  verifyMailer();
})
};

export { app };
export default app;

//export { app, server };
