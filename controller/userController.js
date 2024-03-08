
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const user = require('../models/users')
const nodemailer = require('nodemailer')
const Product = require('../controller/productController')
const Products = require('../models/product');
const twilio = require('twilio')
require("dotenv").config()


require('dotenv').config()

//  home page display 

let homepage = (req, res) => {
    try {
        const isAuthenticated = req.cookies.jwt !== undefined;
        res.render('user/index', { isAuthenticated });
    } catch (error) {
        console.error('failed to get home:', error);
        res.status(500).send('internal server error');
    }
}


// shope pagee


let shopepage = async (req, res) => {
    try {
        let products = await Products.find();
        res.render('user/shop', { products });
    } catch (error) {
        console.error('failed to get home:', error)
        res.status(500).send('internal server error')
    }
}

let productdetailpage = (req, res) => {
    try {
        res.render('user/productdetail')
    } catch (error) {
        console.error('failed to connet', error)
        res.status(500).send('internal server error')
    }
}




const loadAuth = (req, res) => [
    res.render('auth')
]

// user signup page display 

let signupGetpage = async (req, res) => {
    try {
        res.render('user/signup')
    } catch (error) {
        console.error('failed to get login page', error);
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
            phonenumber: req.body.phonenumber,
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

let logiGetpage = async (req, res) => {
    try {
        if (req.cookies.jwt) {
            res.redirect('/')
        }
        res.render('user/login')

    } catch (error) {
        console.error('failed to get login page', error)
        res.status(500).send('intenal server error')
    }
}


//  user login route


const loginPostpage = async (req, res) => {
    try {
        const foundUser = await user.findOne({ email: req.body.email });

        if (foundUser) {
            const passwordMatch = await bcrypt.compare(req.body.password, foundUser.password);

            if (foundUser.blocked) {
                console.log('User is blocked');
                res.render('user/login', { error: 'User account is blocked. Please contact support.' });
            }
            else if (passwordMatch) {
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
                res.render('user/login', { error: 'Incorrect password. Please try again.' });
            }
        } else {
            console.log('User not found:', req.body.email);
            res.render('user/login', { error: 'User not found. Please register an account.' });
        }
    } catch (error) {
        console.error('Internal server error:', error);
        res.render('user/login', { error: 'Internal server error. Please try again later.' });
    }
};


// google verification here 

const succesGoogleLogin = async (req, res) => {
    try {
        if (!req.user)

            return res.status(401).send('no user data, login failed')

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

        // req.session.user = newUser
        // res.status(200).render('user/index')

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

        res.status(200).redirect('/')
        console.log('user loged in with google: jwt created');

    } catch (error) {
        console.error('login erroe', error)
        res.status(500).redirect('user/login')
    }
}

const failureGooglelogin = (req, res) => {
    res.send('Error')
}





let myaccountgetpage = async (req, res) => {
    try {
        res.render('user/myaccount')
    } catch (error) {
        console.error('failed to get login page', error)
        res.status(500).send('intenal server error')
    }
}

// USER LOGOUT

let userLogout = (req, res) => {
    // if (!req.session.user) {
    // User is already logged out, redirect to a page with a message

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

    // }

    // req.session.destroy((err) => {
    //     if (err) {
    //         console.error("Error destroying session:", err);
    //         return res.status(500).send("Internal Server Error");
    //     }
    //     console.log("User logged out");
    // });
};


// forgot password here 

let forgotpasspage = async (req, res) => {
    try {
        res.render('user/forgotpass');
    } catch (error) {
        console.error('Failed to get login page', error);
        res.status(500).send('Internal server error');
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
            return res.status(404).json({ message: 'User not found' });
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
        res.status(500).json({ message: 'Server error' });
    }
};

let resetPassword = async (req, res) => {
    const { email, otp, newpassword, confirmpassword } = req.body;

    try {
        const userRecord = await user.findOne({ email });

        if (!userRecord) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (userRecord.otp !== otp || Date.now() > userRecord.otpExpiration) {
            return res.status(400).json({ error: 'Invalid or expired OTP.' });
        }

        if (newpassword !== confirmpassword) {
            return res.status(400).json({ error: 'Passwords do not match.' });
        }

        const hashedPassword = await bcrypt.hash(newpassword, 10);

        // Reset password
        userRecord.password = hashedPassword;

        // Clear OTP fields
        userRecord.otp = undefined;
        userRecord.otpExpiration = undefined;

        await userRecord.save();

        console.log('Password reset successful.');
        res.status(200).render('user/login');
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Server error.' });
    }
};



//Login with OTP Start here 


let logingetotp = async (req, res) => {
    try {
        res.render('user/loginotphone')
    } catch (error) {
        console.error('failed to get login page', error)
        res.status(500).send('intenal server error')
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
            return res.status(404).json({ error: 'User not found' });
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
            return res.status(500).json({ error: 'Error sending OTP' });
        }

        res.render('user/loginotp', { phonenumber });

    } catch (error) {
        console.error('Error requesting OTP', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const loginverifyotp = async (req, res) => {
    const { phonenumber, otp } = req.body;

    console.log("kgkh", otp);

    try {
        const userRecord = await user.findOne({ phonenumber });

        if (!userRecord) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (userRecord.otp !== otp || Date.now() > userRecord.otpExpiration) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Clear OTP field after successful verification
        userRecord.otp = undefined;
        userRecord.otpExpiration = undefined;
        await userRecord.save();

        res.status(200).redirect('/');
        console.log('User logged in using OTP');
    } catch (error) {
        console.error('Error verifying OTP', error);
        res.status(500).json({ error: 'Server error' });
    }
};


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
    loginverifyotp,
    shopepage,
    productdetailpage
}