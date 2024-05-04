const router = require("express").Router();
const passport = require("passport");
const { User } = require("../Models/user");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const postModel = require("../Models/post");
const Users = require("../Models/user");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user._id.toString(); // Convert ObjectId to string
    const uploadDir = path.join(__dirname, "../public/upload", userId);
    fs.stat(uploadDir, (err, stats) => {
      if (err || !stats.isDirectory()) {
        console.log("Destination directory does not exist, creating it...");
        fs.mkdir(uploadDir, { recursive: true }, (err) => cb(err, uploadDir));
      } else {
        console.log("Destination directory exists.");
        cb(null, uploadDir);
      }
    });
  },
  filename: (req, file, cb) => {
    const filename =
      req.user._id.toString() +
      "-" +
      Date.now() +
      path.extname(file.originalname);
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
}).single("post-image");

router.get("/home", async (req, res) => {
  if (req.isAuthenticated()) {
    const currentUser = req.user;

    const userId = currentUser._id;

    const currentUserFriendsList = req.user.friends;

    const list = [];

    // console.log(`userId: ${userId}`);

    const ObjectIdUserId = new ObjectId(userId);

    const data = await postModel.find({ author: ObjectIdUserId });

    list.push(data);

    const listOfUsersWithPosts = [];

    for (const id of currentUserFriendsList) {
      try {
        const uu = await User.findById(id);

        listOfUsersWithPosts.push(uu);

        const obj = new ObjectId(id);

        const post = await postModel.find({ author: obj });
        if (post) {
          list.push(post);
        }
      } catch (err) {
        console.log(err);
      }
    }

    // console.log(`list of users with posts and frnds: ${listOfUsersWithPosts}`);

    return res.render("home", { currentUser, list, listOfUsersWithPosts });
  }
  res.redirect("/signin");
});

router.post("/home/post/delete/:postId", async (req, res) => {
  if (req.isAuthenticated()) {
    const { postId } = req.params;

    await postModel.deleteOne({ _id: postId });

    res.redirect("/home");
  } else {
    res.redirect("/");
  }
});

// router.post('/post/liked/:userId/:postId', async (req, res) => {
//     try {
//         if (req.isAuthenticated()) {
//             const userId = req.params.userId;
//             const postId = req.params.postId;

//             const post = await postModel.findById(postId);
//             if (!post) {
//                 return res.status(404).send('Post not found');
//             }

//             const alreadyLikedIndex = post.likes.findIndex(like => String(like.personLiked) === userId);

//             if (alreadyLikedIndex !== -1) {

//                 post.likes.splice(alreadyLikedIndex, 1);
//                 await post.save();
//                 res.status(200).send('Post unliked');
//             } else {
//                 post.likes.push({ personLiked: userId });
//                 await post.save();
//                 res.status(200).send('Post liked');
//             }
//         } else {
//             res.redirect('/');
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//     }
// });

router.post("/post/like/:postId", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { postId } = req.params;
      console.log(`pppppppppppppppppppppppppppppppppppppppppppppppppppost id i got ${postId}`);
      const userId = req.user._id;
      console.log(`pppppppppppppppppppppppppppppppppppppppppppppppppppost userid i got ${userId}`);
      const ObjectIdUserId = new ObjectId(userId);
      const post = await postModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      var getter = 'no';

      post.likes.forEach(element => {



        console.log(`${element.personLiked} and userId ${ObjectIdUserId}`);

        if(element.personLiked.equals(ObjectIdUserId)){
            getter = 'yes';
            console.log('getter value ' + getter);
        }
        
      });

      console.log(`the persons: ${post.likes.personLiked} and the userId ${userId}`);
        
     const user  = post.likes.find(like => like.personLiked === new ObjectId(userId));

     console.log(`aree vaii user mil gya phenchoo!! ${user} is id sai h: ${ObjectIdUserId}`);

     if(getter==='no'){
        post.likes.push({personLiked:req.user._id});
        await post.save();
        // res.status(200).send('Post liked');
        console.log("this working.");
     }
     else{

        console.log("that workking.");

        const result = await postModel.updateOne(
            { _id: postId },
            { $pull: { likes: { personLiked: new ObjectId(userId) } } }
        );
        if (result.nModified === 1) {
            console.log("User's like removed successfully.");
            // res.status(200).send('Post unliked');
        } else {
            console.log("Post or user not found, or user's like not removed.");
        }

     }

     



      
    //   post.likes.push({ personLiked: req.user._id });
    //   await post.save();
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

router.get("/liked-posts", async (req, res) => {
    if (req.isAuthenticated()) {
      try {
        const userId = req.user._id;
        const likedPosts = await postModel.find({'likes.personLiked': userId}, '_id');
        res.json(likedPosts.map(post => post._id));
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });
  

// router.post('/post/dislike/:postId', async (req, res) => {
//     try {
//         const { postId } = req.params;
//         const post = await postModel.findById(postId);
//         if (!post) {
//             return res.status(404).json({ message: 'Post not found' });
//         }
//         // Remove user from likes array
//         const index = post.likes.indexOf(req.user._id);
//         if (index > -1) {
//             post.likes.splice(index, 1);
//         }
//         await post.save();
//         res.sendStatus(200);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

router.post("/post/upload", upload, async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  let data;

  if (req.file) {
    data = {
      image: req.file.filename,
      postDescription: req.body.postDescription,
      author: req.user._id,
      authorUsername: req.user.username,
    };
  } else {
    data = {
      postDescription: req.body.postDescription,
      author: req.user._id,
      authorUsername: req.user.username,
    };
  }

  await postModel.create(data);

  res.redirect("/home");
});

module.exports = router;
