const mongoose = require('mongoose');
const passport = require('passport');

exports.connectMongoose = () => {


     mongoose.connect('mongodb://0.0.0.0:27017/Social-Sphere')
     .then(e=>console.log("Mongodb Connected"))
     .catch(e=>console.log(`${e} error`));

};

const userSchema = new mongoose.Schema({
    username: {
        type : String,
        required : true,
        unique: true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
        unique : true,
    }
})

exports.User = mongoose.model("User",userSchema);