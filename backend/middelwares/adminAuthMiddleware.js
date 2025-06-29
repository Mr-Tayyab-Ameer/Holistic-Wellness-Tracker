import jwt from 'jsonwebtoken';

const adminAuthMiddleware = (req, res, next) => {
  // Extract token from the Authorization header: "Bearer <token>"
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. Admins only.' });
    }

    // Attach decoded admin info to request
    req.admin = { _id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

export default adminAuthMiddleware;
