const User = require("../models/users")
const Product = require('../models/product')
const Category = require('../models/category')

const { default: mongoose } = require('mongoose');
// const { default: products } = require("razorpay/dist/types/products");

// const mongoose = require('mongoose');


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
                res.redirect('/')

            } else {

                console.log(' adding to cart is failed it didnt updated');

            }
        }
    } catch (error) {
        console.log(error.message);
        console.log('error from addto cart');
    }

};

const ListCart = async (req, res) => {
    try {

        const isAuthenticated = req.cookies.jwt !== undefined;

        const userId = req.user.id;
        // console.log("userId: ", userId);

        const temp = new mongoose.Types.ObjectId(userId); 
        // console.log("hey here got temp: ", temp);

       
        const usercart = await User.aggregate([
            { $match: { _id: temp } },
            { $unwind: '$cart' },
            { $group: { _id: userId, totalcart: { $sum: '$cart.productTotalprice' } } }
        ]);

        // console.log('usercart: ', usercart);

        if (usercart.length > 0) {
            const cartTotal = usercart[0].totalcart;
            await User.updateOne({ _id: userId }, { $set: { cartTotalPrice: cartTotal } });

            const userData = await User.findOne({ _id: userId }).populate('cart.productId').exec();
            const user = true;
            res.render('user/cartpage', { userData, user,isAuthenticated });
        } else {
            const userData = await User.findOne({ _id: userId });
            const user = true;
            res.render('user/cartpage', { userData, user,isAuthenticated });
        }
    } catch (error) {
        console.log(error.message);
        console.log('error from list cart');
        res.status(500).render('500');
    }
}


const deleteCartProduct = async (req, res) => {

    try {
        console.log('hi');
        const userId = req.body.userId
        console.log(userId);
        const deleteProId = req.body.deleteProId
        console.log(deleteProId);

        const userData = await User.findByIdAndUpdate({ _id: userId }, { $pull: { cart: { productId: deleteProId } } })

        console.log(userData);
        if (userData) {

            res.json({ success: true })
            res.redirect('/cartpage')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const cartquantityupdation = async (req, res) => {
  try {
      const { user, product, count, Quantity, proPrice } = req.body;

      console.log("hey here got the ",user,product,count,Quantity,proPrice);

    //   const  producttemp = new type( mongoose.Types.ObjectId(product));
    //   const usertemp = new type( mongoose.Types.ObjectId(user)); 

      const productqty = await Product.findOne({ _id: product }, { quantity: 1 });
      console.log("hey got productqty : ",productqty);
      const requestedQty = Quantity + count;

      const updateQTY = await User.findOneAndUpdate(
          { _id: user, 'cart.productId': product },
          { $inc: { 'cart.$.qty': count } }
      );

      console.log("updateQty : ",updateQTY);

      const currentqty = await User.findOne(
          { _id: user, 'cart.productId': product },
          { _id: 0, 'cart.qty.$': 1 }
      );

      console.log("got the currentqty : ",currentqty);

      const qty = currentqty.cart[0].qty;

      if (qty > productqty.quantity) {
          await User.findOneAndUpdate(
              { _id: user, 'cart.productId': product },
              { $inc: { 'cart.$.qty': -count } }
          );

          return res.json({ response: false, message: 'Product out of stock.' });
      }

      const singleproductprice = proPrice * qty;

      await User.updateOne(
          { _id: user, 'cart.productId': product },
          { $set: { 'cart.$.productTotalprice': singleproductprice } }
      );

      const cart = await User.findOne({ _id: user });

      let sum = 0;
      for (let i = 0; i < cart.cart.length; i++) {
          sum += cart.cart[i].productTotalprice;
      }

      await User.findOneAndUpdate(
          { _id: user },
          { $set: { cartTotalPrice: sum } }
      );

      res.json({ response: true, singleproductprice, sum });
  } catch (error) {
      console.log(error.message);
      res.render('500');
  }
};




module.exports = {
    AddtoCart,
    ListCart,
    deleteCartProduct,
    cartquantityupdation
};

