const express=require('express')
const route=express.Router()
const {check,validationResult}=require('express-validator')
const auth=require('../../Middleware/Auth')
const Post=require('../../models/Posts')
const Profile=require('../../models/Profile')
const User=require('../../models/User')
//@access public
route.post('/',[auth,[check('text','text is required').not().isEmpty()]],async (req,res)=>{
   const errors=validationResult(req)
   if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
   }
   try{
   const user=await User.findById(req.user.id).select('-password')

   const newPost=new Post({
   text:req.body.text,
   user:req.user.id,
   name:user.name,
   avatar:user.avatar,
   })
   const post=await newPost.save()
   res.json(post)
   }
   catch(err){
      res.status(500).send('server error')
   }
})

//@private
//get posts
route.get('/',auth,async (req,res)=>{
 try {
    const posts= await Post.find().sort({date:-1})
    res.json(posts)
 } catch (err) {
    console.error(err.message)
    res.status(500).send('server error')
 }
})
//get posts by id
route.get('/:id',auth,async (req,res)=>{
   try {
      const post= await Post.findById(req.params.id)
      if(!post){
       return res.status(404).json({msg:"post not found"})
      }
      res.json(post)
   } catch (err) {
      console.error(err.message)
    if(err.kind ==='ObjectId'){
      return res.status(404).json({msg:"post not found"})
    }
    res.status(500).send('server error')
   }
  })
route.delete('/:id',auth,async (req,res)=>{
   try {
      const post= await Post.findById(req.params.id)
      if(!post){
         return res.status(404).json({msg:"post not found"})
        }
      if(post.user.toString()!== req.user.id){
       return res.status(401).json({msg:"user not found"})
      }
      await post.remove()
      res.json({msg:'post removed'})
   } catch (err) {
      console.error(err.message)
      if(err.kind ==='ObjectId'){
         return res.status(404).json({msg:"post not found"})
       }
      res.status(500).send('server error')
   }
})
route.put('/like/:id',auth,async (req,res)=>{
 try {
   const  post=await Post.findById(req.params.id)
   if (post.likes.some(like => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
   post.likes.unshift({user:req.user.id})
   await post.save()
   return res.json(post.likes)
 } catch (err) {
    console.error(err.message);
    res.status(500).send('server error')
 }
})
route.put('/unlike/:id',auth,async (req,res)=>{
   try {
     const  post=await Post.findById(req.params.id)
     if (!post.likes.some(like => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
      }
      // remove the like
      post.likes = post.likes.filter(
      ({ user }) => user.toString() !== req.user.id
      );
      await post.save();
     return res.json(post.likes)
   } catch (err) {
      console.error(err.message);
      res.status(500).send('server error')
   }
  })
  route.post('/comment/:id',[auth,[check('text','text is required').not().isEmpty()]],async (req,res)=>{
   const errors=validationResult(req)
   if(!errors.isEmpty()){
    res.status(400).json({errors:errors.array()})
   }
   try{
   const user=await User.findById(req.user.id).select('-password')
   const post=await Post.findById(req.params.id)
   const newComment={
   text:req.body.text,
   name:user.name,
   avatar:user.avatar,
   user:req.user.id
   }
   post.comments.unshift(newComment)
   await post.save()
   res.json(post.comments)
   }
   catch(err){
      console.error(err.message)
      res.status(500).send('server error')
   }
})
route.delete('/comment/:id/:comment_id',auth,async (req,res)=>{
 try {
   const post=await Post.findById(req.params.id)
   const comment=post.comments.find(comment=>comment.id===req.params.comment_id)
   if(!comment){
    return res.status(404).json({msg:'comment does not exist'})}
   if(comment.user.toString()!==req.user.id){
    return res.status(401).json({msg:'user not authourised'})
   }
   post.comments = post.comments.filter(
      ({ id }) => id !== req.params.comment_id
    )
    await post.save()
   return res.json(post.comments)
 } catch (err) {
   console.error(err.message);
   res.status(500).send('server error')
 }

})
  


module.exports=route