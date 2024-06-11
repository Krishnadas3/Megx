const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({

    Image: {
        type: String,

    },
    caption:{
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    sub_title: {
        type: String,
        required: true
    }

})
const Banner = mongoose.model('Banner', bannerSchema);
module.exports = Banner