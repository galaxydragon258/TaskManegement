const User = require ('../model/User')
const bcrypt = require('bcryptjs');
const {generateToken} = require('../utils/jwt')



const login= async (req,res)=>{
    const {email,password} = req.body;
     
    const user = await User.findOne({email}).select('+password');
    if(!user) return res.status(400).json({error:"user not found"});


    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });


    const token = generateToken(user._id);
      res.json({ success: true,
         token, 
         user: { id: user._id, email } });
}

const getMe = async (req,res)=>{
      const user = await User.findById(req.user.id);
        res.json({ success: true, user });
}
module.exports = {login,getMe};