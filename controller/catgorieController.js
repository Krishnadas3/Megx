
const categorie = require('../models/category')

let categorieList = async (req, res) => {
    try {
        let category = await categorie.find()
        // if(!Admin){
        //     res.status(400).send('admin not found')
        // } 
        // let category = Admin[0].category.map(category => category)
        res.render('admin/categorielist',{category})
    } catch (error) {
        console.error('failed to get categorieist', error)
        res.status(500).send('internal server error')
    }
}

let addCategory = (req,res) => {
    res.render('admin/categoriesadd');
}

let submitAddCategory = async (req,res) => {
    let {categoryName} =req.body;
    console.log(categoryName);
    let Categorie = await categorie.findOne();
    console.log(Categorie);
    if(!Categorie){
        res.status(400).send('Admin not found')
    }
    Categorie.category.push({ categoryName });
   await categorie.create();
    res.redirect('/admin/categorielist')
}

module.exports = {
    categorieList,
    addCategory,
    submitAddCategory
}