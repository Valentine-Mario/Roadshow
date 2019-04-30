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

exports.editUser=(req, res)=>{
    var data={
        name:req.body.name,
        email:req.body.email,
    }
    var id={_id:req.params.id}
    try{
        jwt.verify(req.token, "golden_little_kids", (err, decoded_user)=>{
            adminModel.findById(decoded_user.user, (err, admin)=>{
                if(admin.access <1){
                    res.json({code:"01", message:"only admin authorised to view this route"})
                }else{
                    adminModel.findByIdAndUpdate(id, data, (err)=>{
                        if(err)res.json({code:"01", err:err, message:"error updating user"})
                        res.json({code:"00", message:"update successful"})
                    })
                }
            })
        })
    }catch(e){
        console.log(e)
    }
}

exports.approveUser=(req, res)=>{
    var id={_id:req.params.id}
    var data={
        verified:true
    }
    try{
        jwt.verify(req.token, "golden_little_kids", (err, decoded_user)=>{
            adminModel.findById(decoded_user.user, (err, admin)=>{
                if(admin.access< 1){
                    res.json({code:"01", message:"only admin authorised to view this route"})
                }else{
                    adminModel.findByIdAndUpdate(id, data, (err)=>{
                        if(err)res.json({code:"01", err:err, message:"error approving user"})
                        res.json({code:"00", message:"approve successful"})
                    })
                }
            })
        })
    }catch(e){
        console.log(e)
    }
}

exports.unapproveUser=(req, res)=>{
    var id={_id:req.params.id}
    var data={
        verified:false
    }
    try{
        jwt.verify(req.token, "golden_little_kids", (err, decoded_user)=>{
            adminModel.findById(decoded_user.user, (err, admin)=>{
                if(admin.access< 1){
                    res.json({code:"01", message:"only admin authorised to view this route"})
                }else{
                    adminModel.findByIdAndUpdate(id, data, (err)=>{
                        if(err)res.json({code:"01", err:err, message:"error unapproving user"})
                        res.json({code:"00", message:"unapprove successful"})
                    })
                }
            })
        })
    }catch(e){
        console.log(e)
    }
}

exports.makeAdmin=(req, res)=>{
    var id={_id:req.params.id}
    var data={
        access:1
    }
    try{
        jwt.verify(req.token, "golden_little_kids", (err, decoded_user)=>{
            adminModel.findById(decoded_user.user, (err, admin)=>{
                if(admin.access<1){
                    res.json({code:"01", message:"only admin authorised to view this route"})
                }else{
                    adminModel.findByIdAndUpdate(id, data, (err)=>{
                        if(err)res.json({code:"01", err:err, message:`error making user admin`})
                        res.json({code:"00", message:"user made admin successfully"})
                    })
                }
            })
        })
    }catch(e){
        console.log(e)
    }
}

exports.removeAdmin=(req, res)=>{
    var id={_id:req.params.id}
    var data={
        access:0
    }
    try{
        jwt.verify(req.token, "golden_little_kids", (err, decoded_user)=>{
            adminModel.findById(decoded_user.user, (err, admin)=>{
                if(admin.access<1){
                    res.json({code:"01", message:"only admin authorised to view this route"})
                }else{
                    adminModel.findByIdAndUpdate(id, data, (err)=>{
                        if(err)res.json({code:"01", err:err, message:`error removing user as admin`})
                        res.json({code:"00", message:"user removed as admin successfully"})
                    })
                }
            })
        })
    }catch(e){
        console.log(e)
    }
}

exports.deleteUser=(req, res)=>{
    var id={_id:req.params.id}
    try{
        jwt.verify(req.token, "golden_little_kids", (err, decoded_user)=>{
            adminModel.findById(decoded_user.user, (err, admin)=>{
                if(admin.access<1){
                    res.json({code:"01", message:"only admin authorised to view this route"})
                }else{
                    adminModel.findByIdAndRemove(id, (err)=>{
                        if(err)res.json({code:"01", message:"error deleting user details"})
                        res.json({code:"00", message:"user deleted successfully"})
                    })
                }
            })
        })
    }catch(e){
        console.log(e)
    }
}