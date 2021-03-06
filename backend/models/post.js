const mongoose = require ('mongoose');

const postSchema = mongoose.Schema({
    title: {type:String, required:true},
    content: {type:String, required:true},
    imagePath: {type:String, required:true},
    date: {type:String},
    creator: {type:mongoose.Schema.Types.ObjectId,ref:"User",  required:true},
    author: {type:String}

});
postSchema.index({'$**': 'text'});
module.exports= mongoose.model('Post',postSchema);