const router = require('express').Router();
const passport = require('passport');
const { User } = require('../Models/user');

router.get('/home', (req, res) => {
   
    if (req.isAuthenticated()) {

        const currentUser = req.user;

        return  res.render('home',{currentUser});
    }
    res.redirect('/signin');
});

module.exports = router;
