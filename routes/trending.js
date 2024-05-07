const router = require('express').Router();
const postModel = require('../Models/post');
const {User} = require('../Models/user');
const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;



router.get('/trending', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const currentUser = req.user;
            const userId = currentUser._id;
            const currentUserFriendsList = req.user.friends;
            const list = []; 
            
            const timeDifference = (currentDate, likedAtDate) => {
                return currentDate.getTime() - likedAtDate.getTime();
            };

            
            const currentUserPosts = await postModel.find({ author: userId });

            
            for (const id of currentUserFriendsList) {
                try {
                    const friendPosts = await postModel.find({ author: id });
                    list.push(...friendPosts); 
                } catch (err) {
                    console.error(err);
                }
            }

            
            list.push(...currentUserPosts);

            
            list.sort((a, b) => {
               
                const likesA = a.likes.length;
                const likesB = b.likes.length;

                
                if (likesA === likesB) {
                    const currentTime = new Date();
                    const timeDiffA = a.likes.length > 0 ? timeDifference(currentTime, a.likes[0].likedAt) : 0;
                    const timeDiffB = b.likes.length > 0 ? timeDifference(currentTime, b.likes[0].likedAt) : 0;
                    return timeDiffA - timeDiffB;
                }

                
                return likesB - likesA;
            });

            return res.render("trending", { currentUser, list });
        }
        
        res.redirect("/signin");
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;