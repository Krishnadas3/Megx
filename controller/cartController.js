// const User = require('../models/users'); 
const Product = require('../models/product');
const Cart = require('../models/cart')
const User = require('../models/users')
const { default: mongoose } = require('mongoose');


require('dotenv').config()


const AddToCart = async (req, res) => {
    try {
        const productId = req.body.productId;
        console.log("here got the productid", productId);
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            const product = await Product.findOne({ _id: productId });

            if (!product) {
                return res.render('user/500').send(404).json({ error: 'Product not found' });
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
                return res.render('user/500').send(404).json({ error: 'Product not found' });
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
        res.render('user/404')
        return res.render('user/500').send(500).json({ error: 'Internal Server Error' });
    }
};



let ListCart = async (req, res) => {
    try {
        const isAuthenticated = req.cookies.jwt !== undefined;
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId: userId }).populate('products.productId');

        if (!cart || cart.products.length === 0) {
            return res.render('user/cartpage', { products: [], cartTotalPrice: 0 }); // Assuming cartTotalPrice is 0 if cart is empty
        }

        const cartTotalPrice = cart.products.reduce((total, item) => total + item.productTotalprice, 0);

        const productsInCart = cart.products.map(item => ({
            _id: item.productId._id,
            images: item.productId.images,
            productName: item.productId.productName,
            price: item.price,
            qty: item.qty,
            productTotalprice: item.productTotalprice 
        }));
        
        res.render('user/cartpage', { products: productsInCart, cartTotalPrice, isAuthenticated });
    } catch (error) {
        console.log(error.message);
        console.log('error from list cart');
        res.render('user/500');
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
            res.render('user/500').send(404).json({ error: 'Cart or Product not found' });
        }
    } catch (error) {
        console.log(error.message);
        res.render('user/500').send(500).json({ error: 'Internal Server Error' });
    }
};

const cartquantityupdation = async (req, res) => {
    try {
        const { product, count, proPrice } = req.body;
        // console.log(req.body);
        const userId = req.user.id;
        // console.log("User ID:", userId);
        // console.log("Product ID:", product);
        // console.log("Count:", count);
        // console.log("Product Price:", proPrice);
        const productqty = await Product.findOne({ _id: product }, { quantity: 1 })

        console.log("hey here got the productqty ",productqty);

        const updateQTY = await Cart.findOneAndUpdate(
            { userId: userId, 'products.productId': product },
            { $inc: { 'products.$.qty': count } },
        );
        console.log("here got the updateqty",updateQTY);

        const currentqty = await Cart.findOne(
            { userId: userId, 'products.productId': product },
            { 'products.$': 1 }
        );

        console.log("here got the currentqty ",currentqty);
        const qty = currentqty.products[0].qty;
        console.log("here got the qty ",qty);
        const singleproductprice = proPrice * qty;
        console.log("single productprice",singleproductprice);
        await Cart.updateOne(
            { userId: userId, 'products.productId': product },
            { $set: { 'products.$.productTotalprice': singleproductprice } }
        )
        const cart = await Cart.findOne({ userId: userId })
        console.log("bere got this cart",singleproductprice);
        // console.log("heyy here got this",productsArray);

        let sum = 0;
        for (let i = 0; i < cart.products.length; i++) {
            sum = sum + cart.products[i].productTotalprice;
        }
        console.log("here got the sum ", sum);

        const update = await Cart.findOneAndUpdate(
            { userId: userId },
            { $set: { cartTotalPrice: sum } }
        )
        console.log("here got the update", update);
        if (qty >= productqty.quantity) {
            console.log("hey here got this one");
            res.json({ response: false, message: 'Product out of stock.' });
        } else {
            res.json({ response: true, singleproductprice, sum });
        }
    } catch (error) {
        console.log(error);
        res.render('user/500');
    }
}


module.exports = {
    AddToCart,
    cartquantityupdation,
    ListCart,
    deleteCartProduct
}