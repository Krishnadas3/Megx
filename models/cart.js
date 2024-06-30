// // cart.js (or wherever you define your models)
// const mongoose = require('mongoose');

// const cartSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     products: [{
//         productId: {
//             type: mongoose.Types.ObjectId,
//             ref: 'Product',
//             required: true
//         },
//         price: {
//             type: Number,
//         },
//         qty: {
//             type: Number,
//             required: true,
//         },
//         productTotalprice: {
//             type: Number,
//             required: true
//         },
        
//     }],
// });

// const Cart = mongoose.model('Cart', cartSchema);

// module.exports = Cart;

