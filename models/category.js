const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product' // Assuming you have a 'Product' model
    }]
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
