import bcrypt from 'bcryptjs';
import User from '../models/User';
import hashPassword from '../services/hash';

const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtExpiryTime = 3600;

const authController = {
  signup: async (req, res) => {
    const existingUser = await User.getByField('email', req.body.email);
    if (existingUser) {
      return res.status(401).json({ error: 'user already exists' });
    }
    const newUser = await User.create({ ...req.body, isAdmin: false, password: hashPassword(req.body.password) });
    return res.status(201).json(newUser);
  },

  signin: async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await User.getByField('email', email);
    const isCorrectPassword = existingUser && bcrypt.compareSync(password, existingUser.password);

    if (!isCorrectPassword) {
      return res.status(401).json({ error: 'user does not exist' });
    }
    const { id, name, isAdmin } = existingUser;
    // console.log('existingUser', existingUser);
    const token = jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
      expiresIn: jwtExpiryTime,
    });
    return res.status(200).json({ token, id, name, isAdmin });
  },
};
export default authController;
