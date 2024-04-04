const User = require('../models/users')
const Product = require('../models/product')

const loadwhislist = async (req, res) => {
    try {
        const userId = req.user.id;

        console.log("User ID:", userId);

        // Find the user by ID and populate the wishlist field
        const user = await User.findOne({ _id: userId }).populate('wishlist.product');

        console.log("User:", user);

        const wishlist = user.wishlist;

        console.log('kittiii makkaleeeee',wishlist);

        res.render('user/whishlist', { wishlist, user });
    } catch (error) {
        console.error('Error:', error);
        res.render('500');
    }
};

const addWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        proid = req.body.productId

        console.log('User ID:', userId);
        console.log('Product ID:', proid);

        const data = await User.findOne({ _id: userId, "wishlist.product": proid });

        console.log("Data found:", data); 
        if (data) {
            res.json({ exist: true });
        } else {
            await User.updateOne({ _id: userId }, { $push: { wishlist: { product: proid } } });
            res.json({ success: true });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const remove_from_wishlist = async (req, res) => {

    try {

        const product_id = req.body.productId

        const userId = req.user.id;

        const data = await User.updateOne({ _id: userId }, { $pull: { wishlist: { product: product_id } } })

        res.json({ success: true })


    } catch (error) {
                
        res.render('500');
        console.log(error.message); 

    }

}

const add_to_cart = async (req, res) => {

    try {

        const product_id = req.body.productId

        const userId = req.user.id;

        const data = await User.updateOne({ _id: userId }, { $push: { cart: { product: product_id } } })


        res.json({ success: true })

    } catch (error) {

        c        
        res.render('500');
        console.log(error.message); 


    }

}

module.exports = {
    addWishlist,
    loadwhislist,
    remove_from_wishlist,
    add_to_cart
}