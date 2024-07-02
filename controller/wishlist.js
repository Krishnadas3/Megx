const User = require('../models/users')
const Product = require('../models/product')

const loadwhislist = async (req, res) => {
    try {
        const isAuthenticated = req.cookies.jwt !== undefined;

        const userId = req.user.id;

        console.log("User ID:", userId);

        // Find the user by ID and populate the wishlist field
        const user = await User.findOne({ _id: userId }).populate('wishlist.product');
        
        console.log("User:", user);


        const wishlist = user.wishlist.filter(item => item.product);

        console.log('kittiii makkaleeeee',wishlist);

        res.render('user/whishlist', { wishlist, user,isAuthenticated });
    } catch (error) {
        console.error('Error:', error);
        res.render('user/500');
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
        res.render('user/500').send(500).json({ error: 'Internal Server Error' });
    }
}

const remove_from_wishlist = async (req, res) => {

    try {

        const product_id = req.body.productId

        const userId = req.user.id;

        const data = await User.updateOne({ _id: userId }, { $pull: { wishlist: { product: product_id } } })

        res.json({ success: true })


    } catch (error) {
                
        res.render('user/500');
        console.log(error.message); 

    }

}

const AddtoCart = async (req, res) => {

    try {

        const productId = req.body.productId

        console.log("hey here got the ",productId);
        
        const _id =await req.user.id

        console.log("hey here got the id",_id);
       
        let exist = await User.findOne({ _id: _id, 'cart.productId': productId })

        console.log("hery her exist : ",exist);

        if (exist) {
           
            res.json({exist:true})
           
        } else {
            const product = await Product.findOne({ _id: req.body.productId })
           
            const userData = await User.findOne({ _id })

            const result = await User.updateOne({ _id }, { $push: { cart: { productId: product._id, qty: 1, price: product.price, productTotalprice: product.price } } })
         
            if (result) {
                res.json({ success: true })
                // res.render('user/cartpage')/

            } else {
                console.log(' adding to cart is failed it didnt updated');
            }
        }
    } catch (error) {
        res.render('user/500');
        console.log(error.message); 
    }

}

module.exports = {
    addWishlist,
    loadwhislist,
    remove_from_wishlist,
    AddtoCart
}