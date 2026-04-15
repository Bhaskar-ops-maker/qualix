const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/stats/overview
router.get('/overview', (req, res) => {
  const total = db.cases.length;
  const completed = db.cases.filter(c => c.status === 'Completed').length;
  const pending = db.cases.filter(c => c.status === 'Pending Review').length;
  const inProgress = db.cases.filter(c => c.status === 'In Progress').length;
  const disputed = db.cases.filter(c => c.status === 'Disputed').length;
  const openDisputes = db.disputes.filter(d => d.status === 'Open').length;
  const scores = db.cases.filter(c => c.score !== null).map(c => c.score);
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  res.json({ total, completed, pending, inProgress, disputed, openDisputes, avgScore });
});

// GET /api/stats/agents
router.get('/agents', (req, res) => {
  const byScore = [...db.agents].sort((a, b) => b.avgScore - a.avgScore);
  const bySite = {
    India: db.agents.filter(a => a.site === 'India'),
    Manila: db.agents.filter(a => a.site === 'Manila'),
  };
  res.json({ leaderboard: byScore, bySite });
});

module.exports = router;
