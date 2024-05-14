const mongoose = require('mongoose');
const Product = require('./productModel');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: String,
        unique: true,

    },
    address: {
        name: {
            type: String,
            required: true
        }, 
        number: {
            type: Number,
            required: true
        }, 
        pincode: {
            type: Number,
            required: true
        }, 
        state: {
            type: String,
            required: true
        },
        district :{
            type : String ,
            required: true
        } ,
        place: {
            type: String,
            required: true
        }, 
        street: {
            type: String,
            required: true
        }, 
        building: {
            type: String,
            required: true
        }, 
    },
    date: {
        type: Date,
        default: Date.now()
    },
    
    product: [{
        productid: {
            type:  mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true

        },
        qty: {
            type: Number,
            required: true
        },
        singlePrice: {

            type: Number,
            required: true
        },
        singleTotel: {
            type: Number,
            required: true
        },

    }],
    totel: {

        type: Number,
        required: true
    },

    discount: {

        type: Number
    },

    paymentType: {

        type: String,
        required: true
    },

    status: {
        type: String,
        default: "Confirmed"
    }


});

const Order = mongoose.model("Order", orderSchema)
module.exports = Order