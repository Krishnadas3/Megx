
const express = require('express')
const mainrouter = express.Router()
const adminController = require('../controller/adminController')
const bodyParser = require('body-parser')
const adminRouter = require('./adminRoute')

mainrouter.use(bodyParser.urlencoded({extended:true}))

mainrouter.get('/admin',adminController.homepage)

module.exports = mainrouter