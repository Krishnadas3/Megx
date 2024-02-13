const mongoose = require('mongoose');

const connect = mongoose.connect("mongodb://127.0.0.1:27017/Flone");

connect.then(() => {
    console.log('Database connected Successfully');
})
.catch(() => {
    console.log('Database cannot be connected');
});

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
    }
});

// Collection part
const user = mongoose.model('user', loginSchema); // Changed the model name to 'User' for better clarity

module.exports = user; // Exporting the model
