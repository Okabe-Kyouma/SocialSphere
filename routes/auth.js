const router = require('express').Router();
const passport = require('passport');
const {User} = require('../Models/user');

router.get('/signin',(req,res)=>{
   res.render('signin');
})

router.get('/signup',(req,res)=>{
    res.render('signup');
})

router.post('/signin',passport.authenticate("local"),(req,res)=>{

    res.send("Welcome champ!!")



})



router.post('/signup', async(req,res)=>{

    const{email,username,password} = req.body;

    const user = await User.findOne({username});

    if(user){
        res.send("User Already Exist");
    }

    await User.create(req.body);

    res.send("User Sucessfully Added");

})

module.exports = router;