const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const bodyParser = require('body-parser')


router.use(bodyParser.urlencoded({extended:true}))

router.get('/',userController.homepage)
router.get('/login',userController.logiGetpage)
router.get('/signup',userController.signupGetpage)

router.post('/user/signup',userController.signupPostpage)
router.post('/user/login',userController.loginPostpage)


module.exports = router