
const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const productController = require('../controller/productController')
// const adminController = require('../controller/adminController')
const adminAuth = require('../middleware/adminjwt')
const admin = require('../models/admin')
const upload = require('../config/multer');
require('dotenv').config();

router.get('/adminlogin',adminController.logingetpage)
router.post('/admin/login',adminController.loginPostpage)
router.get('/admin/dashboard',adminAuth,adminController.dashboardpage)

// router.get('/admin/customers',adminController.userList)
router.get('/admin/customerslist',adminAuth,adminController.customerslist)
router.post('/blockuser',adminController.blockUser)


// category Management 
router.get('/admin/categorielist',adminAuth,adminController.categorieList)
router.get('/admin/addCategory',adminAuth,adminController.addCategory)
router.post('/admin/addCategory',adminAuth,adminController.submitAddCategory)
router.get('/admin/categoriesedit/:id',adminAuth,adminController.editCategory)
router.post('/admin/editCategory/:id',adminAuth,adminController.submitEditCategory)
router.post('/deleteCategory/:id',adminAuth,adminController.deleteCategory)

//subcatgroy management 

// router.get('/admin/subcategories',adminController.subCategoryList)
// router.get('/admin/addsubcategory',adminController.addSubCategory)
// router.post('/admin/addsubcategory',adminController.submitAddSubCategory)
// router.get('/admin/editsubcategory',adminController.editSubCategory)
// router.post('/admin/editsubcategory',adminController.editSubCategory)
// router.post('/admin/deletesubcategory',adminController.deleteSubCategory)


// router.get('/admin/customerdetail',adminController.customerdetailpage)
// router.get('/admin/categorielist',adminController.categorielistpage)
// router.get('/admin/categoriesadd',adminController.categoriesaddpage)
// router.get('/admin/categoriesedit',adminController.editCategory)
// router.get('/admin/categoriesedit/:id',adminController.editCategory);
// router.post('/admin/categoriesedit/:id',adminController.submitEditCategory);

router.get('/admin/productlist',productController.productlistpage)
router.get('/admin/productadd',productController.productaddpage)
router.post('/admin/addProduct',adminAuth,upload.array('image',6),productController.addproductSubmit)
router.get('/admin/productgrid',productController.productgridpage)
router.get('/admin/productedit',productController.producteditpage)
router.post('/admin/deletproduct',adminAuth,productController.deleteProduct)



// router.post('/admin/logout',adminController.adminLogout)
router.get('/admin/logout',adminAuth,adminController.adminLogout)


// router.post('/blockuser',adminController.blockUser)
// router.post('/addCategory',adminController.submitAddCategory)


module.exports = router
