const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access Denied: No Token Provided!" });
  }

  try {
    const verified = jwt.verify(token, "your_jwt_secret_key");
    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token!" });
  }
};

const isAdmin = (req, res, next) => {
  // Check if req.user exists and has the role property
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).send("Access denied. Admins only.");
  }
  next();
};

module.exports = { verifyToken, isAdmin };
