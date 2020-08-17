const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect("mongodb+srv://manuel:"+process.env.MONGO_ATLAS_PW+"@cluster0.gtfcz.mongodb.net/<dbname>")
.then(()=>{
  console.log('Conected to database');
})
.catch(error=>{
    console.log('Conected failed');
    console.log(error);
})




app.use(bodyParser.json());

app.use("/images", express.static(path.join("backend/images")));

app.use((req,res,next)=>{
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PATCH,PUT,OPTIONS");

next();
});

app.use("/api/posts/",postsRoutes);
app.use("/api/user/",userRoutes);



module.exports = app; 