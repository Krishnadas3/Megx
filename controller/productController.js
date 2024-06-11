
const Product = require('../models/product')
// const cloudinary = require('../config/cloudinary');
const { find } = require('../models/admin');
const Categorie = require('../models/category');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


require('dotenv').config()


let productlistpage = async (req,res) => {
    try {
        let products = await Product.find();
        console.log("product: ",Product);
        res.render('admin/product-list',{products})
    } catch (error) {
        console.log(error);
        res.status(404).send("not found")
    }
}

let productgridpage = async (req,res) => {
    try {
        res.status(200).render('admin/product-grid')
    } catch (error) {
        console.log(error);
        res.status(404).send("not found")
    }
}

let productaddpage  = async(req,res) =>{
    try { 
      const category = await Categorie.find()
      console.log(category);
        res.status(200).render('admin/product-add',{category})
    } catch (error) {
        console.log(error);
        res.status(404).send("not found")
    }
}

// let addproductSubmit =async (req,res) =>{
//   console.log("req.body :", req.body);
//   console.log("req.files :", req.files);
//   let imageData = req.files;
//   let productData = req.body;
  // const category = req.body.category
  // const name = req.body.productName
  // console.log(name);
  // console.log(category);
  // console.log(productData);
  // let { ProductName, Price, Stock, Description,category} = productData;
  // const imageUrls = [];
  // Upload images to Cloudinary
//   try {

//     if(productData){
//       for (const file of imageData) {
//         const result = await cloudinary.uploader.upload(file.path);
//         console.log(result,'image url result from cloudinary');
//         imageUrls.push(result.secure_url);
//       }
//       console.log("imageurls: ",imageUrls);
//     }
    
//     let newProduct = {
//       productName: ProductName,
//       description: Description,
//       price: Price,
//       stockQuantity: Stock,
//       category:category,
//       images:imageUrls
//     };

//     let products = await Product.find();
//     console.log("products: ",products);
//     if (!products) {
//       res.status(400).send('product Not Found');
//     } else {
//       products.push(newProduct);
//       await Product.create(newProduct)
//       res.redirect('/admin/productlist');
//     }
//   } catch (error) {
//     console.error("Error uploading images to Cloudinary:", error);
//     return res.status(500).send("Error uploading images to Cloudinary");
//   }
// }



const addproductSubmit = async (req, res) => {
    try {
        let productData = req.body;
        if (!productData) {
            const categories = await Category.find({});
            res.render('add-product', { message: 'please fill the field', categories });
        } else {
            const images = [];
            console.log(req.files);
            for (const file of req.files) {
                images.push(file.filename);
            }
            let { Price, Stock, Description, category } = productData;
            const product = req.body.ProductName;
            const stockQuantity = req.body.Stock;
            console.log(product, 'this will print name');
            const NewProduct = new Product({
                productName: product,
                stockQuantity: stockQuantity,
                price: Price,
                description: Description,
                category: category,
                images: images,
                size: req.body.size,
            });
            console.log('here the new product shows', NewProduct);
            const result = await NewProduct.save();
            if (result) {
                res.redirect('/admin/productlist');
            }
        }
    } catch (error) {
        console.log(error.message);
    }
};





let  productdetailpage = async(req,res) =>{
    try {
        res.status(200).render('admin/product-detail')
    } catch (error) {
        console.log(error);
        res.status(404).send("not found")
    }
}

// let producteditpage = async(req,res) => {
//     try {
//         res.status(200).render('admin/product-edit')
//     } catch (error) {
//         console.log(error);
//         res.status(404).send("not found")
//     }
// } 

//  let deleteProduct = async (req,res) =>{
//   let productId = req.params.id;
//   console.log(productId)
//   let products = await Product.find()
//   if(!products){
//     return res.status(400).send('prodcut not found')
//   }
//   products = product.filter(prod => prod._id.tostring() == productId )
//   Prodcut.save()
//   console.log('product deleted');
//   res.redirect('/admin/productlist')

const deleteProduct = async (req, res) => {

    try {
      console.log('product delete');
    const product = req.body.productId
       console.log(product,'not getting the product');
        const deleted = await Product.deleteOne({ _id: product })
       
       .then(()=>{
        res.json({success:true})
       }).catch((err)=>{
        console.log(err);
       })
       console.log(deleted);
       
           
        
    } catch (error) {
        console.log(error.message);
    }
}



const productupdate = async (req, res) => {

    try {

        const category = await Categorie.find()
        // console.log('here get',category);
        const product = await  Product.findOne({_id:req.params.id}).populate('category')
        // const productcategory =  product.category
        // console.log(productcategory);
        
        
     
        res.render('admin/product-edit', { product: product,category }) //{category : category}
    } catch (error) {
        console.log(error.message);
    }
}

const editproduct = async (req, res) => {
    console.log('hi');
    try {
        const id = req.query.id;
        console.log(id);
        if (id) {
            await Product.updateOne({ _id: id }, {
                $set: {
                    productName: req.body.ProductName,
                    category: req.body.Category,
                    price: req.body.Price,
                    description: req.body.Description,
                    images: req.files.map(file => file.filename) ,
                    size: req.body.size,
                }
            });
            res.redirect('/admin/productlist');
        } else {
            console.log('else');
        }
    } catch (error) {
        console.log(error.message);
    }
};

const sort = async (req, res) => {
    try {
        const isAuthenticated = req.cookies.jwt !== undefined;
        let user = req.user && req.user.id ? true : false;
        const sort_value = req.query.value;

        const category = await Categorie.find({});

        let sortCriteria;
        switch (sort_value) {
            case "nameAtoZ":
                sortCriteria = { productName: 1 }; // Ascending
                break;
            case "nameZtoA":
                sortCriteria = { productName: -1 }; // Descending
                break;
            case "priceHighToLow":
                sortCriteria = { price: -1 }; // Descending
                break;
            case "priceLowToHigh":
                sortCriteria = { price: 1 }; // Ascending
                break;
            default:
                sortCriteria = {};
        }

        const products = await Product.find({}).sort(sortCriteria);
        res.render("user/shop", { products,isAuthenticated, user, category, category_name: "sort", coupon: [], countpro: '' });

    } catch (error) {
        res.render('500');
        console.log(error.message);
    }
};


const search_product = async (req, res) => {
    try {
        const isAuthenticated = req.cookies.jwt !== undefined;
        let user = req.user && req.user.id ? true : false;
        const input = req.body.s;
        const result = new RegExp(input, 'i');
        const products = await Product.find({ productName: result }).populate('category');
        console.log("hey here got th ep prdu",products);
        const category = await Categorie.find();
        res.render('user/shop', { category,isAuthenticated, products, user, category_name: "search", coupon: [], countpro: '' });
    } catch (error) {
        res.render('500');
        console.log(error.message);
    }
};





module.exports = {
    productlistpage,
    productgridpage,
    productaddpage,
    productdetailpage,
    addproductSubmit,
    deleteProduct,
    productupdate,
    editproduct,
    search_product,
    sort
}