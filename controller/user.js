const userModel= require('../models/user');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs')
require('dotenv').config()
var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      name:"job-finder",
      auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
      }
  });
const fs = require('fs');

exports.addGoogleUser=(req, res)=>{
    try{
        var user=req.user._id
    jwt.sign({user}, "golden_little_kids", (err, user_token)=>{
        if(err)res.json({code:"00", err:err, message:"error creating user token, try again"})
        res.json({code:"00", message:user_token})
    })
    }catch(e){
        console.log(e)
    }
}

exports.addUser=(req, res)=>{
    var data={
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    auth_id:null,
    date_created:Date.now()
    }
    try{
        if(data.password.length<6){
            res.json({code:"01", message:"password must be atv least 6 characters"})
        }else{
            userModel.findOne({email: data.email}, (err, email_value)=>{
                if(email_value!==null){
                    res.json({code:"01", message:"email already exist choose a new email"})
                }else{
                    bcrypt.hash(data.password, 15, (err, hashed)=>{
                        data.password=hashed
                        userModel.create(data, (err, user_details)=>{
                                var mailOptions={
                                    from:`Road Show`,
                                                to:user_details.email,
                                                subject:`Dear ${user_details.name}, email verification`,
                                                html:`
                                                <div>
                                                Welcome to Job miner, click on the link below to verify account
                                                <br/>
                                                <a href="base_url/user/approve/${user_details._id}">click</a>
                                                </div>
                                                `
                                }
                                transporter.sendMail(mailOptions, function(err, info){
                                    if(err){
                                        console.log(err)
                                        return false
                                    }else{
                                        console.log("email sent")
                                        res.json({code:"00", mesage:"account created successfully"})
                                    }
                                })
                        })
                    })
                }
            })
        }
    }catch(e){
        console.log(e)
    }
}

exports.approveEmail=(req, res)=>{
    var id={_id:req.params.id}
    var data={
        verified:true
    }
    try{
        userModel.findByIdAndUpdate(id, data, (err)=>{
            if(err)res.json({code:"01", err:err, message:"error approving account, try again"})
            res.json({code:"00", message:"account approved successfully"})
        })
    }catch(e){
        console.log(e)
    }
}

exports.login=(req, res)=>{
    var data={
        email:req.body.email,
        password:req.body.password
    }
    try{
        userModel.findOne({email:data.email}, (err, user)=>{
            if(user){
                bcrypt.compare(data.password, user.password, function(err, passwordVal){
                    if(passwordVal){
                        if(user.verified==false){
                            res.json({code:"01", message:"please verify email before you log in"})
                        }else{
                            user=user._id
                            jwt.sign({user}, "golden_little_kids", (err, token)=>{
                                res.json({code:"00", message:token})
                            })
                        }
                        
            }
            else{
                res.json({code:"01", message:"invalid password"})
            }
        })
    } else{
                res.json({code:"01", message:"this email dosen't exist"});
            }
        })
    }catch(e){
        console.log(e)
    }
  }

  exports.getProfile=(req, res)=>{
      try{
        jwt.verify(req.token, "golden_little_kids", (err, decoded_user)=>{
            if(err){
                res.json({code:"01", err:err, message:"error verifying token"})
            }else{
                userModel.findById(decoded_user.user, (err, user_details)=>{
                    if(err)res.json({code:"01", err:err, message:"error getting user details"})
                    res.json({code:"00", message:user_details})
                })
            }
        })
      }catch(e){
          console.log(e)
      }
  }


  exports.editDetails=(req, res)=>{
    var data={
        name:req.body.name,
        email:req.body.email,
    }
    try{
        
            jwt.verify(req.token, "golden_little_kids", (err, decoded_user)=>{
               
                
                userModel.findByIdAndUpdate(decoded_user.user, data, (err)=>{
                   if(err){
                    if (err.name === 'MongoError' && err.code === 11000) {
                        res.json({code:"01", message:"email already exist"})
                      }
                   } else{
                    res.json({code:"00", message:"update successful"});
                   }                      
                })   
               
                })
           
        
    }catch(e){
        console.log(e)
    }
  }

  exports.changePassword=(req, res)=>{
    var old_password= req.body.old_password
    var data={
        password:req.body.password
    }
    try{
        jwt.verify(req.token, "golden_little_kids", (err, user)=>{
            userModel.findById(user.user, (err, user_info)=>{
                bcrypt.compare(old_password, user_info.password, function(err, passwordVal){
                    if(!passwordVal){
                        res.json({message:"wrong old password"})
                    }else{
                        if(data.password.length<6){
                            res.json({code:"01", message:"password should be 6 or more characters"})
                        }else{
                            bcrypt.hash(data.password, 15, function(err, hash) {
                                data.password = hash;
                                userModel.findByIdAndUpdate(user.user, data, function(err){
                                    if(err) res.json({err:err, message:"error, could not update password"})
                                    res.json({code:"00", message:"password changed successfully."})
                                })
                            })
                        }
                        
                    }
            })
        })
    })
    }catch(e){
        console.log(e)
    }
  }

  exports.deleteAccount=(req, res)=>{
    try{
        jwt.verify(req.token, 'golden_little_kids', (err, decoded_user)=>{
            if(err){
                res.json({err:err, message:"error decoding information"})
            }else{
                userModel.findByIdAndRemove(decoded_user.user, (err)=>{
                    if(err)res.json({code:"01", message:"error deleting account"})
                    res.json({code:"00", message:"account deleted successfully"})
                })
            }
            
        })
    }catch(e){
        console.log(e)
    }
  }