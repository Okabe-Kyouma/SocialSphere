const router = require('express').Router();
const passport = require('passport');
const { User } = require('../Models/user');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const postModel = require('../Models/post');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.user._id.toString(); // Convert ObjectId to string
        const uploadDir = path.join(__dirname, '../public/upload', userId);
        fs.stat(uploadDir, (err, stats) => {
            if (err || !stats.isDirectory()) {
                console.log('Destination directory does not exist, creating it...');
                fs.mkdir(uploadDir, { recursive: true }, err => cb(err, uploadDir));
            } else {
                console.log('Destination directory exists.');
                cb(null, uploadDir);
            }
        });
    },
    filename: (req, file, cb) => {
        const filename = req.user._id.toString() + '-' + Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});




const upload = multer({
	storage: storage,
	
}).single('post-image');











router.get('/home', async (req, res) => {

    if (req.isAuthenticated()) {
        const currentUser = req.user;

        const userId = currentUser._id;

        const currentUserFriendsList = req.user.friends;

        const list = [];

        console.log(`userId: ${userId}`);

        const ObjectIdUserId = new ObjectId(userId);

       const data = await postModel.find({author: ObjectIdUserId});

       list.push(data);

       for(const id of currentUserFriendsList){
        try{
            const obj = new ObjectId(id);

            const post = await postModel.find({author: obj});
            if(post){
                list.push(post);
            }
        }
        catch(err){
            console.log(err);
        }
    }


            console.log(`data recieved: ${list}`);

        return res.render('home', { currentUser,list });
    }
    res.redirect('/signin');

});





router.post('/post/upload', upload, async (req, res) => {
   

    console.log(req.body)
    console.log(req.file)
    
    
   let data;
    

   if(req.file){

       data = {
          image:req.file.filename,
          postDescription: req.body.postDescription,
          author:  req.user._id,
      };

   }else{

       data = {
           postDescription: req.body.postDescription,
           author:  req.user._id,
       };
       
   }
    

   

  await postModel.create(data);


    res.redirect('/home');



});

module.exports = router;
