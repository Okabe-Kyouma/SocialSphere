const router = require('express').Router();
const {User} = require('../Models/user');


router.get('/friends',async(req,res)=>{

    if(req.isAuthenticated()){

        const userIds = req.user.friends;

        const friendArray = [];

        for(const id of userIds){
            try{
                const user = await User.findById(id);
                if(user){
                    friendArray.push(user);
                }
            }
            catch(err){
                console.log(err);
            }
        }

        res.render('friends',{friendArray});


    }
    else{
        res.redirect('/');
    }

})


router.get('/Unfollow/:userId',async(req,res)=>{

    if(req.isAuthenticated()){

    const currentUser = req.user;

    const {userId} = req.params;

     console.log(userId);

     const indexToRemove = currentUser.friends.indexOf(userId);

     if(indexToRemove!==-1){
        currentUser.friends.splice(indexToRemove,1);
     }


     await currentUser.save();

     res.redirect('/home');
    }
    else{
        res.redirect('/');
    }

})











module.exports = router;