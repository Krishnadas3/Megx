
const admin = require('../models/admin')

let logingetpage = (req,res) =>{
    try {
        res.render('admin/adminlogin')
    } catch (error) {
        console.error('failed to get home:',error)
        res.status(500).send('internal server error')
    }
}

// admin login here

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
                res.render('admin/dashboard')
            }else{
                console.log('Incorrect password:', req.body.password);
                res.render('admin/adminlogin',{error:'wrong password'})
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

// admin logout here 



// admin dashboard display 

let dashboardPage = (req, res) => {
    try {
      res.redirect("admin/dashboard")
    } catch (error) {
        console.error('failed to get home:',error)
        res.status(500).send('internal server error')
    }
  };

  // admin customerpage

  let customerspage = (req,res) =>{
        try {
            res.render('admin/customers')
        } catch (error) {
            console.error('failed to get home:',error)
            res.status(500).send('internal server error')
        }
  }

    // admin customerdetail

  let customerdetailpage = (req,res) =>{
    try {
        res.render('admin/customerdetail')
    } catch (error) {
        console.error('failed to get home:',error)
        res.status(500).send('internal server error')
    }
}

module.exports = {
    logingetpage,
    loginPostpage,
    dashboardPage,
    customerspage,
    customerdetailpage
}