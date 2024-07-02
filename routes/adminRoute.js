
const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const productController = require('../controller/productController')
const categoryController = require('../controller/catgorieController')
const order_controller  = require('../controller/ordercontroller')
const banner = require('../controller/banner');
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

// router.get(' admin/sales-report', adminAuth , adminController.salesReport );
router.get('/admin/sales-report',adminAuth,adminController.salesReport)
router.get('/admin/indexx',adminAuth,adminController.home)
router.post('/admin/sales-report' , adminAuth , adminController.showSalesreport );


// admin_route.get('/sales-report', auth.isLogin , admincontroller.salesReport );
// admin_route.post('/sales-report' , auth.isLogin , admincontroller.showSalesreport );

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
router.post('/admin/confirm_return', order_controller.confirm_return)


router.get('/admin/add-banner', adminAuth, banner.show_banner)
router.post('/admin/add-banner', adminAuth, upload.single('image'), banner.add_banner)
router.get('/admin/add-banner', adminAuth, banner.show_banner)
router.get('/admin/list-banner', adminAuth, banner.show_banner_list)
router.post('/admin/delete-banner',adminAuth, banner.delete_banner);
router.post('/admin/edit-banner',adminAuth, banner.edit_banner);

//coupen 
router.get('/admin/add-coupon',adminAuth, order_controller.load_coupon);
router.post('/admin/add-coupon', order_controller.add_coupon);
router.get('/admin/list-coupon', adminAuth, order_controller.list_coupon);
router.post('/admin/delete-coupon',adminAuth, order_controller.delete_coupon)
router.get('/admin/edit-coupon', adminAuth, order_controller.edit_coupon);
router.post('/admin/edit-coupon', order_controller.editing_coupon);
router.post('/admin/coupon_active', order_controller.coupon_active)


router.get('/vendor/home',adminAuth,adminController.adminhome)


module.exports = router
