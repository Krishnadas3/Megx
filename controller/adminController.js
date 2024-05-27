
const admin = require('../models/admin')
const user = require('../models/users')
const adminAuth = require('../middleware/adminjwt')
const jwt = require('jsonwebtoken')


let dashboardpage =(req,res) => {
    try {
        console.log("req.user : ",req.user);
        res.status(200).render('admin/index')
    } catch (error) {
        console.log(error);
        res.status(404).send("not found")
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
        res.status(500).send('internal server error')
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
        res.status(500).send("Internal Server Error");
    }
  };
  


// 
//User Management

let customerslist = async (req, res) => {
    try {
      let User = await user.find();
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
        res.status(500).send('error on admin changing user status')
    }
}


module.exports = {
    dashboardpage,
    logingetpage,
    loginPostpage,


    // categorieList,
    // addCategory,
    // submitAddCategory,
    // editCategory,
    // submitEditCategory,
    // deleteCategory,

    // subCategoryList,
    // deleteSubCategory,
    // submitEditSubCategory,
    // editSubCategory,
    // submitAddSubCategory,
    // addSubCategory,
    // subCategoryList,

    blockUser,
    customerslist,
    adminLogout
}