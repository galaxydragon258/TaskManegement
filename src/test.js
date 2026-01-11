// test.js - SIMPLE server that always works
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('*', (req, res) => {
  res.json({
    path: req.path,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`✅ Should work at: http://localhost:${PORT}/api/health`);
});