const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const bodyParser = require('body-parser')
const passport = require('passport')
require('../passport')
require('dotenv').config()

router.use(passport.initialize())
router.use(passport.session())
router.use(bodyParser.urlencoded({extended:true}))

router.get('/',userController.homepage)
router.get('/login',userController.logiGetpage)
router.post('/user/login',userController.loginPostpage)
router.get('/signup',userController.signupGetpage)
router.post('/user/signup',userController.signupPostpage)
// router.get('forotp',userController.otpGetpage)
router.get('/',userController.loadAuth)

router.get('/loginotp',userController.logingetotp)
router.get('/myaccount',userController.myaccountgetpage)
router.get('/logout',userController.userLogout)
router.get('/forgotpass',userController.forgotpasspage)

//otp verfication 

  



//Auth 

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

//Auth callback 

router.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: '/success',
      failureRedirect: '/failure',
    })
  );

//successs

router.get('/success', userController.succesGoogleLogin);

//failuer

router.get('/failure', userController.failureGooglelogin);

module.exports = router 