const router = require('express').Router();
const {User} = require('../Models/user');

router.get('/allUsers', async (req, res) => {
    if (req.isAuthenticated()) {
        const currentUserId = req.user._id;
        const currentUser = req.user;
        const people = await User.find({ _id: { $ne: currentUserId } });
        res.render('allUsers', { currentUser,people });
    } else {
        res.redirect('/');
    }
});

router.get('/follow/:userId',async(req,res)=>{

    if(req.isAuthenticated()){

    const currentUser = req.user;

    const {userId} = req.params;

     currentUser.friends.push(userId);

     await currentUser.save();

     res.redirect('/home');
    }
    else{
        res.redirect('/');
    }

})


module.exports = router;