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
    wishlist: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }
    }],

});

// Collection part
const user = mongoose.model('user', loginSchema); // Changed the model name to 'User' for better clarity

module.exports = user;
