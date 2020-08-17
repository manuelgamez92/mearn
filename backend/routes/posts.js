const express = require('express');
const checkAuth = require("../middleware/check-auth");
const PostController = require("../controllers/posts");
const extractFile = require("../middleware/file");

const router = express.Router();





router.get("/:id",PostController.getPost);

router.post("",checkAuth,extractFile,PostController.createPost);

router.post("/getYourPosts",PostController.getYourPosts);

    
router.get("",PostController.getPosts);

router.post("/search",PostController.getPostsByString);

    
router.put("/:id",checkAuth,extractFile,PostController.updatePost);
    
router.delete("/:id",checkAuth,PostController.deletePost);
    
module.exports = router;