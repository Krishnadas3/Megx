

let homepage = (req,res) =>{
    try {
        res.render('admin/adminhome')
    } catch (error) {
        console.error('failed to get home:',error)
        res.status(500).send('internal server error')
    }
}

module.exports = {
    homepage
}