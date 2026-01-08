const express = require('express');
const app = express();
require('dotenv').config();
const {connectDB} = require('./database');
app.use(express.json());
const {protect} = require('./utils/jwt')
const {login,getMe} =require('./controler/loginController');
const {register} = require('./controler/registrationController');
const {router} = require('./routes/taskRoute');
const {getStatisctics} = require('./utils/statistics');
const cors = require('cors');


app.use(cors());
connectDB();


app.post('/register', register);
app.post('/login', login);

app.get('/get',protect,getMe);

app.use('/tasks',router);




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