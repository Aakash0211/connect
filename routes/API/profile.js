const express=require('express')
const route=express.Router()
const auth=require('../../Middleware/Auth.js')
const Profile=require('../../models/Profile')
const User=require('../../models/User')
const Post =require('../../models/Posts')
const {check,validationResult}=require('express-validator')
//@access public
route.get('/me',auth,async (req,res)=>{
    try{
      const profile=await Profile.findOne({user:req.user.id}).populate('user',['name','avatar'])
      if(!profile){
       return res.status(400).json({msg:"no profile"})
      }
      res.json(profile);
    }
    catch(err){
      console.log(err.message)
      res.status(500).send("Server Error")
    }
})

route.post('/',[auth,[
   check("status",'status is required').not().isEmpty(),
   check("skills","skills is required one").not().isEmpty()
]], async (req,res)=>{
  const errors=validationResult(req)
  if(!errors.isEmpty()){
    res.status(400).json({errors:errors.array()})
  }
  const {
   company,
   website,
   location,
   bio,
   status,
   githubusername,
   skills,
   youtube,
   facebook,
   twitter,
   instagram,
   linkedin 
  }=req.body
const profileFields={}
profileFields.user=req.user.id
if(company) profileFields.company=company

if(website){
   profileFields.website=website
  }
if(location){
   profileFields.location=location
}
if(bio){
   profileFields.bio=bio
  }
if(status){
 profileFields.status=status
}
if(githubusername){
   profileFields.githubusername=githubusername
  }
   profileFields.skills=Array.isArray(skills)
   ? skills
   : skills.split(',').map((skill) => ' ' + skill.trim()),
  

 profileFields.social={};
 if(youtube) profileFields.social.youtube=youtube
 if(twitter) profileFields.social.twitter=twitter
 if(twitter) profileFields.social.facebook=facebook
 if(linkedin) profileFields.social.linkedin=linkedin
 if(instagram) profileFields.social.instagram=instagram
 try{
  let profile=await Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true,upsert:true})
    res.json(profile)
   }
 catch(err){
   console.error(err.message)
   res.status(500).send("server error")
 }
})

//get all profiles 
//@public
route.get('/', async (req,res)=>{
  try {
   const profiles= await Profile.find().populate('user',['name','avatar'])
   res.json(profiles)
  } catch (err) {
     console.error(err.message)
     res.status(500).send("server error")
  }
})
//get profile of a id
route.get('/user/:user_id', async (req,res)=>{
   try {
    const profile= await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar'])
    if(!profile) return res.status(400).send("profile not found")
    res.json(profile)
   } catch (err) {
      console.error(err.message)
      if(err.kind=='Objectid')
       res.status(400).send('profile not found')
      res.status(500).send("server error")
   }
 })
 route.delete('/',auth,async (req,res)=>{
   try {
    await Post.deleteMany({user:req.user.id})
    await Profile.findOneAndRemove({user:req.user.id})
    await User.findOneAndRemove({ _id:req.user.id})
    res.json({msg:"User deleted"})
   } catch (err) {
      console.error(err.message)
      res.status(500).send("server error")
   }
 })
  route.put('/experience',[auth,[check('title','title is required').not().isEmpty(),check('company','company is required').not().isEmpty(),check('from','from date is required').not().isEmpty()]],async (req,res)=>{
   const errors=validationResult(req)
   if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
   }
   const {title,company,from ,to,location,current,description}=req.body;
   const newExp={
     title,
     company,
     location,
     from,
     to,
     current,
     description
   }
   try {
     const profile=await Profile.findOne({user:req.user.id});
     profile.experience.unshift(newExp);
     await profile.save()
     res.json(profile)
   } catch (err) {
     console.error(err.message)
     res.status(500).send('server error') 
   }
  })
  route.delete('/experience/:exp_id',auth,async (req,res)=>{
    try {
      //const foundProfile = await Profile.findOneAndUpdate( { user: req.user.id },
			//  { $pull: { experience: { _id: req.params.exp_id }}},
			//  {new: true});
      const foundProfile = await Profile.findOne({ user: req.user.id });
    
      // Filter exprience array using _id (NOTE: _id is a BSON type needs to be converted to string)
      // This can also be omitted and the next line and findOneAndUpdate to be used instead (above implementation)
      foundProfile.experience = foundProfile.experience.filter(exp => exp._id.toString() !== req.params.exp_id);
      
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    }
   catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
  })
  route.put('/education',[auth,[check('school' ,'school is required').not().isEmpty(),check('degree','degree is required').not().isEmpty(),check('fieldofstudy','fieldofstudy is required').not().isEmpty(),check('from', 'From date is required')
  .not()
  .isEmpty()]],async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
     return res.status(400).json({errors:errors.array()})
    }
    const {school,degree,fieldofstudy,from,to,current,description}=req.body;
    const newEdu={
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    }
    try {
      const profile=await Profile.findOne({user:req.user.id});
      profile.education.unshift(newEdu);
      await profile.save()
      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('server error') 
    }
   })
   route.delete('/education/:edu_id',auth,async (req,res)=>{
    try {
      const foundProfile = await Profile.findOne({ user: req.user.id });
      const eduIds = foundProfile.education.map(edu => edu._id.toString());
      // if i dont add .toString() it returns this weird mongoose coreArray and the ids are somehow objects and it still deletes anyway even if you put /education/5
      const removeIndex = eduIds.indexOf(req.params.edu_id);
      if (removeIndex === -1) {
        return res.status(400).json({ msg: "id not found" });
      } else {
        // theses console logs helped me figure it out
        /*   console.log("eduIds", eduIds);
        console.log("typeof eduIds", typeof eduIds);
        console.log("req.params", req.params);
        console.log("removed", eduIds.indexOf(req.params.edu_id));
   */ foundProfile.education.splice(
          removeIndex,
          1,
        );
        await foundProfile.save();
        return res.status(200).json(foundProfile);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Server error" });
    }
  }); 

module.exports=route 