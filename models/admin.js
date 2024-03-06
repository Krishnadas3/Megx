
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
    // category:[{
    //     categoryName:{
    //         type:String,
    //     },
    //     createdAt:{
    //         type:Date,
    //         default:Date.now
    //     }
    // }],
    // subCategory:[{
    //     subCategoryName:{
    //         type:String,
    //         required:true
    //     },
    //     createdAt:{
    //         type:Date,
    //         default:Date.now
    //     }
    // }]
    
})

module.exports = mongoose.model('admin',adminSchema)