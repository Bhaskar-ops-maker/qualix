const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/disputes
router.get('/', (req, res) => {
  const { status, raisedBy } = req.query;
  let disputes = [...db.disputes];
  if (status) disputes = disputes.filter(d => d.status === status);
  if (raisedBy) disputes = disputes.filter(d => d.raisedBy === raisedBy);
  res.json(disputes);
});

// GET /api/disputes/:id
router.get('/:id', (req, res) => {
  const d = db.disputes.find(d => d.id === req.params.id);
  if (!d) return res.status(404).json({ error: 'Dispute not found' });
  res.json(d);
});

// POST /api/disputes  (raise dispute)
router.post('/', (req, res) => {
  const { caseId, reason } = req.body;
  if (!caseId || !reason) return res.status(400).json({ error: 'caseId and reason required' });

  const c = db.cases.find(c => c.id === caseId);
  if (!c) return res.status(404).json({ error: 'Case not found' });

  const num = `D-${String(db.disputes.length + 1).padStart(3, '0')}`;
  const dispute = {
    id: num,
    caseId,
    raisedBy: req.user.name,
    auditor: c.assignedTo || 'Unassigned',
    reason,
    status: 'Open',
    ageDays: 0,
    createdAt: new Date().toISOString().split('T')[0],
  };
  db.disputes.push(dispute);
  c.status = 'Disputed';
  res.status(201).json(dispute);
});

// PATCH /api/disputes/:id  (resolve / update status)
router.patch('/:id', (req, res) => {
  const d = db.disputes.find(d => d.id === req.params.id);
  if (!d) return res.status(404).json({ error: 'Dispute not found' });
  Object.assign(d, req.body);
  res.json(d);
});

module.exports = router;
