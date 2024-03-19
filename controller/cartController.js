const User = require('../models/users'); // Assuming you have a User model
const Product = require('../models/product');


require('dotenv').config()



let cartpagelist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.productId');

        res.render('user/cartpage',{ user })
    } catch (error) {
        console.error('failed to get login page', error)
        res.status(500).send('intenal server error')
    }
}

const AddToCart = async (req, res) => {

    try {
    
        const productId = req.body.productId  

        const id = req.user.id
     
        let exist = await User.findOne({ _id: id, 'cart.productId': productId })

        
        if (exist) {
            console.log('inside addtocart');  
            res.send(false)
           
        } else {

            console.log('adding');

            const product = await Product.findOne({ _id: req.body.productId })

            const result = await User.updateOne({ _id:id }, { $push: { cart: { productId: product._id, qty: 1, price: product.price, productTotalprice: product.price } } })

            if (result) {

                res.json({ status: true })

                res.redirect('/userhome')

            } else {

                console.log(' adding to cart is failed it didnt updated')

            }
        }
    } catch (error) {
        console.log(error.message);
    }
};



module.exports ={
  cartpagelist,
  AddToCart
}