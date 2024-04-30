const router = require('express').Router();
const passport = require('passport');
const {User} = require('../Models/user');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

var ans = "";

router.get('/signin',(req,res)=>{

    if (req.isAuthenticated()) {

        return res.redirect('/home');
    }

   res.render('signin');
})

router.get('/signup',(req,res)=>{

    if (req.isAuthenticated()) {

        return res.redirect('/home');

    }

    res.render('signup',{ans});
})

router.post('/signin',passport.authenticate("local"),(req,res)=>{

        return res.redirect('/home');

})



router.post('/signup', async(req,res)=>{
    

    const{email,username,password} = req.body;

    const user = await User.findOne({username});

    if(user){
        req.flash('user',"User Already Exist");
         ans = req.flash('user');

         res.render('signup',{ans});
    }
    else{

    await User.create(req.body);

    return res.redirect('/home');

    }

})

module.exports = router;