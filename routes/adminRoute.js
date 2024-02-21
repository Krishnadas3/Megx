
const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')



router.get('/admin',adminController.adminlogin)

router.post('/admin/login',adminController.loginPostpage)

module.exports = router
