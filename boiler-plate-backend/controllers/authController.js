const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const userStore = require('../services/userStore');

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

function generateToken(user) {
  // user may be a mongoose doc or plain object
  const id = user._id || user.id;
  const email = user.email;
  return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  try {
    const existing = await userStore.findByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const user = await userStore.createUser({ name, email, password });

    const token = generateToken(user);
    return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await userStore.findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // If using mongoose model, user may have comparePassword
    let ok = false;
    if (typeof user.comparePassword === 'function') {
      ok = await user.comparePassword(password);
    } else {
      // in-memory fallback: compare using bcrypt
      const bcrypt = require('bcrypt');
      ok = await bcrypt.compare(password, user.password);
    }

    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await userStore.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
