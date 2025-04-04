const express = require("express");
const router = express.Router();
const PostModel = require("../models/post");
const multer = require("multer");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

const upload = multer({ storage: storage }).single("image");

router.post("/", upload, async (req, res) => {  
    try {
        const url = req.protocol + '://' + req.get("host");
        const post = new PostModel({  
            title: req.body.title,  
            content: req.body.content,
            imagePath: url + "/images/" + req.file.filename
        });

        const result = await post.save();  
        res.status(201).json({  
            message: "Post added successfully",  
            post: {
                ...result.toObject(),
                id: result._id
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Creating post failed!", 
            error: error.message 
        });
    }
});  

router.put("/:id", upload, (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    
    const post = new PostModel({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });

    PostModel.updateOne({ _id: req.params.id }, post)
        .then(result => {
            res.status(200).json({ 
                message: "Update successful!",
                post: {
                    ...post.toObject(),
                    id: req.params.id
                }
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Couldn't update post!"
            });
        });
});  

router.get("/", async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.pagesize); 
        const currentPage = parseInt(req.query.currentpage); 

        let postQuery = PostModel.find();
        if (pageSize > 0 && currentPage > 0) {
            postQuery = postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }

        const documents = await postQuery; 
        const totalPosts = await PostModel.countDocuments(); 

        res.status(200).json({
            message: "Posts fetched successfully!",
            posts: documents,
            totalPosts: totalPosts
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Fetching posts failed!", error: error.message });
    }
});

router.get("/:id", (req, res, next) => {
  PostModel.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json({
        id: post._id,
        title: post.title,
        content: post.content,
        imagePath: post.imagePath
      });
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});  

router.delete("/:id", async (req, res) => {  
    try {
        const result = await PostModel.deleteOne({ _id: req.params.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Post not found!" });
        }

        res.status(200).json({ message: "Post deleted!" });
    } catch (error) {
        res.status(500).json({ message: "Deleting post failed!", error: error.message });
    }
});  

module.exports = router;