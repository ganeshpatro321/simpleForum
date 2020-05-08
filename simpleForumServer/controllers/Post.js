const express = require("express");
const router = express.Router();
const Post = require('../models/Post');

router.post('/createpost', async (req, res) => {
    const {title, content, userId, description, username} = req.body;
    const newPost = Post({
        content,
        createdAt: Date.now(),
        title,
        description,
        userId,
        username,
        likecount: 0
    });
    try{
        await newPost.save();
    } catch (e) {
        res.status(401).send({
            message: 'Error_creating_post'
        })
        return;
    }
    res.sendStatus(201);
});

router.get('/getposts', async (req, res) => {
    try{
        const posts = await Post.find();
        res.send(posts);
    } catch(e){
        res.status(401).send({
            message: 'Error_fetching_posts'
        });
    }
});

module.exports = router;