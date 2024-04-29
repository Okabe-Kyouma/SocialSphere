const express = require('express');
const authRoute = require('./routes/auth');
const homeRoute = require('./routes/home');
const path = require('path');
const passport = require('passport');
const {connectMongoose} = require('./Models/user');
const Session = require('express-session');
const cookieParser = require('cookie-parser');
const {initializingPassport} = require('./passportConfig');
const flash = require('connect-flash');

connectMongoose();

initializingPassport(passport);

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));

app.use(express.static('public'));

app.use(cookieParser('keyboard cat'));

app.set('trust proxy', 1) 
app.use(Session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge : 600000000000000 },
}))



app.use(flash());
app.use(passport.initialize());
app.use(passport.session());




app.use('/',authRoute);
app.use('/',homeRoute);


app.get('/', (req, res) => {

  if (req.isAuthenticated()) {
    return res.redirect('/home');
}

	res.render('landing.ejs');
});

app.get('/logout',(req,res)=>{
  req.logOut((err)=>{
    if(err){
      console.log(err);
      return res.redirect('/');
    }
    res.redirect('/signin');
  })
})

app.listen(4000,()=>{
    console.log("Server Started at port 4000");
})