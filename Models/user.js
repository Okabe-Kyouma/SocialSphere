const mongoose = require('mongoose');
const passport = require('passport');

exports.connectMongoose = () => {

    mongoose.connect('mongodb://0.0.0.0:27017/socialSphereProject2')
     .then(e=>console.log("Mongodb Connected"))
     .catch(e=>console.log(`${e} error`));

};

const userSchema = new mongoose.Schema({
    username: {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    postCount:{type:Number,default:0},
    friends: [ { type: mongoose.Types.ObjectId } ],
    profilePhoto:String,
    coverPhoto:String,
})

exports.User = mongoose.model("User",userSchema);