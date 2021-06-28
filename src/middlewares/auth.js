import jwt from 'jsonwebtoken';

require('dotenv').config();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ error: 'user unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      return res.status(403).json({ error: 'unauthorized' });
    }
    req.decoded = authData;
    console.log(req.decoded)
    next();
  });
};

export const verifyAsAdmin = (req, res, next) => {
  if (!req.decoded.isAdmin) {
    return res.status(403).json({ error: 'user unauthorized' });
  }
  next();
};

export const verifyAsOwner = (req, res, next) => {
  if (!req.decoded.id) {
    return res.status(403).json({ error: 'user unauthorized' });
  }
  next();
}

export default verifyToken;
