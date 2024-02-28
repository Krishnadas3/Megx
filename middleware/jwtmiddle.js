const jwt = require('jsonwebtoken')
const {isBlacklist} = require('../controller/userController')

const verifytoken = (req,res,next) =>{
    const token = req.cookies.jwt

    if(isBlacklist(token)){
        return res.redirect('/login')
    }

    if(!token){
        return res.redirect('/login')
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_KEY)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(403).redirect('/login')
    }
}

module.exports = verifytoken