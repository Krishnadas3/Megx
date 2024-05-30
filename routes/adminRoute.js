
const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const productController = require('../controller/productController')
const categoryController = require('../controller/catgorieController')
const order_controller  = require('../controller/ordercontroller')
const adminAuth = require('../middleware/adminjwt')
const admin = require('../models/admin')
require('dotenv').config();
const path = require('path')



const multer = require('multer')
const Order = require('../models/orederModel')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/img'))
    }, filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname
        cb(null, name)
    }
})

const upload = multer({ storage: storage })

// login 

router.get('/adminlogin',adminController.logingetpage)
router.post('/admin/login',adminController.loginPostpage)
router.get('/admin/dashboard',adminAuth,adminController.dashboardpage)

//customerlist

router.get('/admin/customerslist',adminAuth,adminController.customerslist)
router.post('/blockuser',adminController.blockUser)


// category Management 
router.get('/admin/categorielist',adminAuth,categoryController.categorieList)
router.get('/admin/addCategory',adminAuth,categoryController.addCategory)
router.post('/admin/addCategory',adminAuth,categoryController.submitAddCategory)
router.post('/deleteCategory/:id',adminAuth,categoryController.deleteCategory)
router.get('/admin/categoriesedit/:id',adminAuth,categoryController. editCategory)
// router.post('/admin/editCategory/:id',adminAuth,categoryController.submitEditCategory)

//subcatgroy management 

router.get('/admin/subcategories',adminAuth,categoryController.subCategoryList)
router.get('/admin/addsubcategory',adminAuth,categoryController.addSubCategory)
router.post('/admin/addsubcategory',adminAuth, categoryController.submitAddSubCategory);

router.get('/admin/editsubcategory', adminAuth, categoryController.editSubCategory);
router.post('/admin/editsubcategory/:id', adminAuth, categoryController.submitEditSubCategory);

router.post('/admin/deletesubcategory/:id',adminAuth, categoryController.deleteSubCategory);



// router.get('/admin/customerdetail',adminController.customerdetailpage)
// router.get('/admin/categorielist',adminController.categorielistpage)
// router.get('/admin/categoriesadd',adminController.categoriesaddpage)
// router.get('/admin/categoriesedit',adminController.editCategory)
// router.get('/admin/categoriesedit/:id',adminController.editCategory);
// router.post('/admin/categoriesedit/:id',adminController.submitEditCategory);


//product deails

router.get('/admin/productlist',productController.productlistpage)
router.get('/admin/productadd',productController.productaddpage)
router.post('/admin/addProduct',upload.array('image',4),productController.addproductSubmit)
// app.post('/add-product', upload.array('image', 12), addproductSubmit);
router.get('/admin/productgrid',productController.productgridpage)
router.delete('/admin/deleteproduct',productController.deleteProduct)
router.get('/admin/productedit/:id', productController.productupdate);
router.post('/admin/productupdate',upload.array('image',4), productController.editproduct);



// router.post('/admin/logout',adminController.adminLogout)
router.get('/admin/logout',adminAuth,adminController.adminLogout)


router.get('/admin/list-order',adminAuth,order_controller.load_order);
router.get('/admin/view-order',adminAuth, order_controller.view_order_admin)
router.post('/admin/update_status',adminAuth, order_controller.updateStatus);


// router.post('/blockuser',adminController.blockUser)
// router.post('/addCategory',adminController.submitAddCategory)


module.exports = router
