const Product = require('../models/product');
const Cart = require('../models/cart')
const user = require('../models/users');
const Order = require('../models/orederModel')
const Category = require('../models/category')
let Coupon = require("../models/coupon");
const uuid = require("uuid");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { default: mongoose } = require('mongoose');
const { name } = require('ejs');
const { stat } = require('fs');
require("dotenv").config();


var instance = new Razorpay({

  key_id: process.env.KEY_ID,

  key_secret: process.env.KEY_SECRET,

});

let loadcheckout = async (req, res) => {
  // console.log("hey ividek vannu nammal ");
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
    res.render('user/500').send('intenal server error')
  }
}



const place_order = async (req, res) => {
  try {
    const id = req.user.id;

    const User = await user.findOne({ _id: id });

    const orderData = req.body;
    //   console.log('Received orderData:', orderData);/

    // Ensure all order data fields are arrays
    if (!Array.isArray(orderData.productId)) {
      orderData.productId = [orderData.productId];
    }
    if (!Array.isArray(orderData.qty)) {
      orderData.qty = [orderData.qty];
    }
    if (!Array.isArray(orderData.singleTotel)) {
      orderData.singleTotel = [orderData.singleTotel];
    }
    if (!Array.isArray(orderData.price)) {
      orderData.price = [orderData.price];
    }

    const productPush = [];

    for (let i = 0; i < orderData.productId.length; i++) {
      let productId = orderData.productId[i];
      let quantity = orderData.qty[i];
      let singleTotal = orderData.singleTotel[i];
      let price = orderData.price[i];

      productPush.push({
        productid: productId,
        qty: quantity,
        singlePrice: price,
        singleTotel: singleTotal
      });
    }

    let status;

    if (req.body.payment_method === "COD" || req.body.payment_method === "UPI") {
      status = "Confirmed";
    } else if (req.body.payment_method === "WALLET") {
      if (User.wallet < orderData.totel) {
        res.json({ wallet: false });
        return;
      }
      status = "Confirmed";
    }

    const index = req.body.user;

    //   console.log("hey here got the index", index);

    const address = {
      name: User.address[index].name,
      number: User.address[index].number,
      pincode: User.address[index].pincode,
      state: User.address[index].state,
      district: User.address[index].district,
      place: User.address[index].place,
      street: User.address[index].street,
      building: User.address[index].building,
    };

    const totel = req.body.total;

    const orderId = `Order#${uuid.v4()}`;
    //   console.log("Generated orderId:", orderId);

    const order = new Order({
      userId: req.user.id,
      address: address,
      product: productPush,
      total: totel,
      paymentType: req.body.payment_method,
      status: status,
      orderId: orderId,
    });

    const neworderData = await order.save();

    // console.log("hey  here got the neworderData",neworderData);

    if (req.body.payment_method == "COD") {
      res.json({ status: true });
    }


    else if (req.body.payment_method == "UPI") {
      let options = {
        amount: req.body.total * 100, // amount in paise
        currency: "INR",
        receipt: "" + neworderData._id,
      };

      // console.log("Creating Razorpay order with options:", options);

      instance.orders.create(options, (err, order) => {
        if (err) {
          console.error("Error creating Razorpay order:", err);
          return res.render('user/500').send(500).send("Internal server error");
        }
        res.json({ viewRazorpay: true, order });
      });

    } else if (req.body.payment_method == "WALLET") {
      const walupdate = User.wallet - orderData.total;
      await user.updateOne({ _id: id }, { $set: { wallet: walupdate } });
      res.json({ status: true });
    }

  } catch (error) {
    console.error('Failed to place order:', error);
    res.render('user/500').send(500).send('Internal server error');
  }
};


const verify_payment = async (req, res) => {
  try {

    const id = req.user.id;

    // console.log("hey here got the id ",id);

    const latestOrder = await Order.findOne().sort({ date: -1 });

    // console.log("hey here got the latestOrder ",latestOrder);

    const upadateOrder = await Order.updateOne(
      { orderId: latestOrder.orderId },
      { $set: { status: "Confirmed" } }
    );

    // console.log("ivide upadateoruder",upadateOrder);

    const details = req.body;

    // console.log("hey njn details",details);

    let hmac = crypto.createHmac("sha256", process.env.KEY_SECRET);
    // console.log("heey",hmac);
    hmac.update(
      details["payment[razorpay_order_id]"] +
      "|" +
      details["payment[razorpay_payment_id]"]
    );
    hmac = hmac.digest("hex");
    if (hmac == details["payment[razorpay_signature]"]) {
      res.json({ status: true });
    } else {
      res.json({ failed: true });
    }
  } catch (error) {

    res.render('user/500');
    console.log(error.message);

  }

};


let order_success = async (req, res) => {
  try {
    const isAuthenticated = req.cookies.jwt !== undefined;
    const User = req.user.id;

    const userdata = await user.findOne({ _id: User });

    await user.updateOne(
      { _id: User },
      { $set: { cart: [], cartTotal: 0 } }
    );

    const order = await Order.findOne()
      .sort({ date: -1 })
      .populate({ path: 'product', populate: { path: 'productid', model: 'Product' } });

    for (let i = 0; i < order.product.length; i++) {
      await Product.updateOne(
        { _id: order.product[i].productid },
        { $inc: { stockQuantity: -order.product[i].qty } }
      );
      // console.log("Updated stock quantity for product ID: ", order.product[i].productid);
    }

    res.render('user/order_success', { isAuthenticated, User, order, userdata });
  } catch (error) {
    console.error('Failed to process order:', error);
    res.render('user/500').send(500).send('Internal server error');
  }
};


const load_order = async (req, res) => {
  try {
    const order = await Order.find()
    let User = await user.find();
    res.render("admin/list-order", { order, User });
  } catch (error) {

    res.render('user/500');
    console.log(error.message);

  }
};


const cancel_order = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const userid = req.user.id

    const cancel = await Order.updateOne(
      { _id: orderId },
      { $set: { status: "Cancelled" } }
    );
    console.log("hey her got the cancel ", cancel);
    const orderdata = await Order.findOne({ _id: orderId });
    if (orderdata.paymentType == "UPI") {
      const refund = await user.updateOne(
        { _id: userid },
        { $inc: { wallet: orderdata.total } }
      );
    }

    if (cancel) {
      res.json({ success: true });
    }
  } catch (error) {
    res.render('user/500');
    console.log(error.message);
  }
};


const retrun_order = async (req, res) => {
  try {
    const order_id = req.body.orderId;
    const retrun_order = await Order.updateOne(
      { _id: order_id },
      { $set: { status: "Return Pending" } }
    );
    console.log("hey ivide kittum return order ", retrun_order);
    res.json({ success: true });
  } catch (error) {
    res.render('user/500');
    console.log(error.message);
  }
};

const confirm_return = async (req, res) => {
  try {
    const orderId = req.body.order_Id;

    const status = req.body.status;
    const order = await Order.find({ _id: orderId });
    const wallet = await user.updateOne({ _id: order[0].userId }, { $inc: { wallet: order[0].total } })
    const upate = await Order.updateOne(
      { _id: orderId },
      { $set: { status: status } }
    );
  } catch (error) {

    res.render('user/500');
    console.log(error.message);
  }
};


const show_orderlist = async (req, res) => {
  try {

    const isAuthenticated = req.cookies.jwt !== undefined;

    const id = req.user.id;

    const User = await user.findOne({ _id: id });

    const orders = await Order.find({ userId: User });

    // const category = await Category.find();

    res.render("user/list-orders", { isAuthenticated, User, orders });

  } catch (error) {
    res.render('user/500');
    console.log(error.message);

  }

};


const view_order_user = async (req, res) => {
  try {
    const isAuthenticated = req.cookies.jwt !== undefined;

    const user = true;
    const order_id = req.query.id;

    // const category = await Category.find();

    const order = await Order.find({ _id: order_id }).populate(

      "product.productid"

    );

    res.render("user/view-order", { isAuthenticated, order, user });

  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.render('user/500');
  }
};


const view_order_admin = async (req, res) => {
  try {

    const user = req.user.id;

    const order_id = req.query.id;

    console.log("ayyoo kitti order_id", order_id);

    const order = await Order.find({ _id: order_id }).populate(

      "product.productid"

    );

    console.log("hey here got the order ", order);

    const user_id = await Order.find()

    res.render("admin/view-order", { order, user_id, user });

  } catch (error) {

    res.render('user/500');
    console.log(error.message);

  }

};



// admin 

const updateStatus = async (req, res) => {
  try {
    const orderId = req.body.order_Id;

    console.log("hey here got the orderId", orderId);

    const status = req.body.status;

    console.log("hey here got thte status ", status);

    const update = await Order.updateOne(
      { _id: orderId },

      { $set: { status: status } }

    );

    console.log("nammuk kittan update", update);

    res.json({ success: true });
  } catch (error) {
    res.render('500');
    console.log(error.message);
  }
};


const load_coupon = async (req, res) => {

  try {

    const admin = req.session.admin;

    req.session.admin = admin;

    res.render("admin/add-coupon", { user: admin });

  } catch (error) {

    console.log(error.message);

  }

};



const add_coupon = async (req, res) => {

  try {

    const user = req.session.admin;

    const id = req.session.admin;

    const name = req.body.name;

    console.log("name ",name);

    const code = req.body.code;

    console.log("name ",code);

    const date = req.body.date;

    console.log("name ",date);

    const discountprice = req.body.discountprice;

    console.log("name ",discountprice);

    const discount_percentage = req.body.discount_percentage;

    console.log("name ",discount_percentage);

    const description = req.body.description;

    console.log("name ",description);

    const min_amount = req.body.min_amount;

    console.log("name ",min_amount);

    if (min_amount.trim() > 0 &&
      description.trim() !== "" &&
      discount_percentage > 0 &&
      discountprice > 0
      && code.trim() !== "" &&
      name.trim() !== "") {

      const coupon = new Coupon({

        coupon_name: req.body.name,

        description: req.body.description,

        code: req.body.code,

        expiry_date: req.body.date,

        discountpercentage: req.body.discount_percentage,

        maxdiscountprice: req.body.discountprice,

        min_amount: req.body.min_amount,

      });

      console.log("hey here got the coupon ",coupon);

      const data = await coupon.save();

      console.log("hey here got ",data);

      if (data) {

        res.render("admin/add-coupon", { user });

      }
    } else {

    }
  } catch (error) {

    console.log(error.message);

  }

};


const list_coupon = async (req, res) => {

  try {

    // const user = await user.findOne({ _id: req.session.admin });

    const coupon = await Coupon.find();

    res.render("admin/list-coupon", { coupon, });

  } catch (error) {

    console.log(error.message);

  }
};


const delete_coupon = async (req, res) => {

  try {

    const id = req.body.couponid;

    const coupon = await Coupon.deleteOne({ _id: id });

    res.json({ success: true });

  } catch (error) {

    console.log(error.message);

  }
};


const edit_coupon = async (req, res) => {

  try {

    const user = req.session.admin;

    const id = req.query.id;

    const coupon = await Coupon.find({ _id: id });

    res.render("admin/edit-coupon", { coupon, user });

  } catch (error) {

    console.log(error.message);

  }
};



const editing_coupon = async (req, res) => {

  try {

    const id = req.body.id;
    const name = req.body.name;
    const code = req.body.code;
    const date = req.body.date;
    const discountprice = req.body.discountprice;
    const min_amount = req.body.min_amount;
    const discount_percentage = req.body.discount_percentage;
    const description = req.body.description;
    const upadate = await Coupon.updateOne(
      { _id: id },
      {
        $set: {

          coupon_name: name,

          code: code,

          expiry_date: date,

          discountpercentage: discount_percentage,

          description: description,

          maxdiscountprice:  discountprice,
 
          min_amount: min_amount
        },
      }
    );
    res.redirect("/admin/list-coupon");
  } catch (error) {
    console.log(error.message);
  }

};

const coupon_active = async (req, res) => {
  try {
    const coupon_id = req.body.coupid
    const value = req.body.value
    const coupon = await Coupon.updateOne({ _id: coupon_id }, { $set: { active: value } })
    res.json({ success: true })
  } catch (error) {
    console.log(error.message);
  }
}


const apply_coupon = async (req, res) => {

  try {

    const id = req.user.id;
    
    console.log("hey here got the ",id);

    const code = req.body.couponcode;

    console.log("hey here got the couon code",code);

    const cartTotel = req.body.cartTotal;

    console.log("hey here got the couon code",cartTotel);

    const coupondata = await Coupon.findOne({ code: code });

    const userused = await Coupon.findOne({ code: code, used: { $in: [id] } })

    const currentdate = Date.now();

    if (coupondata) {

      if (userused) {


        res.json({ used: true });

      } else {

        if (currentdate <= coupondata.expiry_date) {

          if (coupondata.min_amount <= cartTotel) {

            let discountAmount =

              cartTotel * (coupondata.discountpercentage / 100);

              console.log("hey here got the ",discountAmount);


            if (discountAmount <= coupondata.maxdiscountprice) {

              let discount_value = discountAmount;

              let value = cartTotel - discount_value;

              console.log("hey here got the ",value);

              const coupon_apply = await user.updateOne(

                { _id: req.user.id },

                { $set: { cartTotel: value , discount : discountAmount  } }

              );

              const coupon_used = await Coupon.updateOne(

                { code: code },

                { $push: { used: req.user.id } }

              );


              res.json({ success: true, value, discount_value, code });

            } else {

              let discount_value = coupondata.maxdiscountprice;

              let value = cartTotel - discount_value;

              console.log("ente ammo ivide value kittum nokkiko ",value);

              const coupon_apply = await user.updateOne(

                { _id: req.user.id },

                { $set: { cartTotel: value , discount : discount_value } }

              );
              
              const coupon_used = await Coupon.updateOne(

                { code: code },

                { $push: { used: id } }

              );

              res.json({ success: true, value, discount_value, code });
              
            }

          } else {

            res.json({ lessamount: true });

          }

        } else {

          res.json({ expired: true });

        }

      }

    } else {

      res.json({ invalid: true });

    }

  } catch (error) {

    console.log(error.message);

  }
};


module.exports = {
  loadcheckout,
  order_success,
  place_order,
  cancel_order,
  verify_payment,
  show_orderlist,
  view_order_user,
  load_order,
  updateStatus,
  view_order_admin,
  retrun_order,
  confirm_return,
  load_coupon,
  add_coupon,
  list_coupon,
  delete_coupon,
  edit_coupon,
  editing_coupon,
  coupon_active,
  apply_coupon
}