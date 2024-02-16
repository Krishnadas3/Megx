
let home = (req,res)=>
{
    res.render('index');
}
let shop = (req,res)=>{
    res.render('shop')
}
let about = (req,res)=>{
    res.render('about')
}
// let contact = (req,res)=>{
//     res.render('contact')
// }
let productdetail= (req,res)=>{
    res.render('productdetail')
}

let cartpage = (req,res)=>{
    res.render('cartpage')
}

let checkout = (req,res)=>{
    res.render('checkout')
}

let contact = (req,res)=>{
    res.render('contact')
}

let signup = (req,res)=>{
    res.render('signup')
}

let login = (req,res)=>{
    res.render('login')
}

module.exports = {home,shop,about,productdetail,cartpage,checkout,contact,signup,login}
 