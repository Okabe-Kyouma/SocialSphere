const express = require('express');
const authRoute = require('./routes/auth');
const path = require('path');
const passport = require('passport');
const {connectMongoose} = require('./Models/user');
const Session = require('express-session');
const {initializingPassport} = require('./passportConfig');

connectMongoose();

initializingPassport(passport);

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));

app.use(express.static('public'));

app.set('trust proxy', 1) 
app.use(Session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))



app.use(passport.initialize());
app.use(passport.session());




app.use('/',authRoute);

app.get('/', (req, res) => {
	res.render('landing.ejs');
});

app.listen(4000,()=>{
    console.log("Server Started at port 4000");
})