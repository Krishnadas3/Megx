
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product'
    }]
});

const Categorie = mongoose.model('Categorie', categorySchema);

module.exports = Categorie