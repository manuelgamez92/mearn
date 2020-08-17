const mongoose = require ('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const userSchema = mongoose.Schema({
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    username: {type:String},
    imagePath: {type:String},
    country: {type:String},
    resetLink: {data:String,default:''}
});
userSchema.plugin(uniqueValidator);
module.exports= mongoose.model('User',userSchema);