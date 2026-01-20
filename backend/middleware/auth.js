const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user data to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    // 4. Continue to next middleware / controller
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
