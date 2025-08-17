import rateLimit from "express-rate-limit";

export const createRateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    message: {
      status: 429,
      message: options.message || "Too many requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export const standardLimiter = createRateLimiter();

export const strictLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 500,
});

export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

// OTP attempt limiter for mobileNumber or email

const otpAttempts = new Map();  // Shared store for OTP attempts

export const otpLimiterMiddleware = (req, res, next) => {
  // Support both mobileNumber and email for OTP limiting
  const identifier = req.body.mobileNumber || req.body.email;

  if (!identifier) {
    return res.status(400).json({ success: false, message: "Mobile number or email is required" });
  }

  const now = Date.now();
  const blockDuration = 15 * 60 * 1000;
  const maxAttempts = 5;
  const windowTime = 15 * 60 * 1000;

  const record = otpAttempts.get(identifier);

  if (record) {
    if (record.blockedUntil && record.blockedUntil > now) {
      const waitMinutes = Math.ceil((record.blockedUntil - now) / 60000);
      return res.status(429).json({
        success: false,
        message: `Too many OTP requests. Try again after ${waitMinutes} minute(s).`,
      });
    }

    if (now - record.firstAttemptAt > windowTime) {
      otpAttempts.set(identifier, { attempts: 1, firstAttemptAt: now });
    } else {
      record.attempts += 1;
      if (record.attempts > maxAttempts) {
        record.blockedUntil = now + blockDuration;
        return res.status(429).json({
          success: false,
          message: "Too many OTP requests. You are blocked for 15 minutes.",
        });
      }
    }
  } else {
    otpAttempts.set(identifier, { attempts: 1, firstAttemptAt: now });
  }

  next();
};

// Export otpAttempts to reset attempts after successful OTP validation
export { otpAttempts };
