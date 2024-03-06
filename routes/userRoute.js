const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
// const otp = require('../controller/otp')
const bodyParser = require('body-parser')
const passport = require('passport')
const userAuth = require('../middleware/usejwt')
// const jwtMiddleware = require('../middleware/jwtmiddle')
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
router.get('/',userController.loadAuth)


router.get('/myaccount',userController.myaccountgetpage)
router.get('/shop',userController.shopepage)
router.get('/productdetail',userController.productdetailpage)
router.get('/logout',userController.userLogout)
router.get('/forgotpass',userController.forgotpasspage)
router.post("/forgotpassword",userController.forgetEmailPostpage)
router.post("/resetpassword",userController.resetPassword)
router.get('/loginotp',userController.logingetotp)
router.post('/loginotp',userController.loginrequestsotp)
router.post('/loginotpdone',userController.loginverifyotp)

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