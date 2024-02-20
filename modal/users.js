const mongoose = require('mongoose');


const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    otp:{
        type:String
    }

});




// Collection part
const user = mongoose.model('user', loginSchema); // Changed the model name to 'User' for better clarity

module.exports = user; // Exporting the model
