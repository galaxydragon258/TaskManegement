const express = require('express');
const app = express();
require('dotenv').config();
const {connectDB} = require('./database');
app.use(express.json());
const {protect} = require('./utils/jwt')
const {login,getMe} =require('./controler/loginController');
const {register} = require('./controler/registrationController');

connectDB();


app.post('/register', register);
app.post('/login', login);

app.get('/get',protect,getMe);






const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});