const express = require("express");
const router = express.Router();
const Post = require('../models/Post');
const Helper = require('./helper');

router.post('/createpost', Helper.verifyToken, async (req, res) => {
    const {title, content, description} = req.body;
    const {_id, username} = req.user;
    const newPost = Post({
        content,
        createdAt: Date.now(),
        title,
        description,
        userId: _id,
        username,
        likecount: 0
    });
    try{
        await newPost.save();
    } catch (e) {
        console.log(e);
        res.status(401).send({
            message: 'Error_creating_post'
        })
        return;
    }
    res.sendStatus(201);
});

router.post('/upVote', async (req, res) => {
    const {id} = req.body;
    try{
    await Post.findByIdAndUpdate(id, {
        $inc: {likecount: 1}
    })
} catch(e){
    console.log(e)
    res.status(401).send({
        message: 'Error_upvoting'
    })
}
})

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

router.get('/getposts/:userId', Helper.verifyToken, async (req, res) => {
    try{
        const {_id} = req.user;
        const posts = await Post.find({
            userId: _id
        })
        res.send(posts)

    } catch (e) {
        res.status(401).send({
            message: 'Error fetching posts for the user: ' + userId
        })
    }
})

router.delete('/:postId', Helper.verifyToken, async (req, res) => {
    try{
        console.log("Coming");
        const postId = req.params['postId'];
        await Post.deleteOne({ _id: postId});
        res.send(200);
    } catch (e) {
        res.status(401).send({
            message: 'Error deleting the post'
        })
    }
})

module.exports = router;