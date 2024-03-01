
const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        unique:true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    category:[{
        categoryName:{
            type:String,
        },
        createdAt:{
            type:Date,
            default:Date.now
        }
    }],
    subcategory: [{subcategoryName: String}]
    
})

module.exports = mongoose.model('admin',adminSchema)