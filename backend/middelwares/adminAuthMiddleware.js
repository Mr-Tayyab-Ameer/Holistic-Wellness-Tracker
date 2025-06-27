// ✅ adminAuthMiddleware.js
import jwt from 'jsonwebtoken';

const adminAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') return res.sendStatus(403);

    req.admin = { _id: decoded.id, role: decoded.role };
    next();
  } catch {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export default adminAuthMiddleware; // ✅ this line is the key
