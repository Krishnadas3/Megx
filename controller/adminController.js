const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const admin = require('../models/admin')

let adminlogin = (req,res) =>{
    try {
        res.render('admin/adminlogin')
    } catch (error) {
        console.error('failed to get home:',error)
        res.status(500).send('internal server error')
    }
}

const loginPostpage = async(req,res) =>{
    try {
        const foundUser = await admin.findOne({email:req.body.email})
        console.log(foundUser);

        if(foundUser){
            // const passwordMatch = await bcrypt.compare(req.body.password, foundUser.password)

            if(req.body.password === foundUser.password){
                
                req.session.user= {
                    id:foundUser._id,
                    email:foundUser.email
                }
                res.render('admin/home')
            }else{
                console.log('Incorrect password:', req.body.password);
                res.render('user/login',{error:'wrong password'})
            }
        }else{
            console.log('User not found:', req.body.email);
            res.render('admin/adminlogin',{error:'user not found'})
        }
    } catch (error) {
        console.error('Internal server error:', error);
        res.render('admin/adminlogin',{error:'internal server error'})
    }
}





// verifylogin





module.exports = {
    adminlogin,
    loginPostpage
}