const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Security & parsing
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*' }));
app.use(express.json());

// Serve qualix.html as the root
app.use(express.static(path.join(__dirname, '..')));

// API routes
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/users',       require('./routes/users'));
app.use('/api/cases',       require('./routes/cases'));
app.use('/api/disputes',    require('./routes/disputes'));
app.use('/api/agents',      require('./routes/agents'));
app.use('/api/audit-forms', require('./routes/auditForms'));
app.use('/api/stats',       require('./routes/stats'));

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Fallback — serve qualix.html for any non-API route
app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', 'qualix.html'));
  } else next();
});

app.listen(PORT, () => {
  console.log(`QUALIX API running at http://localhost:${PORT}`);
  console.log(`  Frontend → http://localhost:${PORT}/qualix.html`);
  console.log(`  API docs → http://localhost:${PORT}/api/health`);
});
