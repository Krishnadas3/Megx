
const categorie = require('../models/category')

let categorieList = async (req, res) => {
    try {
        let category = await categorie.find()
        res.render('admin/categorielist',{category})
    } catch (error) {
        console.error('failed to get categorieist', error)
        res.render('user/500').send(500).send('internal server error')
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
        res.render('user/500').send(500).send('Internal server error');
    }
};


let deleteCategory = async (req,res) => {
    let categoryId = req.params.id;
    try {
        let category = await categorie.findById(categoryId); 
        if (!category) {
            return res.render('user/500').send(400).send('Category Not Found');
        }

        await category.deleteOne(); 
        res.redirect('/admin/categorielist');
    } catch (error) {
        console.error(error);
        res.render('user/500').send(500).send('Internal Server Error');
    }
}


let editCategory = async (req, res) => {
    let categoryId = req.params.id;
    console.log('categoryId : ', categoryId);
    try {
        // Find the category by ID
        let category = await categorie.findById(categoryId);
        if (!category) {
            return res.render('user/500').send(404).send('Category not found');
        }
        res.render('admin/categoriesedit', { category });
    } catch (error) {
        console.error('Failed to fetch category', error);
        res.render('user/500').send(500).send('Internal Server Error');
    }
};

const submitEditCategory = async (req, res) => {
    const categoryId = req.params.id;
    const { categoryName } = req.body;
    console.log("categoryId: ", categoryId);
    console.log("categoryName: ", categoryName);
    try {
        // Find the category by ID
        const category = await categorie.findById(categoryId);
        if (!category) {
            return res.render('user/500').send(404).send('Category not found');
        }
        // Update category name
        category.categoryName = categoryName;
        // Save the updated category
        await category.save();
        res.redirect('/admin/categorielist');
    } catch (error) {
        console.error('Failed to update category', error);
        res.render('user/500').send(500).send('Internal Server Error');
    }
};















// subcategory management

let subCategoryList = async (req,res) => {
    let admin = await categorie.find();
    if(!admin){
        res.render('user/500').send(400).send('Admin Not Found')
    }
    let subCategory = admin[0].subCategory.map(item => item);
    res.render('admin/subCategoryList',{subCategory})
}


let addSubCategory = (req, res) => {
    res.render('admin/subCategory-add');
};

let submitAddSubCategory = async (req, res) => {
    try {
        const { subCategoryName } = req.body;
        if (!subCategoryName) {
            return res.render('user/500').send(400).send('Subcategory name is required');
        }
        let admin = await categorie.findOne();
        if (!admin) {
            return res.render('user/500').send(404).send('Admin category not found');
        }
        admin.subCategory.push({ subCategoryName });
        await admin.save();
        res.redirect('/admin/subcategories');
    } catch (error) {
        console.error('Failed to add subcategory', error);
        res.render('user/500').send(500).send('Internal Server Error');
    }
};

let deleteSubCategory = async (req,res) => {
    let subCategoryId = req.params.id;
    try {
        let admin = await categorie.findOne();
        if(!admin){
            res.render('user/500').send(400).send('Admin Not Found')
        }
        admin.subCategory = admin.subCategory.filter(sub => sub.id != subCategoryId)
        admin.save()
        res.redirect('/admin/subcategories');
    } catch (error) {
        console.log(error);
        res.render('user/500').send(500).send('Internal Server Error')
    }
}


let editSubCategory = async(req,res) =>{

    let subCategoryId = req.params.id
    console.log("subCategoryId : ",subCategoryId);
    try {
        let admin = await categorie.findOne()
        if(!admin){
            res.render('user/500').send(400).send('admin not found')
        }
        let subCategory = admin.subCategory.find(cat => cat.id == subCategoryId)

        if(!admin){
            res.render('user/500').send(400).send('admi not found')
        }
    } catch (error) {
        console.log(error);
        res.render('user/500').send(500).send('Internal Server Error')
    }
    res.render('admin/subCategory-edit')
}

let submitEditSubCategory = async (req,res) => {
    let subCategoryId = req.params.id;
    console.log("subCategoryId  : ",subCategoryId);
    let {subCategoryName} = req.body;
    try {
        let admin = await categorie.findOne();
        if(!admin){
            res.render('user/500').send(400).send('Admin Not Found')
        }
        let subCategoryInd = await admin.subCategory.findIndex(cat => cat.id == subCategoryId);
        console.log("subCategoryInd : ",subCategoryInd);
        if(subCategoryInd == -1){
            res.render('user/500').send(400).send('Category Not Found')
        }else{
            admin.subCategory[subCategoryInd].subCategoryName = subCategoryName ; 
            await admin.save()
            res.redirect('/admin/subcategories');
        }
    } catch (error) {
        res.render('user/500').send(500).send('Internal Server Error')
    }
}














module.exports = {
    categorieList, 
    addCategory,
    submitAddCategory,
    deleteCategory,
    editCategory,
    submitEditCategory,



    subCategoryList,
    addSubCategory,
    submitAddSubCategory,
    deleteSubCategory,
    editSubCategory ,
    submitEditSubCategory
}