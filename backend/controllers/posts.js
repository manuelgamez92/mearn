const Post =require('../models/post');

exports.getPost = (req,res,next)=>{
   
    Post.findById(req.params.id).then(post=>{
        if(post){
            res.status(200).json(post);
    
        }else{
            res.status(404).json({message:'Post not found'});
        }
    }).catch(error=>{
        res.status(500).json({
            message:"Getting single post failed"
        }) });;
    }

    exports.getYourPosts = (req,res,next)=>{
        const pageSize = req.body.pageSize;
        const currentPage = req.body.page;
        const creator = req.body.creator;
        console.log("xxxxxxxx"+req.query.creator);
        const postQuery = Post.find({creator:creator});
        if(pageSize && currentPage){
            postQuery
            .skip(pageSize * (currentPage-1))
            .limit(pageSize);
        }
        postQuery.then(documents=>
            {
             fetchedPosts = documents;
             return Post.count({creator:req.query.creator});
            })
            .then(count=>{
           
                res.status(200).json({
                    message:'Post fetched succesfully',
                    posts: fetchedPosts,
                    maxPosts: count
                });
            }).catch(error=>{
            res.status(500).json({
                message:"Getting single post failed"
            }) });;
        }

    exports.createPost = (req,res,next)=>{
        const datetime = new Date();
        const url = req.protocol + '://' + req.get("host");
        const posts = new Post({
            title: req.body.title,
            content: req.body.content,
            imagePath: url + "/images/"+ req.file.filename,
            date: datetime.toISOString().slice(0,10),
            creator:req.userData.userId,
            author: req.userData.username
        });
        posts.save().then(createdPost=>{
                console.log(createdPost);
                res.status(201).json({
                message:'Post added sucessfully',
                post:{
    
                ...createdPost,    
                id: createdPost._id,
             
                } 
            });
        }).catch(error=>{
            res.status(500).json({
                message:"Creating post failed"
            });
        });
        
        }

        exports.getPosts = (req,res,next)=>{
            const pageSize = +req.query.pageSize;
            const currentPage = +req.query.page;
            const postQuery = Post.find();
            let fetchedPosts;
            if(pageSize && currentPage){
                postQuery
                .skip(pageSize * (currentPage-1))
                .limit(pageSize);
            }
    
            postQuery.then(documents=>
                {
                 fetchedPosts = documents;
                 return Post.count();
                })
                .then(count=>{
               
                    res.status(200).json({
                        message:'Post fetched succesfully',
                        posts: fetchedPosts,
                        maxPosts: count
                    });
                }).catch(error=>{
                    res.status(500).json({
                        message:"Fetching posts failed"
                    }) });
        
            
    } 


    exports.updatePost = (req,res,next)=> {
        const datetime = new Date();
        const url = req.protocol + '://' + req.get("host");
        let imagePath = req.body.imagePath;
       if(req.file){
        imagePath= url + "/images/"+ req.file.filename

       } 
      const post = new Post({
          _id:req.body.id,
          title:req.body.title,
          content:req.body.content,
          imagePath:imagePath,
          creator:req.userData.id,
          author:req.userData.username,
          date: datetime.toISOString().slice(0,10)
      });

        Post.updateOne({_id:req.params.id,creator: req.userData.userId},post).then((result)=>{
        if(result.n > 0){
            res.status(200).json({message:"post updated"});
        }else{
            res.status(401).json({message:"Not authorizaded"});
        }
    
        }).catch(error=>{
        res.status(500).json({
            message:"Updating post failed"
        }) });
    }

    exports.deletePost = (req,res,next) =>
    {
        Post.deleteOne({_id:req.params.id,creator:req.userData.userId}).then(result =>{       
               
            if(result.n > 0){
                res.status(200).json({message:"Post deleted successfully"});
            }else{
                res.status(401).json({message:"Not authorizaded"});
            }    
        }).catch(error=>{
            res.status(500).json({
                message:"Deleting post failed"
            }) });
      
    }



    exports.getPostsByString = (req,res,next)=>{

        const pageSize = req.body.pageSize;
        const currentPage = req.body.page;
        const text = req.body.text;

        const postQuery = Post.find({ title: { $regex: text} });
        let fetchedPosts;
       
        if(pageSize && currentPage){
            postQuery
            .skip(pageSize * (currentPage-1))
            .limit(pageSize)
        }postQuery.then(documents=>
                {
                 fetchedPosts = documents;
                 return Post.count({ title: { $regex: text} });
                })
                .then(count=>{
               
                    res.status(200).json({
                        message:'Post fetched succesfully',
                        posts: fetchedPosts,
                        maxPosts: count
                    });
                }).catch(error=>{
                    res.status(500).json({
                        message:"Fetching posts failed"
                    }) });
        
        
        };

        
        
    
