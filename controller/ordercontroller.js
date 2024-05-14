const Product = require('../models/product');
const Cart = require('../models/cart')
const user = require('../models/users');
// const Order = require('../models/orederModel')
const Category = require('../models/category')
const { default: mongoose } = require('mongoose');


let loadcheckout = async (req, res) => {
    try {
        const isAuthenticated = req.cookies.jwt !== undefined;
        const id = req.user.id;
        const userId = req.user.id;
        const User = await user.find({ _id: id })
        const cart = await Cart.findOne({ userId: userId }).populate('products.productId');

        if (!cart || cart.products.length === 0) {
            return res.render('user/cartpage', { products: [], cartTotalPrice: 0 });
        }

        const cartTotalPrice = cart.products.reduce((total, item) => total + (item.price * item.qty), 0);


        const productsInCart = cart.products.map(item => ({
            _id: item.productId._id,
            images: item.productId.images,
            productName: item.productId.productName,
            price: item.price,
            qty: item.qty,
            productTotalprice: item.productTotalprice
        }));
        res.render('user/checkout', { isAuthenticated, User, products: productsInCart, cartTotalPrice })
    } catch (error) {
        console.error('failed to get login page', error)
        res.status(500).send('intenal server error')
    }
}

let placeorder = async (req, res) => {
    try {

    } catch (error) {

    }
}


module.exports = {
    loadcheckout,
    // order_success
}