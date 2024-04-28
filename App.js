const express = require('express');
const authRoute = require('./routes/auth');
const path = require('path');

const app = express();

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));

app.use(express.static('public'));



app.use('/',authRoute);

app.get('/', (req, res) => {
	res.render('landing.ejs');
});

app.listen(4000,()=>{
    console.log("Server Started at port 4000");
})