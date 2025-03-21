import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, token missing' });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch the user excluding the password field
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired, please log in again' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token, authorization denied' });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
