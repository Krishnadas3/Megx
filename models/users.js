const mongoose = require('mongoose');


const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    phonenumber: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    wallet:{
        type: Number,
        default: 0
    },
    otp: { type: String },
    otpExpiration: { type: String },
    blocked: {
        type: Boolean,
        default: false,
    },
    wishlist: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }
    }],
    address: [{
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
        default_address: {
            type: Boolean,
            required: true
        }

    }]

});

// Collection part
const user = mongoose.model('user', loginSchema); // Changed the model name to 'User' for better clarity

module.exports = user;
