
const jwt = require("jsonwebtoken");
require("dotenv").config()

// Middleware to authenticate requests using JWT
function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
