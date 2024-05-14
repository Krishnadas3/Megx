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
    size: [{
        type: String,
        required: true
    }],
    // category:{
    //    type: mongoose.Schema.Types.ObjectId,
    //    ref: 'Category',
    //    required: true
    // }
    category: {type:String}
    
});

const Product = mongoose.model('Product',productSchema);

module.exports = Product;