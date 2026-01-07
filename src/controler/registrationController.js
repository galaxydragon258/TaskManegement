const User = require ('../model/User')
const {generateToken} = require('../utils/jwt')

const register = async (req,res)=>{
    const {name,email,password} = req.body;

    const existEmail = await User.findOne({email});
    if(existEmail){
        return res.status(400).json({
            error:"User alread  y exist"
        })
    }

    const user = await User.create({
        name,
        email,
        password
    })


    const token = generateToken(user._id);

    res.status(200).json({
        success:true,
        token,
        user:{id:user._id,name,email}
    })

}
module.exports = {register}