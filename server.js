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
connectDB();


app.post('/register', register);
app.post('/login', login);

app.get('/get',protect,getMe);

app.use('/tasks',router);


app.get('/api/health', (req, res) => {
  try {
    res.json({
      status: 'healthy',
      message: 'API is running',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Even if JSON fails, send plain text
    res.status(200).send('OK');
  }
});




app.get('/',(req,res)=>{
  res.status(201).json({
    ok:true
  })
})




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});