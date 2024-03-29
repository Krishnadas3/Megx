
const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const productController = require('../controller/productController')
// const adminController = require('../controller/adminController')
const categoryController = require('../controller/catgorieController')
const adminAuth = require('../middleware/adminjwt')
const admin = require('../models/admin')
// const upload = require('../config/multer');
require('dotenv').config();
const path = require('path')



const multer = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/img'))
    }, filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname
        cb(null, name)
    }
})

const upload = multer({ storage: storage })


router.get('/adminlogin',adminController.logingetpage)
router.post('/admin/login',adminController.loginPostpage)
router.get('/admin/dashboard',adminAuth,adminController.dashboardpage)

// router.get('/admin/customers',adminController.userList)
router.get('/admin/customerslist',adminAuth,adminController.customerslist)
router.post('/blockuser',adminController.blockUser)


// category Management 
router.get('/admin/categorielist',adminAuth,categoryController.categorieList)
router.get('/admin/addCategory',adminAuth,categoryController.addCategory)
router.post('/admin/addCategory',adminAuth,categoryController.submitAddCategory)
// router.get('/admin/categoriesedit/:id',adminAuth,adminController.editCategory)
// router.post('/admin/editCategory/:id',adminAuth,adminController.submitEditCategory)
router.post('/deleteCategory/:id',adminAuth,categoryController.deleteCategory)

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
router.post('/admin/addProduct',upload.array('image',4),productController.addproductSubmit)
// admin_route.post('/add-product',upload.array('image', 4), product_Controller.addproduct)
router.get('/admin/productgrid',productController.productgridpage)
// router.get('/admin/productedit',productController.producteditpage)
router.delete('/admin/deleteproduct',productController.deleteProduct)
router.get('/admin/productedit/:id', productController.productupdate);
router.post('/admin/productupdate',upload.array('image',4), productController.editproduct);


// router.get('/admin/productpage:/id',auth.islogin, product_Controller.productupdate)
// router.post('/productupdate', product_Controller.editproduct)


// router.post('/admin/logout',adminController.adminLogout)
router.get('/admin/logout',adminAuth,adminController.adminLogout)


// router.post('/blockuser',adminController.blockUser)
// router.post('/addCategory',adminController.submitAddCategory)


module.exports = router
