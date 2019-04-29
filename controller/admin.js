var adminModel=require('../models/user');
const jwt=require('jsonwebtoken');
require('dotenv').config()

exports.getAllUsers=(req, res)=>{
    var {page, limit}= req.query;
    var options={
        page:parseInt(page, 10) || 1,
        limit:parseInt(limit, 10) || 10
}
    try{
    jwt.verify(req.token, "golden_little_kids", (err, decoded_value)=>{
        adminModel.findById(decoded_value.user, (err, admin)=>{
            if(admin.access < 1){
                res.json({code:"01", message:"only admin authorised to view this route"})
            }else{
                adminModel.paginate({}, options, (err, value)=>{
                    if(err)res.json({code:"01", err:err, message:"error geting list of users"})
                    res.json({code:"00", message:value})
                })
            }
        })
    })
    }catch(e){
        console.log(e)
    }
}

exports.getUserId=(req, res)=>{
    var id={_id:req.params.id}
    try{
        jwt.verify(req.token, "golden_little_kids", (err, decoded_value)=>{
            adminModel.findById(decoded_value.user, (err, admin)=>{
                if(admin.access <1){
                    res.json({code:"01", message:"only admin authorised to view this route"})
                }else{
                    adminModel.findById(id, (err, user_details)=>{
                        if(err)res.json({code:"01", err:err, message:"error getting user details"})
                        res.json({code:"00", message:user_details})
                    })
                }
            })
        })
    }catch(e){
        console.log(e)
    }
}