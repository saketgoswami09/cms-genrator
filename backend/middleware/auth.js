const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false, // Added for consistency with your controllers
        message: "Authorization token missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user data to request
    // Ensure the properties match what you actually sign in your login controller
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    // 4. Continue to next middleware / controller
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    // Distinguish between an expired token and a completely invalid one
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please log in again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid authentication token",
    });
  }
};
