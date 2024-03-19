
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

// subcategory management

// let subCategoryList = async (req,res) => {
//     let Admin = await admin.find()
//     if(!Admin){
//         res.status(400).send('Admin Not Found')
//     }
//     let subCategory = Admin[0].subCategory.map(item => item);
//     res.render('admin/subCategoryList',{subCategory})
// }

// let addSubCategory = (req,res) => {
//     res.render('admin/subCategory-add')
// }

// let submitAddSubCategory = async (req,res) => {
//     let {subCategoryName} = req.body;
//     console.log(subCategoryName)
//     let Admin = await admin.findOne();
//     if(!Admin){
//         res.status(400).send('Admin Not Found')
//     }
//     Admin.subCategory.push({subCategoryName});
//     await Admin.save();
//     res.redirect('/admin/subCategories');
// }    


// let submitAddCategory = async (req,res) => {
//     let {categoryName} =req.body;
//     console.log(categoryName);
//     let Admin = await admin.findOne();
//     if(!Admin){
//         res.status(400).send('Admin not found')
//     }
//     Admin.category.push({categoryName});
//    await Admin.save();
//     res.redirect('/admin/categorielist')
// }

// let editSubCategory = async (req,res) => {
//     let subCategoryId = req.params.id;
//     console.log('subCategoryId : ',subCategoryId);
//     try {
//         let Admin = await admin.findOne();
//         if(!Admin){
//             res.status(400).send('Admin Not Found')
//         }
//         let subCategory = Admin.subCategory.find(cat => cat.id == subCategoryId);
//         console.log(subCategory);
//         if(!subCategory){
//             res.status(400).send('subCategory Not Found')
//         }
//         res.render('admin/subCategory-edit',{subCategory});
//     } catch (error) {
//         res.status(500).send('Internal Server Error')
//     }
// }
// let submitEditSubCategory = async (req,res) => {
//     let subCategoryId = req.params.id;
//     console.log("subCategoryId  : ",subCategoryId);
//     let {subCategoryName} = req.body;
//     try {
//         let Admin = await admin.findOne();
//         if(!Admin){
//             res.status(400).send('Admin Not Found')
//         }
//         let subCategoryInd = await Admin.subCategory.findIndex(cat => cat.id == subCategoryId);
//         console.log("subCategoryInd : ",subCategoryInd);
//         if(subCategoryInd == -1){
//             res.status(400).send('Category Not Found')
//         }else{
//             Admin.subCategory[subCategoryInd].subCategoryName = subCategoryName ; 
//             // if i add more things to edit in category i can change it here...
//             await Admin.save()
//             res.redirect('/subCategories');
//         }
//     } catch (error) {
//         res.status(500).send('Internal Server Error')
//     }
// }

// let deleteSubCategory = async (req,res) => {
//     let subCategoryId = req.params.id;
//     try {
//         let Admin = await admin.findOne();
//         if(!Admin){
//             res.status(400).send('Admin Not Found')
//         }
//         Admin.subCategory = Admin.subCategory.filter(sub => sub.id != subCategoryId)
//         Admin.save()
//         res.redirect('/subCategories');
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Internal Server Error')
//     }
// }




module.exports = {
    categorieList,
    addCategory,
    submitAddCategory,
    deleteCategory
}