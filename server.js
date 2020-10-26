const express=require('express')
const mongoose =require('mongoose')
const path=require('path')
const connectDB= async()=>{ 
 try{
   mongoose.connect('mongodb://localhost/admin',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false})
   console.log("connected to MongoDB")
 }
 catch(err){
   console.log(err.msg)
   process.exit()
 }
}
connectDB()
const app=express()
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use('/api/users',require('./routes/API/users'))
app.use('/api/profile',require('./routes/API/profile'))
app.use('/api/auth',require('./routes/API/auth'))
app.use('/api/posts',require('./routes/API/posts'))

//Serve static assets in production
if(process.env.NODE_ENV==='production'){
  app.use(express.static('client/build'))
  app.get('*',(req,res)=>{
   res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}

 

const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{console.log(`server started on ${PORT}`)})