const express=require('express')
const route=express.Router()
const auth=require('../../Middleware/Auth')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const config=require('config')
const {check,validationResult}=require('express-validator')
const User=require('../../models/User')
//@access public
route.get('/',auth, async (req,res)=>{
 try{
   const user=await User.findById(req.user.id).select('-password');
    res.json(user) 
}
 catch(err){
   res.status(500).send('Server Error')
 }
 })

route.post('/',
[check('email','please enter the email').isEmail(),
 check('password','please enter the password ').exists()
], 
async (req,res)=>{
   const errors=validationResult(req);
   if(!errors.isEmpty()){
   return res.status(400).json({errors:errors.array()})   
}
 const {email,password}=req.body
  //See if User exists
  try{ 
    let user=await User.findOne({email})
    if(!user){
     return  res.status(400).json({errors:[{msg:'Invalid Credetentials'}]})
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
      return  res.status(400).json({errors:[{msg:'Invalid Credetentials'}]})
    } 
   const payload={
    user:{
      id:user.id
    }
   }
   jwt.sign(payload,config.get('jwtSecret'),{expiresIn:390000},(err,token)=>{
     if(err){
       throw err;
     }
     res.json({token})
   })
  }
  catch(err){
  console.error(err.message)
  res.status(500).send('Server Error')
 }
   
})

module.exports=route