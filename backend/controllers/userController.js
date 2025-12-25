/**
 * User Controller
 */
export const userController = {
  /**
   * Root endpoint
   */
  getRoot: (req, res) => {
    res.send("Secure Backend running 🔐");
  }
};