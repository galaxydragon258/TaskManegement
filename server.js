const express = require('express');
const app = express();
require('dotenv').config();
const {connectDB} = require('./src/database');
app.use(express.json());
const {protect} = require('./src/utils/jwt')
const {login,getMe} =require('./src/controler/loginController');
const {register} = require('./src/controler/registrationController');
const {router} = require('./src/routes/taskRoute');
const {getStatisctics} = require('./src/utils/statistics');
const cors = require('cors');

app.use(cors());

// ===== HEALTH CHECK ENDPOINT =====
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'TaskFlow API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ===== BASIC ROUTES =====
app.get('/', (req, res) => {
  res.json({
    message: 'TaskFlow API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      register: '/register',
      login: '/login',
      tasks: '/tasks'
    }
  });
});

// Test endpoint
app.get('/hi', (req, res) => {
  res.json({message: "hello"});
});

// ===== AUTH ROUTES =====
app.post('/register', register);
app.post('/login', login);
app.get('/get', protect, getMe);

// ===== TASK ROUTES =====
app.use('/tasks', router);

// ===== ERROR HANDLING =====
// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;

// Connect to database FIRST, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌍 API URL: http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});