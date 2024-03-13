
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

let submitAddCategory = async (req, res) => {
    let { categoryName } = req.body;
    try {
        let newCategory = await categorie.create({ categoryName });
        console.log(newCategory);
        res.redirect('/admin/categorielist');
    } catch (error) {
        console.error('Failed to add category', error);
        res.status(500).send('Internal server error');
    }
};


let deleteCategory = async (req,res) => {
    let categoryId = req.params.id;
    try {
        let category = await categorie.findById(categoryId); 
        if (!category) {
            return res.status(400).send('Category Not Found');
        }

        await category.deleteOne(); 
        res.redirect('/admin/categorielist');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}



module.exports = {
    categorieList,
    addCategory,
    submitAddCategory,
    deleteCategory
}