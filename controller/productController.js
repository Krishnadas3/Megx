
const Product = require('../models/product')
const cloudinary = require('../config/cloudinary')

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
        res.status(200).render('admin/product-add')
    } catch (error) {
        console.log(error);
        res.status(404).send("not found")
    }
}

let addproductSubmit =async (req,res) =>{
  console.log("req.body :", req.body);
  console.log("req.files :", req.files);
  let imageData = req.files;
  let productData = req.body;
  let { ProductName, Price, Stock, Description} = productData;
  const imageUrls = [];
  // Upload images to Cloudinary
  try {

    if(productData){
      for (const file of imageData) {
        const result = await cloudinary.uploader.upload(file.path);
        imageUrls.push(result.secure_url);
      }
      console.log("imageurls: ",imageUrls);
    }
    
    let newProduct = {
      productName: ProductName,
      description: Description,
      price: Price,
      stockQuantity: Stock,
      images:imageUrls
    };

    let products = await Product.find();
    console.log("products: ",products);
    if (!products) {
      res.status(400).send('product Not Found');
    } else {
      products.push(newProduct);
      await Product.create(newProduct)
      res.redirect('/admin/productlist');
    }
  } catch (error) {
    console.error("Error uploading images to Cloudinary:", error);
    return res.status(500).send("Error uploading images to Cloudinary");
  }
}


let  productdetailpage = async(req,res) =>{
    try {
        res.status(200).render('admin/product-detail')
    } catch (error) {
        console.log(error);
        res.status(404).send("not found")
    }
}

let producteditpage = async(req,res) => {
    try {
        res.status(200).render('admin/product-edit')
    } catch (error) {
        console.log(error);
        res.status(404).send("not found")
    }
} 

module.exports = {
    productlistpage,
    productgridpage,
    productaddpage,
    productdetailpage,
    producteditpage,
    addproductSubmit
}