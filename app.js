
const express = require('express')
const app = express()
const path = require('path')
var jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const cookieparser = require('cookie-parser')
let ejs = require('ejs')

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(cookieparser())

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




app.listen(3006,()=>{
    console.log('listening');
})