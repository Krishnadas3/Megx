
const admin = require('../models/admin')
const user = require('../models/users')


let dashboardpage = async (req,res) => {
    try {
        res.status(200).render('admin/index')
    } catch (error) {
        console.log(error);
        res.status(404).send("not found")
    }
}

let logingetpage = (req, res) => {
    try {
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

                req.session.user = {
                    id: foundUser._id,
                    email: foundUser.email
                }
                res.render('admin/index')
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


//  categorie management

let categorieList = async (req, res) => {
    try {
        let Admin = await admin.find()
        if(!Admin){
            res.status(400).send('admin not found')
        } 
        let category = Admin[0].category.map(category => category)
        res.render('admin/categorielist',{category})
    } catch (error) {
        console.error('failed to get categorieist', error)
        res.status(500).send('internal server error')
    }
}

//add category post page 

let addCategory = (req,res) => {
    res.render('admin/categoriesadd');
}


let submitAddCategory = async (req,res) => {
    let {categoryName} =req.body;
    console.log(categoryName);
    let Admin = await admin.findOne();
    if(!Admin){
        res.status(400).send('Admin not found')
    }
    Admin.category.push({categoryName});
   await Admin.save();
    res.redirect('/admin/categorielist')
}

// edit category here 

let editCategory = async (req,res) => {
    let categoryId = req.params.id;
    console.log('categoryId : ',categoryId);
    try {
        let Admin = await admin.findOne();
        if(!Admin){
            res.status(400).send('Admin Not Found')
        }
        let category = Admin.category.find(item => item.id == categoryId);
        console.log(category);
        if(!category){
            res.status(400).send('Category Not Found')
        }
        res.render('admin/categoriesedit', { category });

    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
}

let submitEditCategory = async (req,res) => {
    let categoryId = req.params.id;
    console.log("categoryId  : ",categoryId);
    let {categoryName} = req.body;
    console.log(categoryName)
    try {
        let Admin = await admin.findOne();
        if(!Admin){
            res.status(400).send('Admin Not Found')
        }
        let categoryInd = await Admin.category.findIndex(item => item.id == categoryId);
        console.log("categoryInd : ",categoryInd);
        if(categoryInd == -1){
            res.status(400).send('Category Not Found')
        }else{
            Admin.category[categoryInd].categoryName = categoryName ; 
            // if i add more things to edit in category i can change it here...
            await Admin.save()
            res.redirect('/admin/categorielist');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
}

// delete category 

let deleteCategory = async (req,res) => {
    let categoryId = req.params.id;
    try {
        let Admin = await admin.findOne();
        if(!admin){
            res.status(400).send('Admin Not Found')
        }
        Admin.category = Admin.category.filter(item => item.id != categoryId);
       await Admin.save();
        res.redirect('/admin/categorielist')
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server Error')
    }
}




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


    categorieList,
    addCategory,
    submitAddCategory,
    editCategory,
    submitEditCategory,
    deleteCategory,


    blockUser,
    customerslist
}