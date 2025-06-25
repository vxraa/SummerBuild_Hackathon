const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log("Authorization header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: 'No Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  console.log("Parsed token:", token);

  if (!token) {
    return res.status(401).json({ message: 'No token found' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT verification error:", err);
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user; // attach decoded token payload to req.user
    next();
  });
}

module.exports = authenticateToken;
