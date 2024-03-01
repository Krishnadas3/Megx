
const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const admin = require('../models/admin')

router.get('/adminlogin',adminController.logingetpage)
router.post('/admin/login',adminController.loginPostpage)
router.get('/admin/dashboard,',adminController.dashboardpage)

// router.get('/admin/customers',adminController.userList)
router.get('/admin/customerslist',adminController.customerslist)
router.post('/blockuser',adminController.blockUser)


// category Management 
router.get('/admin/categorielist',adminController.categorieList)
router.get('/admin/addCategory',adminController.addCategory)
router.post('/admin/addCategory',adminController.submitAddCategory)
router.get('/admin/categoriesedit/:id',adminController.editCategory)
router.post('/admin/editCategory/:id',adminController.submitEditCategory)
router.post('/deleteCategory/:id',adminController.deleteCategory)


// router.get('/admin/customerdetail',adminController.customerdetailpage)
// router.get('/admin/categorielist',adminController.categorielistpage)
// router.get('/admin/categoriesadd',adminController.categoriesaddpage)
// router.get('/admin/categoriesedit',adminController.editCategory)
// router.get('/admin/categoriesedit/:id',adminController.editCategory);
// router.post('/admin/categoriesedit/:id',adminController.submitEditCategory);



// router.post('/blockuser',adminController.blockUser)
// router.post('/addCategory',adminController.submitAddCategory)


module.exports = router
