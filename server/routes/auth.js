const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const user = db.users.find(u => u.email === email && u.active);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// POST /api/auth/signup
router.post('/signup', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ error: 'All fields required' });
  if (db.users.find(u => u.email === email)) return res.status(409).json({ error: 'Email already exists' });

  const validRoles = ['Manager', 'Tester', 'Quality Auditor'];
  if (!validRoles.includes(role)) return res.status(400).json({ error: 'Invalid role' });

  const newUser = { id: uuidv4(), name, email, password: bcrypt.hashSync(password, 10), role, active: true };
  db.users.push(newUser);

  const token = jwt.sign({ id: newUser.id, name, email, role }, JWT_SECRET, { expiresIn: '8h' });
  res.status(201).json({ token, user: { id: newUser.id, name, email, role } });
});

module.exports = router;
