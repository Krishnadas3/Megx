
const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const bodyParser = require('body-parser');
// const { route } = require('./adminRoute');

// body parser middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


//Routes
router.get('/adminlogin',adminController.logingetpage)
router.get('/admin/dashboard',adminController.dashboardPage)
router.get('/admin/customers',adminController.customerspage)
router.get('/admin/customerdetail',adminController.customerdetailpage)



router.post('/admin/login',adminController.loginPostpage)

module.exports = router
