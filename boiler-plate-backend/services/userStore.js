const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
let UserModel;
try {
  // require lazily — models/User may depend on mongoose
  // but it's okay if mongoose isn't connected
  // eslint-disable-next-line global-require
  UserModel = require('../models/User');
} catch (err) {
  UserModel = null;
}

// Simple in-memory store as fallback
const memory = new Map();
let idCounter = 1;

async function findByEmail(email) {
  // prefer MongoDB if connected
  if (mongoose.connection && mongoose.connection.readyState === 1 && UserModel) {
    return UserModel.findOne({ email });
  }
  const data = memory.get(email.toLowerCase());
  if (!data) return null;
  // mimic mongoose doc
  return { _id: data._id, name: data.name, email: data.email, password: data.password };
}

async function findById(id) {
  if (mongoose.connection && mongoose.connection.readyState === 1 && UserModel) {
    return UserModel.findById(id).select('-password');
  }
  for (const val of memory.values()) {
    if (String(val._id) === String(id)) return { _id: val._id, name: val.name, email: val.email };
  }
  return null;
}

async function createUser({ name, email, password }) {
  if (mongoose.connection && mongoose.connection.readyState === 1 && UserModel) {
    const u = new UserModel({ name, email, password });
    await u.save();
    return u;
  }

  // fallback: store hashed password in memory
  const hashed = await bcrypt.hash(password, 10);
  const user = { _id: `mem_${idCounter++}`, name, email: email.toLowerCase(), password: hashed };
  memory.set(user.email, user);
  return { _id: user._id, name: user.name, email: user.email, password: user.password };
}

module.exports = { findByEmail, createUser, findById };
