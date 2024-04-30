const router = require('express').Router();
const User = require('../Models/user');


router.get('/friends',(req,res)=>{

    if(req.isAuthenticated()){

        const friendArray = req.user.friends;

        res.render('friends',{friendArray});


    }
    else{
        res.redirect('/');
    }

})












module.exports = router;