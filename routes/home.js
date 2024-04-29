const router = require('express').Router();
const passport = require('passport');
const { User } = require('../Models/user');

router.get('/home', (req, res) => {
   
    if (req.isAuthenticated()) {
        return  res.render('home');
    }
    res.redirect('/signin');
});

module.exports = router;
