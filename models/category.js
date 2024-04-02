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
    }],
    subCategory: [{
        subCategoryName: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
