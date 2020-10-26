const express=require('express')
const route=express.Router()
const {check,validationResult}=require('express-validator')
const gravatar=require('gravatar')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const config=require('config')
const User=require('../../models/User.js')
//register 
//@access public
route.post('/',
[check('name','Name is Required')
 .not()
 .isEmpty(),
 check('email','please enter the email').isEmail(),
 check('password','please enter the password more than 6').isLength({min:6})
], 
async (req,res)=>{
   const errors=validationResult(req);
   if(!errors.isEmpty()){
   return res.status(400).json({errors:errors.array()})   
}
 const {name,email,password}=req.body
  //See if User exists
  try{  
    let user=await User.findOne({email:email})
    if(user){
     return  res.status(400).json({errors:[{msg:'User is already exist'}]})
    }
    const avatar=gravatar.url(email,{
     s:'200',
     r:'pg',
     d:'mm'
    });

   user=new User({
     name,
     email,
     password,
     avatar
   })
   const salt=await bcrypt.genSalt(10);
   user.password=await bcrypt.hash(password,salt)
   await user.save();
   const payload={
    user:{
      id:user.id
    }
   }
   jwt.sign(payload,config.get('jwtSecret'),{expiresIn:360000},(err,token)=>{
     if(err){
      throw err
     }
     res.json({token})
   })
  }
catch(err){
  console.error(err.message)
  res.status(500).send('Server Error')
}

   
});

module.exports=route