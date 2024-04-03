const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const cartController = require('../controller/cartController')
const bodyParser = require('body-parser')
const passport = require('passport')
const userAuth = require('../middleware/usejwt')
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
router.get('/forgotpass',userController.forgotpasspage)
router.post("/forgotpassword",userController.forgetEmailPostpage)
router.post("/resetpassword",userController.resetPassword)
router.get('/loginotp',userController.logingetotp)
router.post('/loginotp',userController.loginrequestsotp)
router.post('/loginotpdone',userAuth,userController.loginverifyotp)
router.get('/logout',userAuth,userController.userLogout)
router.get('/',userController.loadAuth)
router.get('/myaccount',userController.myaccountgetpage)
router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/auth/google/callback',passport.authenticate('google', {successRedirect: '/success',failureRedirect: '/failure',}));
router.get('/success', userController.succesGoogleLogin);
router.get('/failure', userController.failureGooglelogin);


//shop 
router.get('/shop',userController.shopepage)
router.get('/productdetail',userController.productdetailpage)


//wishlist 
router.post('/addtowhishlist', userAuth, userController.AddTowishlist)
router.get('/wishlist', userAuth, userController.loadwhislist)
router.post('/deletewhishlist',userAuth, userController.deletewhishlist)


// cart
router.post('/addtocart',userAuth,cartController.AddToCart)
router.get('/cartpage',userAuth,cartController.ListCart)
router.post('/deletecartproduct',userAuth, cartController.deleteCartProduct)

// router.post('/changequantity',userAuth, cartController.cartquantityupdation)

module.exports = router 