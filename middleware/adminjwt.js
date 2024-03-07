
const jwt = require("jsonwebtoken");2
require("dotenv").config();

const adminAuth = (req, res, next) => {
    const token = req.cookies.admin_jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                res.redirect('/adminlogin');
            } else {
                req.user = decodedToken;
                next();
            }
        });
    } else {
        res.redirect("/adminlogin");
    }
};

module.exports = adminAuth;