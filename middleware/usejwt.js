
const jwt = require("jsonwebtoken");2
require("dotenv").config();

const userAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                res.redirect('/login');
            } else {
                req.user = decodedToken;
                next();
            }
        });
    } else {
        res.redirect("/login");
    }
};

module.exports = userAuth;
