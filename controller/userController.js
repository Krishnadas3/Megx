
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

      // Generate JWT token after successful ginup 

      const token = jwt.sign({userId:userdata._id},'your_secret_key',{expiresIn:'1h'})

      //her send the token in responses or stroe it as needed

      res.cookie('token',token,{httpOnly:true})

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


//  user login route


const loginPostpage = async(req,res) =>{
    try {
        const foundUser = await user.findOne({email:req.body.email})

        if(foundUser){
            const passwordMatch = await bcrypt.compare(req.body.password, foundUser.password)

            if(passwordMatch){

                const token = jwt.sign({userId:foundUser._id},'your_secret_key',{expiresIn:'1h'})

                //
                res.cookie('token',token,{httpOnly:true})
                
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

const succesGoogleLogin = async (req,res) =>{
    try {
        if(!req.user)

        return res.status(401).send('no user data, login failed')
   
        console.log(req.user);
        
        let newUser = await user.findOne({email:req.user.email})

        if(!newUser){

            newUser = new user({
                name:req.user.displayName,
                email:req.user.email
            })

            await newUser.save()
        }
   
        req.session.user = newUser
        res.status(200).render('user/index')
   
    } catch (error) {
       console.error('login erroe',error)
       res.status(500).redirect('user/login')
    }
}

const failureGooglelogin = (req,res) =>{
    res.send('Error')
}


// for otp login 

let logingetotp = async(req,res) => {
    try {
        res.render('user/loginphonotp')
    } catch (error) {
        console.error('failed to get login page',error)
        res.status(500).send('intenal server error')
    }
}


let myaccountgetpage = async(req,res) =>{
    try {
        res.render('user/myaccount')
    } catch (error) {
        console.error('failed to get login page',error)
        res.status(500).send('intenal server error')
    }
}

// USER LOGOUT

let userLogout = (req, res) => {
    if (!req.session.user) {
      // User is already logged out, redirect to a page with a message
      const alertScript = `
        <script>
          alert("You are already logged out.");
          window.location.href = "/login";
        </script>
      `;
      return res.send(alertScript);
    }
  
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Internal Server Error");
      }
      res.redirect("/login");
      console.log("User logged out");
    });
  };


// forgot password here 

let forgotpasspage = async(req,res) =>{
    try {
        res.render('user/forgotpass')
    } catch (error) {
        console.error('failed to get login page',error)
        res.status(500).send('intenal server error')
    }
}
module.exports = {
    homepage,signupGetpage,logiGetpage,signupPostpage,loginPostpage,loadAuth,succesGoogleLogin,failureGooglelogin,logingetotp,myaccountgetpage,userLogout,forgotpasspage
}