
const admin = require('../models/admin')
const user = require('../models/users')
const adminAuth = require('../middleware/adminjwt')
let Category = require('../models/category');
let Product = require('../models/product');

// const config = require('../config/')

// const bcrypt = require('bcrypt');

// reguire nodemailer
const nodemailer = require('nodemailer');
const Order = require('../models/orederModel');
const jwt = require('jsonwebtoken')


let  dashboardpage = async (req, res) => {

    try {
        // total sales
        const totalsales = await Order.find({ status: "Delivered" })
        let sum = 0
        for (let i = 0; i < totalsales.length; i++) {
            sum = sum + totalsales[i].total
        }
        const salescount = await Order.find({ status: "Delivered" }).count()


        const cod = await Order.find({ paymentType: "COD" , status: "Delivered"  })
        let cod_sum = 0
        for (var i = 0; i < cod.length; i++) {
            cod_sum = cod_sum + cod[i].total
        }
        console.log("hey hre got the ",cod_sum);

        const upi = await Order.find({ paymentType: "UPI" , status: "Delivered"  })

        let upi_sum = 0
        for (var i = 0; i < upi.length; i++) {
            upi_sum = upi_sum + upi[i].total
        }

        const wallet = await Order.find({ paymentType: "WALLET" , status: "Delivered" })

        let wallet_sum = 0
       
        for (var i = 0; i < wallet.length; i++) {
            wallet_sum = wallet_sum + wallet[i].total
        }

    
        const methodtotal = cod_sum + upi_sum + wallet_sum

        console.log("hey here got the methodtotal",methodtotal);

        const upi_percentage = upi_sum / methodtotal * 100
        const wallet_percentage = wallet_sum / methodtotal * 100
        const cod_percentage = cod_sum / methodtotal * 100

        console.log("hey here got the cod percenetage ",cod_percentage);

        const deliveryCount = await Order.find({ status: "Delivered" }).count()
        const confirmedCount = await Order.find({ status: "Confirmed" }).count()
        const cancelledCount = await Order.find({ status: "Cancelled" }).count()
        const returnedCount = await Order.find({ status: "Return" }).count()

    

        const salesChart = await Order.aggregate([
          
            {
                $match: { status: "Delivered" } // Add $match stage to filter by status
              },
              {
                
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },

                sales: { $sum: '$total' },
              },
            },
            {
              $sort: { _id: -1 },
            },
            {
              $limit: 7,
            },
          ]);
          

          const dates = salesChart.map((item) => {
            return item._id;
          })

          const sale = salesChart.map((item) => {
            return item.sales;
      });


      const salesr = sale.map((x)=>{
        return x
      })

      const date = dates.reverse()

      const sales = salesr.reverse()


        const User = await user.findOne({ _id: req.user.id })
        res.render('admin/index', {
            User,
            date , 
            sales ,
            catacount:"",
            deliveryCount,
            cancelledCount,
            returnedCount,
            confirmedCount,
            sum, cod_sum, upi_sum, wallet_sum,
            salescount,
            upi_percentage,
            cod_percentage,
            wallet_percentage

        })

    } catch (error) {
        console.error('failed to get home:', error)
        res.render('user/500').send('internal server error')
    }

}


const salesReport = async (req , res )=>{
    try {
        const User = await user.findOne({ _id: req.session.admin })
        const saleData = ""
      res.render("admin/sales-report", { User,saleData });
    } catch (error) {
        console.log(error);
    }
}

const home = async (req , res )=>{
    try {
        // const User = await user.findOne({ _id: req.session.admin })
        // const saleData = ""
      res.render("admin/indexx",);
    } catch (error) {
        console.log(error);
    }
}



const showSalesreport = async (req , res )=>{

    try {
        const User = await user.findOne({ _id: req.session.admin })
        const currentDate = new Date(req.body.from) 
        console.log("hey here got the currentdate ",currentDate);
        const newDate  = new Date(currentDate) 
        newDate.setDate(currentDate.getDate()+1)
        console.log(currentDate);
        console.log(newDate);
        if(req.body.from.trim()== '' || req.body.to.trim()==''){

        }else{
            const saleData = await Order.find({
                status: 'Delivered' , 
                date:{$gte: new Date(req.body.from),
                    $lte: new Date(req.body.to)}
            }).populate({path:'product',populate:{path:'productid',model:'Product'}})

            console.log(saleData);
            res.render('admin/sales-report',{saleData , User})
        }

    } catch (error) {
        res.render('505')
    }
}

let logingetpage = (req, res) => {
    try {
    if(req.cookies.admin_jwt){
      return  res.redirect('/admin/dashboard')
    }
    res.render('admin/adminlogin')
    } catch (error) {
        console.error('failed to get home:', error)
        res.render('user/500').send(500).send('internal server error')
    }
}

// admin login here

const loginPostpage = async (req, res) => {
    try {
        const foundUser = await admin.findOne({ email: req.body.email })
        console.log(foundUser);

        if (foundUser) {
            // const passwordMatch = await bcrypt.compare(req.body.password, foundUser.password)

            if (req.body.password === foundUser.password) {

                // req.session.user = {
                //     id: foundUser._id,
                //     email: foundUser.email
                // }

                const token = jwt.sign({
                    id: foundUser._id,
                    // name: foundUser.Adminame,
                    email: foundUser.email,
                },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "24h",
                    });

                res.cookie("admin_jwt", token, { httpOnly: true, maxAge: 86400000 }); // 24-hour expiry
                console.log('admin logged in successfully. Token created.');
                // res.redirect('/admin/index');

                res.redirect('/admin/dashboard')
            } else {
                console.log('Incorrect password:', req.body.password);
                res.render('admin/adminlogin', { error: 'wrong password' })
            }
        } else {
            console.log('User not found:', req.body.email);
            res.render('admin/adminlogin', { error: 'user not found' })
        }
    } catch (error) {
        console.error('Internal server error:', error);
        res.render('admin/adminlogin', { error: 'internal server error' })
    }
}


// 


let adminLogout = (req, res) => {
    try {
        res.clearCookie("admin_jwt");
        res.redirect("/adminlogin");
        console.log("admin logged out");
        return;
    } catch (error) {
        console.error("Error logging out:", error);
        res.render('user/500').send(500).send("Internal Server Error");
    }
  };
  


// 
//User Management

let customerslist = async (req, res) => {
    try {
      let User = await user.find();
      console.log("hey here got the user is",User);
      res.render("admin/customerslist", { User });
    } catch (error) {
      console.log(error);
    }
  };


let blockUser = async (req, res) => {
    let email = req.body.email

    try {
        const User = await user.findOne({ email })
        console.log(User);
        if (User) {
            console.log('"user');
            User.blocked = !User.blocked
            await User.save()
        }
        res.redirect('/admin/customerslist')
    } catch (error) {
        res.render('user/500').send(500).send('error on admin changing user status')
    }
}

const adminhome = async (req , res )=>{
    try {
        // const User = await user.findOne({ _id: req.session.admin })
        // const saleData = ""
      res.render("vendor/home",);
    } catch (error) {
        console.log(error);
    }
}

const banner = async (req,res) =>{
    try {
        res.render("vendor/add-banner")
    } catch (error) {
        console.log(error);
    }
}

// const banner = async (req,res) =>{
//     try {
//         res.render("vendor/add-banner")
//     } catch (error) {
//         console.log(error);
//     }
// }


module.exports = {
    dashboardpage,
    logingetpage,
    loginPostpage,
    blockUser,
    customerslist,
    adminLogout,
    salesReport,
    showSalesreport,
    home,
    adminhome,

}