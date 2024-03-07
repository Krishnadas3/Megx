const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName:{type:String},
    description:{type:String},
    price:{type:String},
    brand:{type:String},
    category:{type:String},
    subCategory:{type:String},
    stockQuantity:{type:String},
    image:{type:String},
    addedOn:{type:Date,default:Date.now},
    images:{type:Array}
});

const Product = mongoose.model('Product',productSchema);

module.exports = Product;