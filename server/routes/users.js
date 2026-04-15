const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/users
router.get('/', (req, res) => {
  const users = db.users.map(({ password, ...u }) => u);
  res.json(users);
});

// POST /api/users  (admin create)
router.post('/', (req, res) => {
  if (req.user.role !== 'Manager') return res.status(403).json({ error: 'Forbidden' });
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ error: 'All fields required' });
  if (db.users.find(u => u.email === email)) return res.status(409).json({ error: 'Email already exists' });

  const newUser = { id: uuidv4(), name, email, password: bcrypt.hashSync(password, 10), role, active: true };
  db.users.push(newUser);
  const { password: _, ...safe } = newUser;
  res.status(201).json(safe);
});

// PATCH /api/users/:id/revoke
router.patch('/:id/revoke', (req, res) => {
  if (req.user.role !== 'Manager') return res.status(403).json({ error: 'Forbidden' });
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.active = false;
  res.json({ success: true });
});

// PATCH /api/users/:id/restore
router.patch('/:id/restore', (req, res) => {
  if (req.user.role !== 'Manager') return res.status(403).json({ error: 'Forbidden' });
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.active = true;
  res.json({ success: true });
});

module.exports = router;
