const Category = require('../models/category');
const user = require('../models/users')

//  categorie management

let categorieList = async (req, res) => {
    try {
        let Admin = await Category.find()
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

// add category post page 

let addCategory = (req,res) => {
    res.render('admin/categoriesadd');
}


let submitAddCategory = async (req,res) => {
    let {categoryName} =req.body;
    console.log(categoryName);
    let Admin = await Category.findOne();
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
        let Admin = await Category.findOne();
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
        let Admin = await Category.findOne();
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
        let Admin = await Category.findOne();
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

module.exports = {
      categorieList,
    addCategory,
    submitAddCategory,
    editCategory,
    submitEditCategory,
    deleteCategory
}