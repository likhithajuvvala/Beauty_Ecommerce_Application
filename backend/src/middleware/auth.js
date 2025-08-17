import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export function auth(required = true) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      if (required) return res.status(401).json({ message: 'Missing token' });
      else return next();
    }
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
      next();
    } catch {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
}
