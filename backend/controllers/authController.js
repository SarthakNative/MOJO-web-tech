import axios from "axios";

const IG_ACCESS_TOKEN = global.IG_ACCESS_TOKEN || null;
const IG_USER_ID = global.IG_USER_ID || null;

/**
 * Auth Controller
 */
export const authController = {
  /**
   * STEP 1: Redirect to Instagram Login
   */
  redirectToInstagramAuth: (req, res) => {
    const authUrl =
      "https://www.instagram.com/oauth/authorize" +
      "?client_id=" + process.env.INSTAGRAM_APP_ID +
      "&redirect_uri=" + encodeURIComponent(process.env.INSTAGRAM_REDIRECT_URI) +
      "&scope=" +
      [
        "instagram_business_basic",
        "instagram_business_manage_comments",
        "instagram_business_content_publish",
      ].join(",") +
      "&response_type=code";

    res.redirect(authUrl);
  },

  /**
   * STEP 2: Handle Instagram Callback
   */
  handleInstagramCallback: async (req, res) => {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send("Authorization code missing");
    }

    try {
      const tokenResponse = await axios.post(
        "https://api.instagram.com/oauth/access_token",
        new URLSearchParams({
          client_id: process.env.INSTAGRAM_APP_ID,
          client_secret: process.env.INSTAGRAM_APP_SECRET,
          grant_type: "authorization_code",
          redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
          code,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token, user_id } = tokenResponse.data;

      console.log("Instagram Access Token:", access_token);
      console.log("Instagram User ID:", user_id);

      // Store in global (replace with DB/session later)
      global.IG_ACCESS_TOKEN = access_token;
      global.IG_USER_ID = user_id;

      res.redirect(process.env.FRONTEND_URL);

    } catch (error) {
      console.error(
        "Token exchange failed:",
        error.response?.data || error.message
      );
      res.status(500).send("Token exchange failed");
    }
  },

  /**
   * Logout endpoint
   */
  logout: (req, res) => {
    try {
      // Clear stored tokens
      global.IG_ACCESS_TOKEN = null;
      global.IG_USER_ID = null;

      res.status(200).json({
        success: true,
        message: "Successfully logged out"
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        error: "Logout failed"
      });
    }
  },

  /**
   * Check authentication status
   */
  checkAuthStatus: (req, res) => {
    const isAuthenticated = !!(global.IG_ACCESS_TOKEN && global.IG_USER_ID);
    
    res.status(200).json({
      authenticated: isAuthenticated,
      user_id: isAuthenticated ? global.IG_USER_ID : null
    });
  }
};