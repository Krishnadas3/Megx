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
    otp: { type: String },
    otpExpiration: { type: String },
    blocked: {
        type: Boolean,
        default: false,
    },
    cart: [{

        productId: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        Price: {
            type: Number,
        },
        qty: {
            
            type: Number,
            required: true
        },
        productTotalprice: {
            type: Number,
            required: true
        }
    }]

});

// Collection part
const user = mongoose.model('user', loginSchema); // Changed the model name to 'User' for better clarity

module.exports = user; // Exporting the model
