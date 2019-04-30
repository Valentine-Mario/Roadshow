const userModel=require('../models/user')
const jwt=require('jsonwebtoken')


exports.addBooking=(req, res)=>{
    var data={
        date:req.body.date,
        description:req.body.description,
        price:req.body.price
    }
    try{
        jwt.verify(req.token, "golden_little_kids", (err, decoded_user)=>{
            userModel.findById(decoded_user.user, (err, user)=>{
                if(user.verified==false){
                    res.json({code:"01", message:"please verify account before you add bookings"})
                }else{
                   user.activity.push(data)
                   user.save()
                   res.json({code:"00", message:"bookings added successfully"})
                }
            })
        })
    }catch(e){
        console.log(e)
    }
}

exports.removeBooking=(req, res)=>{
    var index=req.body.index
    try{
        jwt.verify(req.token, "golden_little_kids", (err, decoded_user)=>{
            userModel.findById(decoded_user.user, (err, user)=>{
                if(err){
                    res.json({code:"01", err:err, message:"error getting user information"})
                }else{
                    var num=parseInt(index)
                    user.activity.splice(num, 1)
                    user.save();
                    res.json({code:"01", message:"booking removed successfully"})
                }
            })
        })
    }catch(e){
        console.log(e)
    }
}