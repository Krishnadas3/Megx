let Banner = require('../models/banner');
let User = require('../models/users')



const show_banner = async (req, res) => {

    try {
        // const user = req.session.admin
        res.render('admin/add-banner',)

    } catch (error) {
        res.render('505')
    }
}

const show_banner_list = async (req, res) => {

    try {
        const user = await User.findOne({ _id: req.session.admin })
        const bannerData = await Banner.find()
        res.render('admin/list-banner',{user,bannerData})

    } catch (error) {
        res.render('505')
    }
}

const add_banner = async (req, res) => {

    try {
        const user = req.session.admin
        const title = req.body.title
        console.log("hey here got the title ",title);
        const image = req.file.filename
        console.log("hey here got the image ",image);
        const sub_title = req.body.sub_title
        const caption = req.body.caption

        if (image !== "" && sub_title.trim() !== "" && title.trim() !== "" ) {
            const banner = new Banner({
                title: title,
                Image: image,
                sub_title: sub_title,
                caption : caption
 
            })
            console.log("hello sweety ",banner);

            const bannerData = await banner.save();
            if (bannerData) {
                res.render('admin/add-banner', { user })
            }
        } else {
            res.render('admin/add-banner', { message: "fill your form", user })
        }


    } catch (error) {

        res.render('505')

    }
}

const delete_banner = async (req, res) => {

    try {
        const banner_id = req.body.banner
        const data = await Banner.deleteOne({ _id: banner_id })

        res.json({ success: true })

    } catch (error) {
        res.render('505')
    }


}

const edit_banner = async (req , res )=>{
    try {
        const id = req.body.id
        const caption = req.body.caption
        const title = req.body.title
        const sub_title = req.body.sub_title

        const upadate = await Banner.updateOne({_id : id },{
            $set:{
                caption: caption,
                title : title,
                sub_title : sub_title
            }
        })
        console.log("here get the update",upadate);
        res.json({ success:true })
    } catch (error) {
        res.render('505')
    }
}

module.exports = {
    show_banner,
    add_banner,
    show_banner_list,
    delete_banner,
    edit_banner
}