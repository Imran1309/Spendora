const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authentication token, authorization denied.' });
    }

    const token = authHeader.replace('Bearer ', '');
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = verified.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token verification failed, authorization denied.' });
  }
};

module.exports = auth;
