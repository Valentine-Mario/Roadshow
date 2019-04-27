

exports.addGoogleUser=(req, res)=>{
    console.log(req.user._id)
    res.send(req.user)
}