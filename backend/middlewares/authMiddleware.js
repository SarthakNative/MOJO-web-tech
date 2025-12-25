/**
 * Authentication middleware
 * Checks if user is authenticated with Instagram
 */
export const requireAuth = (req, res, next) => {
  if (!global.IG_ACCESS_TOKEN || !global.IG_USER_ID) {
    return res.status(401).json({
      error: "Authentication required",
      message: "Please authenticate with Instagram first"
    });
  }
  next();
};

/**
 * Optional auth middleware
 * Continues even if not authenticated, but adds auth info to request
 */
export const optionalAuth = (req, res, next) => {
  req.isAuthenticated = !!(global.IG_ACCESS_TOKEN && global.IG_USER_ID);
  req.userId = global.IG_USER_ID;
  next();
};