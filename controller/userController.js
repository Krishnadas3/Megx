
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const user = require('../models/users')
const nodemailer = require('nodemailer')
const twilio = require('twilio')


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
            phonenumber:phone,
            password: hashedPassword,
        });

        console.log(data);

        const userdata = await data.save();
        console.log(userdata);

        // No JWT code here

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


const loginPostpage = async (req, res) => {
    try {
        const foundUser = await user.findOne({ email: req.body.email });

        if (foundUser) {
            const passwordMatch = await bcrypt.compare(req.body.password, foundUser.password);

            if (passwordMatch) {
                req.session.user = {
                    id: foundUser._id,
                    username: foundUser.username,
                    email: foundUser.email
                };
                res.redirect('/');
            } else {
                console.log('Incorrect password:', req.body.password);
                res.render('user/login', { error: 'wrong password' });
            }
        } else {
            console.log('User not found:', req.body.email);
            res.render('user/login', { error: 'user not found' });
        }
    } catch (error) {
        console.error('Internal server error:', error);
        res.render('user/login', { error: 'internal server error' });
    }
};


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

// forgot here 

const transporter = nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:465,
    auth:{
        user:'megx838@gmail.com',
        pass:'atvrqnvmhtgoqqci'
    }
})


const sendOtpEmail = async (email, otp) =>{
    const mailOptions = {
        from:'megx838@gmail.com',
        to: email,
        subject:'Reset your Password',
        text:`your OTP to reset your password is: ${otp}`,
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log('emial send');
    } catch (error) {
        console.error('error sending email',error)
    }
}
// ***************************************************************//

let forgetEmailPostpage = async(req,res) =>{
    const {email} =req.body

    try {
        const User = await user.findOne({email})
          
        if(!User) {
            return res.status(404).json({message:'user not found'})
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        console.log(otp);
        User.otp = otp
        User.otpExpiration = Date.now() + 10 * 60 * 1000 // otp expires in 10 minute
        await User.save()
        
        await sendOtpEmail(email,otp)
        res.render('user/forgetotppass',{email})
    } catch (error) {
        console.error('error sending otp:',error)
        res.status(500).json({message:'server error'})
    }
}

//Rest password

let resetPassword = async (req,res) =>{
    const {email,otp,newpassword,confirmpassword} = req.body
    console.log(otp);

    try {
        const User = await user.findOne({email})

        if(!User) {
            return res.status(404).json({message:'user not found'})
        }
        if(User.otp !== otp || Date.now() > User.otpExpiration){
            return res.status(400).json({message:'invalid or expired OTP'})
        }
        if(newpassword !== confirmpassword) {
            return res.status(400).json({message:'password do not match'})
        }

        const bcryptNewpassword = await bcrypt.hash(newpassword,10)
        //reset password 
        User.password = bcryptNewpassword
        //clear otp fileds
        User.otp = undefined
        User.otpExpiration = undefined
        await User.save()
        console.log('password resetted')
        res.status(200).render('user/login')
    } catch (error) {
        console.error('error resetting password ',error)
        res.status(500).json({message:'server error'})
    }
}

//Login with OTP Start here 


let logingetotp = async(req,res) => {
    try {
        res.render('user/loginotphone')
    } catch (error) {
        console.error('failed to get login page',error)
        res.status(500).send('intenal server error')
    }
}

// ENV details

const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid,authToken)

const generateotp = () =>{
    return Math.floor(100000 + Math.random() * 900000).toString()
}

// requestion for otp after enterd phone

const loginrequestsotp = async (req,res) =>{
    const {phonenumber} = req.body
    
    try {
        const User = await user.findOne({phonenumber})

        if(!User){
            return res.status(404).json({message:'user not found'})
        }

        const otp = generateotp()
        User.otp = otp
        User.otpExpiration = new Date(Date.now()) + 10 *60 *1000 // otp in 10 minte
        await User.save()

        // send otp via Twilo Sms

        try {
            await client.messages.create({
                body:`your otp for login to Megx is: ${otp}`,
                from:twilioPhoneNumber,
                to: process.env.TO_NUMBER,
            })
            console.log('otp sms sent');
        } catch (error) {
            console.error('error sendingg otp smes',error)
            return res.status(500).json({message:'error sending otp '})
        }
        res.render('user/loginotp',{phonenumber})

    } catch (error) {
        console.error('error requesing otp',error)
        res.status(500).json({message:'server error'})
    }
}

const loginverifyotp = async (req,res) =>{
        const {phonenumber,otp} = req.body


try {
    const User = await user.findOne({phonenumber})

    if(!User){
        return res.status(404).json({message:'user not found'})
    }

    if(User.otp !== otp || Date.now() > user.otpExpiration)  {
        return res.status(400).json({message:'invalid or expired OTP'})
    }

    //clear OTP filed after succesful verification 

    User.otp = undefined
    User.otpExpiration = undefined
    await User.save()

    res.status(200).redirect('/')
    console.log('user loging use otp');

} catch (error) {
    console.error('error verifying otp',error)
    res.status(500).json({message:'server error'})
}
}
// *********************end****************************


module.exports = {
    homepage,
    signupGetpage,
    logiGetpage,
    signupPostpage,
    loginPostpage,
    loadAuth,
    succesGoogleLogin,
    failureGooglelogin,
    myaccountgetpage,
    userLogout,
    forgotpasspage,
    forgetEmailPostpage,
    resetPassword,
    logingetotp,
    loginrequestsotp,
    loginverifyotp
}