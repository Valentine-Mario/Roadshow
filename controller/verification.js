exports.verifyToken= (req, res, next)=>{
    const bearerHeader= req.headers['authorization']
    if(typeof(bearerHeader)!=="undefined"){
        var bearer= bearerHeader.split(' ')
        var token=bearer[1]
        req.token= token
        next()
    }else{
        res.json({code:"02", message:"unauthorised to access this route"})
    }
}