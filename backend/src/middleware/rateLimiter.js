import rateLimit from 'express-rate-limit';

/**
 * Rate limiter middleware for the email endpoint.
 * Prevents automated scripts and abuse from exhausting SMTP quotas.
 */
export const emailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 email sends per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many email requests from this IP address. Please try again in 15 minutes.',
  },
});
