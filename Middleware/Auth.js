const jwt =require('jsonwebtoken')
const config=require('config')


module.exports=async function(req,res,next){
//get token
const token =req.header('x-auth-token')
//check if no token
if(!token){
 return res.status(401).json({msg:'No token,authourization denied'})
}
try {
 await jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
    if (error) {
      console.error(error)
     return res.status(401).json({ msg: 'Token is not valid' });
    } else {
      req.user = decoded.user;
      next();
    }
  });
} catch (err) {
  console.error('something went wrong with auth')
  res.status(500).json({ msg: 'Server Error' })
}
}