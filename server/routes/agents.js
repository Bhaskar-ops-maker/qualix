const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/agents
router.get('/', (req, res) => {
  const { site } = req.query;
  let agents = [...db.agents];
  if (site) agents = agents.filter(a => a.site === site);
  res.json(agents);
});

// GET /api/auditors
router.get('/auditors', (req, res) => res.json(db.auditors));

// GET /api/agents/associates
router.get('/associates', (req, res) => res.json(db.associates));

// POST /api/agents/associates/:id/remind
router.post('/associates/:id/remind', (req, res) => {
  const a = db.associates.find(a => a.id === req.params.id);
  if (!a) return res.status(404).json({ error: 'Not found' });
  a.feedbackSent = true;
  res.json(a);
});

// POST /api/agents/associates/:id/coach
router.post('/associates/:id/coach', (req, res) => {
  const a = db.associates.find(a => a.id === req.params.id);
  if (!a) return res.status(404).json({ error: 'Not found' });
  a.coachingDone = true;
  res.json(a);
});

// POST /api/agents/associates/:id/flag
router.post('/associates/:id/flag', (req, res) => {
  const a = db.associates.find(a => a.id === req.params.id);
  if (!a) return res.status(404).json({ error: 'Not found' });
  a.atRisk = !a.atRisk;
  res.json(a);
});

module.exports = router;
