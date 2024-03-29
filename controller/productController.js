
const Product = require('../models/product')
// const cloudinary = require('../config/cloudinary');
const { find } = require('../models/admin');
const Categorie = require('../models/category');

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
    let productData = req.body
      
     
      // console.log(productname);
      if (!productData) {
         console.log();
          const category = await category.find({})
          res.render('add-product',{message:'please fill the field', category })
      }else{
          console.log("inn ekse");
          const images = []
          console.log(req.files);
          for (file of req.files) {
              images.push(file.filename)
          }
          console.log(images);
          console.log(productData,'product data');
          let { Price, Stock, Description,category} = productData;
        const product = req.body.ProductName
        const stockQuantity = req.body.stockQuantity
        console.log(product,'this will print name');
          const Newproduct = new Product({
  
              productName : product,
              stockQuantity: stockQuantity,
              price: Price,
              description: Description,
              category: category,
              images: images
  
          })
          console.log('here the newprodcut show',Newproduct);
              
      const result = await Newproduct.save()
   
      if (result) {
          res.redirect('/admin/productlist')
      } 
              
      }
  } catch (error) {
      console.log(error.message);

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
                    images: req.files.map(file => file.filename) 
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




module.exports = {
    productlistpage,
    productgridpage,
    productaddpage,
    productdetailpage,
    addproductSubmit,
    deleteProduct,
    productupdate,
     editproduct
}