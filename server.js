const express = require('express');
const { scanPage } = require('./scanner');

const app = express();
app.use(express.json());

app.post('/scan', async (req, res) => {
  const { url } = req.body;

  try {
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
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));



