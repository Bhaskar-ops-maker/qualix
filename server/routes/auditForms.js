const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/audit-forms
router.get('/', (req, res) => {
  const { auditor, caseId, status } = req.query;
  let forms = [...db.auditForms];
  if (auditor) forms = forms.filter(f => f.auditor === auditor);
  if (caseId) forms = forms.filter(f => f.caseId === caseId);
  if (status) forms = forms.filter(f => f.status === status);
  res.json(forms);
});

// GET /api/audit-forms/:id
router.get('/:id', (req, res) => {
  const f = db.auditForms.find(f => f.id === req.params.id);
  if (!f) return res.status(404).json({ error: 'Form not found' });
  res.json(f);
});

// POST /api/audit-forms  (save draft or submit)
router.post('/', (req, res) => {
  const { caseId, auditType, answers, metadata, status } = req.body;
  if (!caseId || !auditType) return res.status(400).json({ error: 'caseId and auditType required' });

  // Check for existing draft for same case+auditor
  const existing = db.auditForms.find(f => f.caseId === caseId && f.auditor === req.user.name && f.status === 'Draft');
  if (existing) {
    Object.assign(existing, { auditType, answers, metadata, status: status || 'Draft', updatedAt: new Date().toISOString() });
    return res.json(existing);
  }

  const form = {
    id: uuidv4(),
    caseId,
    auditor: req.user.name,
    auditType,
    answers: answers || {},
    metadata: metadata || {},
    status: status || 'Draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.auditForms.push(form);

  if (status === 'Submitted') {
    const c = db.cases.find(c => c.id === caseId);
    if (c) c.status = 'Completed';
  }

  res.status(201).json(form);
});

// PATCH /api/audit-forms/:id
router.patch('/:id', (req, res) => {
  const f = db.auditForms.find(f => f.id === req.params.id);
  if (!f) return res.status(404).json({ error: 'Form not found' });
  Object.assign(f, req.body, { updatedAt: new Date().toISOString() });

  if (req.body.status === 'Submitted') {
    const c = db.cases.find(c => c.id === f.caseId);
    if (c) c.status = 'Completed';
  }
  res.json(f);
});

module.exports = router;
