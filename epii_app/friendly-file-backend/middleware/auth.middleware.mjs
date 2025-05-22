import jwt from 'jsonwebtoken';

// TODO: Move this to environment variables and ensure it's the same as in user.controller.mjs
const JWT_SECRET = 'your-super-secret-and-long-random-string';

const authMiddleware = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');

  // Check if not token
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  // Check if token is in Bearer format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ success: false, message: 'Token not in Bearer format' });
  }

  const token = parts[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Add user from payload
    req.user = decoded; // decoded will contain { userId, email, role }
    next();
  } catch (e) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

export default authMiddleware;
