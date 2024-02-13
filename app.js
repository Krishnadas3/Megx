
const express = require('express')
const app = express()
const path = require('path')
var jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const cookieparser = require('cookie-parser')
let ejs = require('ejs')
const {parsed:config} = require('dotenv').config()
global.config = config
const port = process.env.PORT || 5050;

app.set('view engine','ejs')
// app.use(expressEjsLayouts)
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


app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))


app.get('/', function(req, res) {
    res.render('index');
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.get('/signup',function(req,res){
    res.render('signup')
})

app.get('/my-account',function(req,res){
    res.render('my-account')
})

app.get('/wishlist',function(req,res){
    res.render('wishlist')
})

app.get('/shop',function(req,res){
    res.render('shop')
})

app.get('/about',function(req,res){
    res.render('about')
})

app.get('/product-details-2',function(req,res){
    res.render('product-details-2')
})

app.get('/cart-page',function(req,res){
    res.render('cart-page')
})

app.get('/checkout',function(req,res){
    res.render('checkout')
})


app.get('/contact',function(req,res){
    res.render('contact')
})


app.listen(port,()=>{
    console.log('listening');
})


