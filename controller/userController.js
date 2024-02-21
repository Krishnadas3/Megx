
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const user = require('../models/users')

// const user = require('../models/users')

require('dotenv').config()

//  home page display 

let homepage = (req,res)=>{
    try {
        res.render('user/index')
    } catch (error) {
        console.error('failed to get home:',error)
        res.status(500).send('internal server error')
    }
}

const loadAuth = (req,res) =>[
    res.render('auth')
]

// user signup page display 

let signupGetpage = async(req,res) =>{
    try {
        res.render('user/signup')
    } catch (error) {
        console.error('failed to get login page',error);
        res.status(500).send('internal server error')
    }
}


// use signup here 


let signupPostpage = async (req, res) => {
    try {
      const password = req.body.password;
  
      if (!password) {
        return res.status(400).json({ message: 'Password is required' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const data = new user({
        name: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
  
      console.log(data);
  
      const userdata = await data.save();
      console.log(userdata);

      res.redirect('/login');
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

// user login page display 

let logiGetpage = async(req,res) => {
    try {
        res.render('user/login')
    } catch (error) {
        console.error('failed to get login page',error)
        res.status(500).send('intenal server error')
    }
}


//  user login 


const loginPostpage = async(req,res) =>{
    try {
        const foundUser = await user.findOne({email:req.body.email})

        if(foundUser){
            const passwordMatch = await bcrypt.compare(req.body.password, foundUser.password)

            if(passwordMatch){
                
                req.session.user= {
                    id:foundUser._id,
                    username:foundUser.username,
                    email:foundUser.email
                }
                res.redirect('/')
            }else{
                console.log('Incorrect password:', req.body.password);
                res.render('user/login',{error:'wrong password'})
            }
        }else{
            console.log('User not found:', req.body.email);
            res.render('user/login',{error:'user not found'})
        }
    } catch (error) {
        console.error('Internal server error:', error);
        res.render('user/login',{error:'internal server error'})
    }
}

// google verification here 

const succesGoogleLogin = (req,res) =>{
    if(!req.user)
    res.redirect('/failure')
console.log(req.user);
    res.redirect('/')
}

const failureGooglelogin = (req,res) =>{
    res.send('Error')
}


module.exports = {
    homepage,signupGetpage,logiGetpage,signupPostpage,loginPostpage,loadAuth,succesGoogleLogin,failureGooglelogin
}