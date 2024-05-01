const router = require('express').Router();
const postModel = require('../Models/post');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const ObjectId = mongoose.Types.ObjectId;








const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.user._id.toString(); // Convert ObjectId to string
        const uploadDir = path.join(__dirname, '../public/coverPhoto', userId);
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
	
}).single('cover-image');








router.get('/profile',async (req,res)=>{
    if(req.isAuthenticated()){

        const currentUser = req.user;
        const currentUserId = req.user._id;

        const ObjectIdUserId = new ObjectId(currentUserId);

        const data = await postModel.find({author: ObjectIdUserId});

        // console.log(`the profile data: ${data}`);

        res.render('profile',{currentUser,data});

    }
    else{
        res.redirect('/');
    }
});

router.post('/profile/coverPhoto',upload,async (req,res)=>{

    if(req.isAuthenticated()){

        const currentUser = req.user;


        console.log(req.body)
    console.log(req.file)
    

   if(req.file){

      currentUser.coverPhoto = req.file.filename;

      console.log(`got the image as ${currentUser.coverPhoto}`);

   }

    

   await currentUser.save();


    res.redirect('/profile');






    }
    else{
        res.redirect('/');
    }
    

})


module.exports = router;