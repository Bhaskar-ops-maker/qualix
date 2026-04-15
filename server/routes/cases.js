const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/cases
router.get('/', (req, res) => {
  const { status, assignedTo, type } = req.query;
  let cases = [...db.cases];
  if (status) cases = cases.filter(c => c.status === status);
  if (assignedTo) cases = cases.filter(c => c.assignedTo === assignedTo);
  if (type) cases = cases.filter(c => c.type === type);
  res.json(cases);
});

// GET /api/cases/:id
router.get('/:id', (req, res) => {
  const c = db.cases.find(c => c.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Case not found' });
  res.json(c);
});

// POST /api/cases
router.post('/', (req, res) => {
  if (!['Manager', 'Quality Auditor'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  const { assignedTo, type, priority } = req.body;
  const num = db.cases.length + 1001 + Math.floor(Math.random() * 100);
  const newCase = {
    id: `C-${num}`,
    status: 'Pending Review',
    assignedTo: assignedTo || '',
    type: type || 'Pass',
    priority: priority || 'Medium',
    createdAt: new Date().toISOString().split('T')[0],
    score: null,
  };
  db.cases.push(newCase);
  res.status(201).json(newCase);
});

// PATCH /api/cases/:id
router.patch('/:id', (req, res) => {
  const c = db.cases.find(c => c.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Case not found' });
  Object.assign(c, req.body);
  res.json(c);
});

// GET /api/cases/bin/list
router.get('/bin/list', (req, res) => res.json(db.binCases));

// POST /api/cases/bin/:id/accept
router.post('/bin/:id/accept', (req, res) => {
  const bc = db.binCases.find(b => b.id === req.params.id);
  if (!bc) return res.status(404).json({ error: 'Not found' });
  bc.status = 'Accepted';
  res.json(bc);
});

// POST /api/cases/bin/:id/reject
router.post('/bin/:id/reject', (req, res) => {
  const bc = db.binCases.find(b => b.id === req.params.id);
  if (!bc) return res.status(404).json({ error: 'Not found' });
  bc.status = 'Rejected';
  res.json(bc);
});

// GET /api/cases/workflow/list
router.get('/workflow/list', (req, res) => res.json(db.workflowCases));

module.exports = router;
