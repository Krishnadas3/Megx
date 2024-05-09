const user = require('../models/users');
// const authenticateUser = require('../middleware/authMiddleware');
// const Address = require('../models/addressModel');


const add_address = async (req, res) => {
    console.log("heyee");
    try {
        const userId = req.user.id;
        // console.log("hey here got the ",userId);
        if(req.body.name.trim()!= "" && req.body.number.trim() !="" && 
        req.body.pincode.trim() !="" &&  req.body.state.trim() !="" && 
        req.body.place.trim() !=""   &&  req.body.street.trim() !=""  
        ){
            const address = await user.updateOne({ _id: userId }, {
                $push: {
                    address: {
                        name: req.body.name,
                        number: req.body.number,
                        pincode: req.body.pincode,
                        state: req.body.state,
                        place: req.body.place,
                        street: req.body.street,
                        building: req.body.building,
                        district: req.body.district,
                    }
                }
            })
        //     console.log('Product already exists in the cart');
        // return res.json({ status: false });
        }
        res.redirect('/myaccount');
    } catch (error) {
        console.error(error);
        res.status(500).render('500');
    }
}


// const addresspage = async (req, res) => {
//     try {
//         const isAuthenticated = req.cookies.jwt !== undefined;
//         const userId = req.user.id;
        
//         const userData = await user.findOne({ _id: userId });
//         // console.log("here didnt get the ",userData);
//         res.render('user/address', { isAuthenticated, userData });

//     } catch (error) {
//         console.error('Failed to get login page', error);
//         // res.status(500).send('Internal server error');
//     }
// };


const showAddress = async (req, res) => {
    try {
        const isAuthenticated = req.cookies.jwt !== undefined;
        const id = req.user.id;
        // const id = req.session.user._id
        const User = await user.find({ _id: id })
        // const User = await user.findOne({ _id: id });

        if (!User) {
            return res.render('500');
        }

        res.render('user/address', { User, isAuthenticated });
    } catch (error) {
        console.error(error);
        res.render('500');
    }
}


const edit_address = async (req, res) => {
    try {
        const id = req.user.id;
        const address_id = req.body.id;
        console.log("here got the address ", address_id);
        const name = req.body.name;
        const number = req.body.number;
        const pincode = req.body.pincode;
        const state = req.body.state;
        const place = req.body.place;
        const street = req.body.street;
        const district = req.body.district;
        const building = req.body.building;

        if (req.body.name.trim() !== "" && req.body.number.trim() !== "" &&
            req.body.pincode.trim() !== "" && req.body.state.trim() !== "" &&
            req.body.place.trim() !== "" && req.body.street.trim() !== ""
        ) {
            await user.updateOne({ _id: id, 'address._id': address_id }, {
                $set:
                {
                    "address.$.name": name,
                    "address.$.number": number,
                    "address.$.pincode": pincode,
                    "address.$.state": state,
                    "address.$.place": place,
                    "address.$.district": district,
                    "address.$.building": building,
                    "address.$.street": street
                },
            });
            res.json({ success: true });
        } else {
            res.json({ success: false, message: "Invalid input" });
        }
    } catch (error) {
        res.render('500');
        console.log(error.message);
    }
}


const deleteAddress = async (req, res) => {

    try {


        const id = req.user.id
        const address = req.body.address
        const data = await user.updateOne({ _id: id }, { $pull: { address: { _id: address } } })

        res.json({ success: true })

    } catch (error) {
        res.render('500');
        console.log(error.message);
    }
}


const myaccountgetpage = async (req, res) => {
    try {
        const isAuthenticated = req.cookies.jwt !== undefined;
        const userId = req.user.id;
        
        const userData = await user.findOne({ _id: userId });
        // console.log("here didnt get the ",userData);
        res.render('user/myaccount', { isAuthenticated, userData });

    } catch (error) {
        console.error('Failed to get login page', error);
        // res.status(500).send('Internal server error');
    }
};



module.exports = {
    myaccountgetpage,
    add_address,
    showAddress,
    edit_address,
    deleteAddress
}