const express = require('express');
const { scanPage } = require('./scanner');

const app = express();
app.use(express.json());


app.post('/scan', async (req, res) => {
  try {
    console.log('Incoming body:', req.body);

    const { url } = req.body;

    if (!url) {
      console.error('Missing URL in request body');
      return res.status(400).json({ error: 'URL is required' });
    }

    const results = await scanPage(url);

    const formatted = results.violations.map(v => ({
      issue: v.description,
      impact: v.impact,
      help: v.help,
      wcag: v.tags,
      nodes: v.nodes.map(n => ({
        element: n.target,
        failure: n.failureSummary
      }))
    }));

    res.json({ issues: formatted });
  } catch (err) {
    console.error('Scan error:', err);
    res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



