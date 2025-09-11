const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No access token, not authorized" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Access token received:", token);

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).json({ msg: "Access token invalid or expired" });
  }
};

module.exports = verifyToken;
