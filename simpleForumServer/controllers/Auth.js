const express = require("express");
const router = express.Router();
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.get('/init', async (req, res) => {
    let response = null;

    const authToken = req.headers['authorization'];
    if (authToken) {
        try{
        const {userId} = jwt.verify(authToken, 'app');
        const user = await User.findById(userId);
        if (user) {
            response = user;
        }
    } catch (e) {
        if(e instanceof jwt.JsonWebTokenError){
            console.log('Unauthenticated user access!')
        } else {
            console.log('Error at init endpoint!')
        }
    }
    }

    res.send({user: response});
});

router.post('/register', async (req, res) => {
    const userExists = await User.findOne({email: req.body.email});
    if (userExists) {
        res.status(400).send({
            message: 'email_exists'
        });
        return;
    }

    const newUser = User({
        username: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        createdAt: Date.now()
    });

    await newUser.save();
    res.sendStatus(201);
});

router.post('/login', async (req, res) => {
   const user = await User.findOne({email: req.body.email});
   if (!user) {
       res.status(404).send({
           message: 'user_not_found'
       });
       return;
   }

   const isEqual = await bcrypt.compare(req.body.password, user.password);
   if (!isEqual) {
       res.status(401).send({
           message: 'wrong_password'
       });
       return;
   }

   const token = jwt.sign({userId: user._id}, 'app');
   res.send({
       token,
       user
   })
});


module.exports = router;