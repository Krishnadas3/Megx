const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName:{type:String},
    description:{type:String},
    price:{type:String},
    brand:{type:String},
    subCategory:{type:String},
    stockQuantity:{type:String},
    addedOn:{type:Date,default:Date.now},
    images:{type:Array},
    category:{
       type:String
    }
    
});

const Product = mongoose.model('Product',productSchema);

module.exports = Product;