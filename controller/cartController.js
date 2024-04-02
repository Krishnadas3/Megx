// const User = require('../models/users'); 
const Product = require('../models/product');
const Cart = require('../models/cart')
const { default: mongoose } = require('mongoose');


require('dotenv').config()


const AddToCart = async (req, res) => {
    try {
        const productId = req.body.productId;
        console.log("here got the productid",productId);
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            const product = await Product.findOne({ _id: productId });

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            const newCartItem = {
                productId: product._id,
                price: product.price,
                qty: 1,
                productTotalprice: product.price
            };

            cart = new Cart({
                userId: userId,
                products: [newCartItem]
            });

            await cart.save();
            return res.json({ status: true });
        }
        const existingProductIndex = cart.products.findIndex(item => item.productId.toString() === productId);

        if (existingProductIndex === -1) {
            const product = await Product.findOne({ _id: productId });

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            const newCartItem = {
                productId: product._id,
                price: product.price,
                qty: 1,
                productTotalprice: product.price
            };

            cart.products.push(newCartItem);
            await cart.save();
            console.log('Item added to cart');
            return res.json({ status: true });
        }
        console.log('Product already exists in the cart');
        return res.json({ status: false });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



let ListCart = async (req, res) => {
    try {
        // Fetch all products
        let products = await Product.find();
        console.log('products', products); // Corrected variable name

        // Render the cart page with the fetched products
        res.render('user/cartpage', { products });
    } catch (error) {
        console.log(error.message);
        console.log('error from list cart');
        res.render('500');
    }
};



const deleteCartProduct = async (req, res) => {
    try {
        console.log('form deletecartlist');
        const userId = req.user.id;
        console.log('here got the userId', userId);
        const deleteProId = req.body.productId;
        console.log('here got the productId', deleteProId);

        const deletecart = await Cart.findOneAndUpdate(
            { userId: userId },
            { $pull: { products: { productId: deleteProId } } }
        );

        console.log("here got the deletecart ", deletecart);

        if (deletecart) {
            // Successful deletion
            res.json({ success: true });
        } else {
            // Cart not found or product not found in the cart
            res.status(404).json({ error: 'Cart or Product not found' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const qunantityupdation = async (req,res) =>{
    
}


module.exports = {
    AddToCart,
    // cartquantityupdation,
    ListCart,
    deleteCartProduct
}