
// const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const user = require('../models/users')
const Products = require('../models/product');
const Category = require('../models/category');
const Coupon = require('../models/coupon')
const Address = require('../models/addressModel');
let Banner = require('../models/banner');
const { default: mongoose } = require('mongoose');
const twilio = require('twilio');
const Product = require('../models/product');
const { response } = require('express');
require("dotenv").config()
require('dotenv').config()

//  home page display 
let homepage = async (req, res) => {
    try {
        const isAuthenticated = req.cookies.jwt !== undefined;
        let products = await Products.find();
        const banner = await Banner.find()
        res.render('user/index', { isAuthenticated, products,banner });
    } catch (error) {
        console.error('Failed to get home:', error);
        res.render('user/500').send(500).send('Internal server error');
    }
}

let errorpage = async (req, res) => {
    try {
        
        res.render('user/404');
    } catch (error) {
        console.error('Failed to get home:', error);
        res.render('user/500').send(500).send('Internal server error');
    }
}

let error = async (req, res) => {
    try {
        
        res.render('user/500');
    } catch (error) {
        console.error('Failed to get home:', error);
        res.render('user/500').send(500).send('Internal server error');
    }
}



let aboutpage = async (req, res) => {
    try {
        const isAuthenticated = req.cookies.jwt !== undefined;
        res.render('user/about',{isAuthenticated});
    } catch (error) {
        console.error('Failed to get home:', error);
        res.render('user/500').send(500).send('Internal server error');
    }
}


let shopepage = async (req, res) => {
    try {
        const isAuthenticated = req.cookies.jwt !== undefined;
        let products = await Products.find();
        let category = await Category.find()
        const coupon = await Coupon.find({active : true})
        const banner = await Banner.find()
        const user = true
        res.render('user/shop', { products, category, user, isAuthenticated,coupon,banner });
    } catch (error) {
        console.error('failed to get home:', error)
        res.render('user/500').send(500).send('internal server error')
    }
}


const loadbycategory = async (req, res) => {
    console.log("hey this is wrong");
    try {
        const isAuthenticated = req.cookies.jwt !== undefined;
        const cat_id = req.params.id
        console.log("here got the cat id ", cat_id);

        const category = await Category.find({})

        const cat_name = await Category.findOne({ _id: cat_id })

        const coupon = await Coupon.find({active : true})


        const categoryname = cat_name.categoryName

        console.log('hey here got the category ', categoryname);

        const products = await Products.find({ category: categoryname })

        console.log('hey here got the category ', products);

        res.render('user/shop', { products, categoryname,user, category, isAuthenticated,coupon })
    } catch (error) {
        res.render('500');
        console.log(error.message);
    }
}

const sortproudct = async (req, res) => {
    try {
        const isAuthenticated = req.cookies.jwt !== undefined;
        let category = await Category.find()
        const sortBy = req.query.sortBy || 'nameAtoZ';
        let sortQuery = {};
        switch (sortBy) {
            case 'priceLowToHigh':
                sortQuery = { price: 1 };
                break;
            case 'priceHighToLow':
                sortQuery = { price: -1 };
                break;
            case 'nameAtoZ':
                sortQuery = { productName: 1 };
                break;
            case 'nameZtoA':
                sortQuery = { productName: -1 };
                break;
            default:
                sortQuery = {};
        }
        const products = await Products.find({}).sort(sortQuery);
        res.render('user/shop', { products,isAuthenticated,category });
    } catch (error) {
        console.error('Error sorting products:', error);
        res.render('user/500').send(500).send('Internal Server Error');
    }
};



let productdetailpage = async (req, res) => {
    try {
        let productId = req.query.id;
        const isAuthenticated = req.cookies.jwt !== undefined;
        let products = await Products.find();
        let product = await Products.findOne({ _id: productId });
        // console.log(product);
        res.render('user/productdetail', { product, isAuthenticated,products });
    } catch (error) {
        console.error('Failed to connect:', error);
        res.render('user/500').send('Internal server error');
    }
}




const loadAuth = (req, res) => [
    res.render('auth')
]

let signupGetpage = async (req, res) => {
    try {
        res.render('user/signup')
    } catch (error) {
        console.error('failed to get login page', error);
        res.render('user/500').send(500).send('internal server error')
    }
}

// use signup here 
let signupPostpage = async (req, res) => {
    try {
        const password = req.body.password;
        if (!password) {
            return res.render('user/500').send(400).json({ message: 'Password is required' });
        }
        // const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPassword = password
        const data = new user({
            name: req.body.username,
            email: req.body.email,
            phonenumber: req.body.phonenumber,
            password: hashedPassword,
        });
        console.log(data);
        const userdata = await data.save();
        console.log(userdata);
        res.redirect('/login?signupSuccess=true');
    } catch (error) {
        console.error(error);
        res.render('user/500').send(500).json({ message: 'Internal server error' });
    }
};

// user login page display 

let logiGetpage = async (req, res) => {
    try {
        const signupSuccess = req.query.signupSuccess === 'true';

        if (req.cookies.jwt) {
            res.redirect('/')
        }
        res.render('user/login', { signupSuccess });

    } catch (error) {
        console.error('failed to get login page', error)
        res.render('user/500').send(500).send('intenal server error')
    }
}

//  user login route
const loginPostpage = async (req, res) => {
    try {
        const foundUser = await user.findOne({ email: req.body.email });

        if (foundUser) {
            const enteredpassword = req.body.password
            // const passwordMatch = await bcrypt.compare(req.body.password, foundUser.password);
            
            if (enteredpassword == foundUser.password) {
                passwordMatch = enteredpassword
            }

            if (foundUser.blocked) {
                console.log('User is blocked');
                res.render('user/login', { error: 'User account is blocked. Please contact support.' });
            } else if (passwordMatch) {
                const token = jwt.sign({
                    id: foundUser._id,
                    name: foundUser.username,
                    email: foundUser.email,
                },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "24h",
                    });

                res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 }); // 24-hour expiry
                console.log('User logged in successfully. Token created.');
                res.redirect('/');
            } else {
                console.log('Incorrect password:', req.body.password);
                res.render('user/login', { error: 'Incorrect password. Please try again.', signupSuccess: false });
            }
        } else {
            console.log('User not found:', req.body.email);
            res.render('user/login', { error: 'User not found. Please register an account.', signupSuccess: false });
        }
    } catch (error) {
        console.error('Internal server error:', error);
        res.render('user/login', { error: 'Internal server error. Please try again later.', signupSuccess: false });
    }
};

// google verification here 
const succesGoogleLogin = async (req, res) => {
    try {

        console.log("heye etfa");
        if (!req.user)

            return res.render('user/500').send(401).send('no user data, login failed')

        console.log(req.user);

        let newUser = await user.findOne({ email: req.user.email })

        if (!newUser) {

            newUser = new user({
                name: req.user.displayName,
                email: req.user.email
            })

            await newUser.save()
        }

        if (newUser.blocked) {
            console.log('User is blocked');
            res.render('user/login', { error: 'User is blocked' });
        }

        const token = jwt.sign({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        },

            process.env.JWT_SECRET,
            {
                expiresIn: '24h'
            }

        )

        // set jwt token in a cookie 

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 1000, // 24 houres 
            secure: process.env.NODE_ENV === "production"
        })

        res.render('user/500').send(200).redirect('/')
        console.log('user loged in with google: jwt created');

    } catch (error) {
        console.error('login erroe', error)
        res.render('user/500').send(500).redirect('user/login')
    }
}

const failureGooglelogin = (req, res) => {
    res.send('Error')
}




// USER LOGOUT

let userLogout = (req, res) => {

    res.clearCookie('jwt')
    console.log('user logout ');

    const alertScript = `
    //     <script>
    //       alert("You are already logged out.");
    //       window.location.href = "/login";
    //     </script>
    //   `;
    //     return res.send(alertScript);
    res.redirect("/login");
};


// forgot password here 

let forgotpasspage = async (req, res) => {
    try {
        res.render('user/forgotpass');
    } catch (error) {
        console.error('Failed to get login page', error);
        res.render('user/500').send(500).send('Internal server error');
    }
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: 'krishnadasp004@gmail.com',
        to: email,
        subject: 'Reset your Password',
        text: `Your OTP to reset your password is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent');
    } catch (error) {
        console.error('Error sending email', error);
    }
};

let forgetEmailPostpage = async (req, res) => {
    const { email } = req.body;

    try {
        const userRecord = await user.findOne({ email });

        console.log(userRecord);
        if (!userRecord) {
            return res.render('user/500').send(404).json({ message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(otp);

        userRecord.otp = otp;
        userRecord.otpExpiration = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
        await userRecord.save();

        // Send OTP with a message
        await sendOtpEmail(email, otp);
        const message = 'OTP sent. Please wait for a few seconds before trying again.';
        res.render('user/forgetotppass', { email, message });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.render('user/500').send(500).json({ message: 'Server error' });
    }
};

let resetPassword = async (req, res) => {
    const { email, otp, newpassword, confirmpassword } = req.body;

    try {
        const userRecord = await user.findOne({ email });

        if (!userRecord) {
            return res.render('user/500').send(404).json({ error: 'User not found.' });
        }

        if (userRecord.otp !== otp || Date.now() > userRecord.otpExpiration) {
            return res.render('user/500').send(400).json({ error: 'Invalid or expired OTP.' });
        }

        if (newpassword !== confirmpassword) {
            return res.render('user/500').send(400).json({ error: 'Passwords do not match.' });
        }

        const hashedPassword = await bcrypt.hash(newpassword, 10);

        // Reset password
        userRecord.password = hashedPassword;

        // Clear OTP fields
        userRecord.otp = undefined;
        userRecord.otpExpiration = undefined;

        await userRecord.save();

        console.log('Password reset successful.');
        res.render('user/500').send(200).render('user/login');
    } catch (error) {
        console.error('Error resetting password:', error);
        res.render('user/500').send(500).json({ error: 'Server error.' });
    }
};



//Login with OTP Start here 


let logingetotp = async (req, res) => {
    try {
        res.render('user/loginotphone')
    } catch (error) {
        console.error('failed to get login page', error)
        res.render('user/500').send(500).send('intenal server error')
    }
}

// ENV details

const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken)

const generateotp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

// requestion for otp after enterd phone

const loginrequestsotp = async (req, res) => {
    const { phonenumber } = req.body;
    console.log(phonenumber);

    try {
        const userRecord = await user.findOne({ phonenumber });

        if (!userRecord) {
            return res.render('user/500').send(404).json({ error: 'User not found' });
        }

        const otp = generateotp();
        userRecord.otp = otp;
        userRecord.otpExpiration = new Date(Date.now()) + 10 * 60 * 1000; // otp in 10 minutes
        await userRecord.save();

        console.log(`Generated OTP is: ${otp}`);

        // send OTP via Twilio SMS
        try {
            await client.messages.create({
                body: `Your OTP for login to Megx is: ${otp}`,
                from: twilioPhoneNumber,
                to: "+91" + phonenumber,
            });
            console.log('OTP SMS sent');
        } catch (error) {
            console.error('Error sending OTP SMS', error);
            return res.render('user/500').send(500).json({ error: 'Error sending OTP' });
        }

        res.render('user/loginotp', { phonenumber });

    } catch (error) {
        console.error('Error requesting OTP', error);
        res.render('user/500').send(500).json({ error: 'Server error' });
    }
};

const loginverifyotp = async (req, res) => {
    const { phonenumber, otp } = req.body;

    console.log("kgkh", otp);

    try {
        const userRecord = await user.findOne({ phonenumber });

        if (!userRecord) {
            return res.render('user/500').send(404).json({ error: 'User not found' });
        }

        if (userRecord.otp !== otp || Date.now() > userRecord.otpExpiration) {
            return res.render('user/500').send(400).json({ error: 'Invalid or expired OTP' });
        }

        // Clear OTP field after successful verification
        userRecord.otp = undefined;
        userRecord.otpExpiration = undefined;
        await userRecord.save();

        res.render('user/500').send(200).redirect('/');
        console.log('User logged in using OTP');
    } catch (error) {
        console.error('Error verifying OTP', error);
        res.render('user/500').send(500).json({ error: 'Server error' });
    }
};










module.exports = {
    homepage,
    signupGetpage,
    logiGetpage,
    signupPostpage,
    loginPostpage,
    loadAuth,
    succesGoogleLogin,
    failureGooglelogin,
    userLogout,
    forgotpasspage,
    forgetEmailPostpage,
    resetPassword,
    logingetotp,
    loginrequestsotp,
    loginverifyotp,
    shopepage,
    productdetailpage,
    loadbycategory,
    aboutpage,
    sortproudct,
    errorpage,
    error
    // loadcheckout
}