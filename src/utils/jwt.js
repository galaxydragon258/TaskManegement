const jwt = require('jsonwebtoken');
const User = require ('../model/User')
require('dotenv').config()

const generateToken = (userId)=>{
    return jwt.sign(
        {id:userId},
        process.env.JWT_SECRET,
        {expiresIn:'10d'}
    );
};


const protect = async (req,res,next) =>{///auth middleware
    let token ='';

    console.log('protect MiddleWare working')
    if(req.headers.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
        console.log(token)
        
    }
      if (!token)
        return res.status(401).json({ error: 'No Token' });

      ////verify yung token if hinde tampered
      try{

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        console.log(process.env.JWT_SECRET)
        console.log(decoded);

        req.user = await User.findById(decoded.id).select('-password');
        console.log(req.user)

        if (!req.user) return res.status(401).json({ error: 'User not found' });

        next();
      }
      catch(error){
        console.error(`Errro:${error.message}`);
        return res.status(401).json({ error: 'Not authorized' });

      }

};

module.exports = {generateToken,protect}