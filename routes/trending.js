const router = require('express').Router();
const postModel = require('../Models/post');
const {User} = require('../Models/user');
const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

// router.get('/trending',async (req,res)=>{


//     if (req.isAuthenticated()) {
//         const currentUser = req.user;
    
//         const userId = currentUser._id;
    
//         const currentUserFriendsList = req.user.friends;
    
//         const list = [];

    
//         const ObjectIdUserId = new ObjectId(userId);
    
//         const data = await postModel.find({ author: ObjectIdUserId });
    
//         list.push(data);
    
//         const listOfUsersWithPosts = [];
    
//         for (const id of currentUserFriendsList) {
//           try {
//             const uu = await User.findById(id);
    
//             listOfUsersWithPosts.push(uu);
    
//             const obj = new ObjectId(id);
    
//             const post = await postModel.find({ author: obj });
//             if (post) {
//               list.push(post);
//             }
//           } catch (err) {
//             console.log(err);
//           }
//         }
    
        
//         return res.render("trending", { currentUser, list, listOfUsersWithPosts });
//       }
//       res.redirect("/signin");

   

// })

// router.get('/trending', async (req, res) => {
//     try {
//         if (req.isAuthenticated()) {
//             const currentUser = req.user;
//             const userId = currentUser._id;
//             const currentUserFriendsList = req.user.friends;
//             const list = []; // Keeping the variable name as 'list'
//             const listOfUsersWithPosts = [];

//             // Function to calculate the time difference in milliseconds
//             const timeDifference = (currentDate, likedAtDate) => {
//                 return currentDate.getTime() - likedAtDate.getTime();
//             };

//             // Fetch posts of the current user
//             const currentUserPosts = await postModel.find({ author: userId });
//             list.push(currentUserPosts); // Adding current user's posts to the list

//             // Fetch posts of user's friends and add them to the list
//             for (const id of currentUserFriendsList) {
//                 try {
//                     const user = await User.findById(id);
//                     listOfUsersWithPosts.push(user);
//                     const friendPosts = await postModel.find({ author: id });
//                     list.push(friendPosts); // Adding friend's posts to the list
//                 } catch (err) {
//                     console.error(err);
//                 }
//             }

//             // Flatten the list of lists into a single list
//             const flattenedList = list.reduce((acc, val) => acc.concat(val), []);

//             // Sort the flattened list based on the number of likes and time difference
//             flattenedList.sort((a, b) => {
//                 // Calculate the number of likes for each post
//                 const likesA = a.likes.length;
//                 const likesB = b.likes.length;

//                 // If the number of likes is equal, sort by time difference
//                 if (likesA === likesB) {
//                     const currentTime = new Date();
//                     const timeDiffA = a.likes.length > 0 ? timeDifference(currentTime, a.likes[0].likedAt) : 0;
//                     const timeDiffB = b.likes.length > 0 ? timeDifference(currentTime, b.likes[0].likedAt) : 0;
//                     return timeDiffA - timeDiffB;
//                 }

//                 // Sort by the number of likes
//                 return likesB - likesA;
//             });

//             return res.render("trending", { currentUser, list: flattenedList, listOfUsersWithPosts });
//         }
//         // If user is not authenticated, redirect to signin
//         res.redirect("/signin");
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// });

router.get('/trending', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const currentUser = req.user;
            const userId = currentUser._id;
            const currentUserFriendsList = req.user.friends;
            const list = []; // Keeping the variable name as 'list'

            // Function to calculate the time difference in milliseconds
            const timeDifference = (currentDate, likedAtDate) => {
                return currentDate.getTime() - likedAtDate.getTime();
            };

            // Fetch posts of the current user
            const currentUserPosts = await postModel.find({ author: userId });

            // Fetch posts of user's friends and add them to the list
            for (const id of currentUserFriendsList) {
                try {
                    const friendPosts = await postModel.find({ author: id });
                    list.push(...friendPosts); // Adding friend's posts to the list
                } catch (err) {
                    console.error(err);
                }
            }

            // Add current user's posts to the list
            list.push(...currentUserPosts);

            // Sort the list based on the number of likes and time difference
            list.sort((a, b) => {
                // Calculate the number of likes for each post
                const likesA = a.likes.length;
                const likesB = b.likes.length;

                // If the number of likes is equal, sort by time difference
                if (likesA === likesB) {
                    const currentTime = new Date();
                    const timeDiffA = a.likes.length > 0 ? timeDifference(currentTime, a.likes[0].likedAt) : 0;
                    const timeDiffB = b.likes.length > 0 ? timeDifference(currentTime, b.likes[0].likedAt) : 0;
                    return timeDiffA - timeDiffB;
                }

                // Sort by the number of likes
                return likesB - likesA;
            });

            return res.render("trending", { currentUser, list });
        }
        // If user is not authenticated, redirect to signin
        res.redirect("/signin");
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;