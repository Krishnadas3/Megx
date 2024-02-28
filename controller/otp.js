// const bcrypt = require('bcrypt')

// const user = require('../models/users')
// const nodemailer = require('nodemailer')
// const twilio = require('twilio')

// let logingetotp = async(req,res) => {
//     try {
//         res.render('user/loginotphone')
//     } catch (error) {
//         console.error('failed to get login page',error)
//         res.status(500).send('intenal server error')
//     }
// }

// ENV details

// const accountSid = process.env.TWILIO_SID
// const authToken = process.env.TWILIO_TOKEN
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// const client = twilio(accountSid,authToken)

// const generateotp = () =>{
//     return Math.floor(100000 + Math.random() * 900000).toString()
// }

// requestion for otp after enterd phone

// const loginrequestsotp = async (req,res) =>{
//     const {phonenumber} = req.body
    
//     try {
//         const User = await user.findOne({phonenumber})

//         if(!User){
//             return res.status(404).json({message:'user not found'})
//         }

//         const otp = generateotp()
//         User.otp = otp
//         User.otpExpiration = new Date(Date.now()) + 10 *60 *1000 // otp in 10 minte
//         await User.save()

//         // send otp via Twilo Sms

//         try {
//             await client.messages.create({
//                 body:`your otp for login to Megx is: ${otp}`,
//                 from:twilioPhoneNumber,
//                 to: process.env.TO_NUMBER,
//             })
//             console.log('otp sms sent');
//         } catch (error) {
//             console.error('error sendingg otp smes',error)
//             return res.status(500).json({message:'error sending otp '})
//         }
//         res.render('user/loginotp',{phonenumber})

//     } catch (error) {
//         console.error('error requesing otp',error)
//         res.status(500).json({message:'server error'})
//     }
// }

// const loginverifyotp = async (req,res) =>{
//         const {phonenumber,otp} = req.body


// try {
//     const User = await user.findOne({phonenumber})

//     if(!User){
//         return res.status(404).json({message:'user not found'})
//     }

//     if(User.otp !== otp || Date.now() > user.otpExpiration)  {
//         return res.status(400).json({message:'invalid or expired OTP'})
//     }

    //clear OTP filed after succesful verification 

//     User.otp = undefined
//     User.otpExpiration = undefined
//     await User.save()

//     res.status(200).redirect('/')
//     console.log('user loging use otp');

// } catch (error) {
//     console.error('error verifying otp',error)
//     res.status(500).json({message:'server error'})
// }
// }

// module.exports = {
//     logingetotp,
//     loginrequestsotp,
//     loginverifyotp,
// }