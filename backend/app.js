const express = require('express');
const app = express();
const bosyParser = require('body-parser');


app.use(bosyParser.json());
app.use(bosyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");

    res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, OPTIONS");

    next();
})

app.post('/api/posts', (req, res, next) => {
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: 'Post Added Successfully'
    });
})

app.use('/api/posts', (req, res, next) => {
    const posts = 
        [{
            id: "fadf12421l",
            title: "First server-side postiuytrew",
            content: "first from server-side"
        },
        {
            id: "asgdagsas",
            title: "Second server-side post",
            content: "second from server-side"
        },
        ];

    res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: posts    
    });
});

module.exports = app;