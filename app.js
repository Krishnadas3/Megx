
const express = require('express')
const app = express()
const passport = require('passport')
const GoogleStartegy = require('passport-google-oauth20').Strategy
const path = require('path')
const session = require('express-session')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('./auth')  //here the google .auth getting
const cookieparser = require('cookie-parser')
const userrouter = require('./routes/user')
const nodemailer = require('nodemailer')
let ejs = require('ejs')

const user = require('./modal/users')
const {parsed:config} = require('dotenv').config()
global.config = config


const port = process.env.PORT || 5050;  // env port connecting here 

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(cookieparser())

// here the mongodb connecting online

mongoose.connect(config.CONNECTION_STRING,{
    dbName:'shop'
  })
  .then((data)=>
  { 
    console.log("DB Connected");
  }).catch((err)=>
  {
    console.log(err);
  })    


// here we can all public file accessing here 

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/login',function(req,res){
    res.render('login')
})

app.get('/signup',function(re,res){
    res.render('signup')
})


// register User here 

app.post('/signup',async(req,res)=>{

    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10)

        const data = new user({
            name:req.body.username,
            email:req.body.email,
            password:hashedPassword
        })
        console.log(data);
    
        const userdata = await data.save()
        console.log(userdata);

        // create a jwt toekn for the user 
        res.redirect("/login")
    
    }catch (error){
        console.error(error)
        res.status(500).json({message:'internal server error'})
    }
})

// login page 

app.post('/login',async(req,res)=>{
    try {

        const foundUser = await user.findOne({email:req.body.email})

        if(foundUser){
            const passwordMatch = await bcrypt.compare(req.body.password, foundUser.password)

            if(passwordMatch){
                res.redirect('/')
            }else{
                res.render('login',{error:'wrong password'})
            }
        }else{
            res.render('login',{error:'user not found'})
        }
    } catch (error) {
        console.error(error)
        res.render('login',{error:'internal server error'})
    }
})

function isloggedIn(req,res,next){
    req.user ? next() : res.sendStatus(401)
}



app.use(session({
    secret:'mysecret',
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}))

app.use(passport.initialize())


// google login 

app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));

app.get('/auth/google/failure',isloggedIn,(req,res)=>{
    let name = req.user.displayName;

    res.send('hello ${name}')
    res.send('something went wrong')
})

app.get('/',isloggedIn,(req,res)=>{
    res.send('/')
})

app.listen(port,()=>{
    console.log('listening');
})
