const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const cartController = require('../controller/cartController')
const wishlist = require('../controller/wishlist')
const userprofile = require('../controller/userprofile')
const order = require('../controller/ordercontroller')
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
router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/auth/google/callback',passport.authenticate('google', {successRedirect: '/success',failureRedirect: '/failure',}));
router.get('/success', userController.succesGoogleLogin);
router.get('/failure', userController.failureGooglelogin);


//shop 
router.get('/shop',userController.shopepage)
router.get('/productdetail',userController.productdetailpage)

//Pagination

router.get('/shop/:id',userController.loadbycategory)
router.get('/sortProducts',userController.sortproudct)

//about
router.get('/about',userController.aboutpage)

//wishlist 
router.post('/addtowhishlist', userAuth,wishlist.addWishlist)
router.get('/wishlist', userAuth, wishlist.loadwhislist)
router.post('/remove_wishlist',userAuth,wishlist.remove_from_wishlist);
router.post('/add_to_cart',userAuth,wishlist.add_to_cart);


// cart
router.post('/addtocart',userAuth,cartController.AddToCart)
router.get('/cartpage',userAuth,cartController.ListCart)
router.post('/deletecartproduct',userAuth, cartController.deleteCartProduct)
router.post('/changequantity',userAuth, cartController.cartquantityupdation)

//checkout
router.get('/checkout',userAuth, order.loadcheckout)
router.post('/place_order',userAuth,order.place_order)
router.get('/order_success',userAuth,order.order_success);
router.post('/verify-payment',userAuth, order.verify_payment);



router.get('/orders',userAuth, order.show_orderlist);
router.get('/view-order', userAuth, order.view_order_user);
router.post('/cancel_order',userAuth, order.cancel_order);


//userprofile
router.get('/myaccount',userAuth,userprofile.myaccountgetpage)
router.post('/add_address',userAuth,userprofile.add_address);
router.get('/address',userAuth,userprofile.showAddress)
router.post('/edit-address',userAuth, userprofile.edit_address);
router.post('/delete_address',userAuth,userprofile.deleteAddress);


module.exports = router 