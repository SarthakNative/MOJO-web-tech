import axios from "axios";

const IG_ACCESS_TOKEN = global.IG_ACCESS_TOKEN || null;

/**
 * Instagram Controller
 */
export const instagramController = {
  /**
   * Get media by ID
   */
  getMedia: async (req, res) => {
    try {
      const response = await axios.get(
        `https://graph.instagram.com/v24.0/${req.params.mediaId}`,
        {
          params: {
            fields: "id,owner,caption",
            access_token: global.IG_ACCESS_TOKEN,
          },
        }
      );
      res.json(response.data);
    } catch (e) {
      res.status(e.response?.status || 500).json(e.response?.data || { error: "Failed to fetch media" });
    }
  },

  /**
   * Get Instagram profile
   */
  getProfile: async (req, res) => {
    if (!global.IG_ACCESS_TOKEN || !global.IG_USER_ID) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const response = await axios.get(
        `https://graph.instagram.com/v24.0/me`,
        {
          params: {
            fields: "id,user_id,username,name,account_type,profile_picture_url,followers_count,follows_count,media_count",
            access_token: global.IG_ACCESS_TOKEN,
          },
        }
      );

      res.json(response.data);
    } catch (error) {
      console.error(
        "Profile fetch failed:",
        error.response?.data || error.message
      );
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  },

  /**
   * Get user feed
   */
  getFeed: async (req, res) => {
    if (!global.IG_ACCESS_TOKEN) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const response = await axios.get(
        "https://graph.instagram.com/me/media",
        {
          params: {
            fields:
              "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
            access_token: global.IG_ACCESS_TOKEN,
          },
        }
      );

      res.json(response.data);
    } catch (error) {
      console.error(
        "Feed fetch failed:",
        error.response?.data || error.message
      );
      res.status(500).json({ error: "Failed to fetch feed" });
    }
  },

  /**
   * Get comments for media
   */
  getComments: async (req, res) => {
    const { mediaId } = req.params;

    if (!global.IG_ACCESS_TOKEN) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const response = await axios.get(
        `https://graph.instagram.com/v24.0/${mediaId}/comments`,
        {
          params: {
            fields: "id,text,username,timestamp",
            access_token: global.IG_ACCESS_TOKEN,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error(
        "Fetch comments failed:",
        error.response?.data || error.message
      );
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  },

  /**
   * Reply to a comment
   */
  replyToComment: async (req, res) => {
    const { commentId } = req.params;
    const { message } = req.body;

    if (!global.IG_ACCESS_TOKEN) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const response = await axios.post(
        `https://graph.instagram.com/v24.0/${commentId}/replies`,
        null,
        {
          params: {
            message,
            access_token: global.IG_ACCESS_TOKEN,
          },
        }
      );

      res.json(response.data);
    } catch (error) {
      console.error(
        "Reply failed:",
        error.response?.data || error.message
      );
      res.status(500).json({ error: "Failed to reply to comment" });
    }
  }
};