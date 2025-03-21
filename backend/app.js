const express = require('express');
const app = express();
const bodyParser = require('body-parser')

const mongoose = require('mongoose');
const Post = require('./models/post');
const postroutes = require('./routes/posts');  

mongoose.connect("mongodb+srv://aly:alayssa01@myapp.tn7ao.mongodb.net/?retryWrites=true&w=majority&appName=myapp")

    .then(() => {console.log('Connected to Database');})
    .catch(err => console.log('Connection failed', err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");

    res.setHeader('Access-Control-Allow-Methods',
        "GET, POST, PATCH, PUT, DELETE, OPTIONS")
    next();}
    );

app.use("/api/posts", postroutes);

    app.post('/api/posts', (req, res, next) => {
        const post = new Post({
            title: req.body.title,
            content: req.body.content
        });
       post.save();
        res.status(201).json({
            message: "Post added successfully"
        });
    })

    app.put("/api/posts/:id", (req, res, next)=>{  
        const post = new Post({  
          _id: req.body.id,  
          title: req.body.title,  
          content: req.body.content  
        });  
        Post.updateOne({_id:req.params.id}, post).then(result =>{  
            console.log(result);  
            res.status(200).json({message: "Update Successful!"})  
          });
    });   

app.get('/api/posts',(req, res, next) => {
   Post.find()
        .then(documents =>{
            res.status(200).json({
                message: 'Posts successfully fetched',
                posts: documents
            });
        })
});

app.get("/api/posts/:id",(req, res, next)=>{  
    Post.findById(req.params.id).then(post =>{  
        if(post){  
          res.status(200).json(post);  
        }else{  
          res.status(484).json({message: 'Post not Found!'});  
        }  
      });  
});  

app.delete('/api/posts/:id',(req, res, next) => {
    Post.deleteOne({_id: req.params.id }).then(result => {
        console.log(result);
        console.log(req.params.id);
        res.status(200).json({ message: "Post deleted"});
    })
});

module.exports = app;