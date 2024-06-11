const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({

    coupon_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    min_amount :{
        type: Number
    },
    maxdiscountprice: {
        type: Number
    },
    discountpercentage: {
        type: Number
    },
    expiry_date: {
        type: Date
    },
    active:{
        type: Boolean,
        default : false
    },
    code: {
        type: String
    },
    used: {
        type: Array
    }

})
const Coupon = mongoose.model('Coupon', couponSchema)
module.exports = Coupon;