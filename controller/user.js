const userModel= require('../models/user');
const auth_user=require('../helpers/auth')
const mail=require('../helpers/mail')
const hasher=require('../helpers/password-bcrypt')
const inviteModel=require('../models/invited_user')
const BookingModel=require('../models/user-booking')
const cloud=require('../helpers/cloud')

exports.addGoogleUser=(req, res)=>{
    try{
        var user=req.user._id
    auth_user.createToken({user}).then(token=>{
        var responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close(); </script></html>'
    responseHTML = responseHTML.replace('%value%', JSON.stringify({
        code:"00",
        user: token
    }));
    res.status(200).send(responseHTML);
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
    date_created:Date.now(),
    account_type:req.body.account_type,
    }
    try{
        if(data.password.length<6){
            res.status(203).json({code:"01", message:"password must be at least 6 characters"})
        }else{
            userModel.findOne({email: data.email}, (err, email_value)=>{
                if(email_value!==null){
                    res.status(203).json({code:"01", message:"email already exist choose a new email"})
                }else{
                    hasher.hash_password(data.password).then(hashed=>{
                        data.password=hashed
                        userModel.create(data, (err, user_details)=>{
                            user=user_details._id
                            auth_user.mailerToken({user}).then(token=>{
                                mail.signup(user_details.email, "Welcome", user_details.name, token, 'user')
                                    res.status(200).json({code:"00", message:"approval mail sent"})
                                 
                            })
                            
                        })
                    })
                }
            })
        }
    }catch(e){
        console.log(e)
        res.status(500)
    }
}

exports.approveEmail=(req, res)=>{
    var token=req.query.token
    var data={
        verified:true
    }
    try{
        auth_user.verifyTokenMail(token).then(user_value=>{
            userModel.findByIdAndUpdate(user_value._id, data, (err)=>{
                if(err)res.status(501).json({code:"01", err:err, message:"error approving account, try again"})
                res.status(200).render('welcome', { title: 'Strint Trip', message:"Welcome to Sprintrip, account verified" });
            })
        })
    }catch(e){
        console.log(e)
        res.status(500)
    }
}


exports.sendInvite=(req, res)=>{
    var data={
       email: req.body.email
    }
    try{
        auth_user.verifyToken(req.token).then(user=>{
            if(user.account_type!=="Business"){
                res.status(203).json({code:"01", message:"this account type is unathorised to send out invites"})
            }else{
                userModel.find({email:data.email}, (err, val)=>{
                    if(val.length>0){
                        res.status(201).json({code:"01", message:"email already exist"})
                    }else{
                        inviteModel.find({email:data.email}, (err, value)=>{
               
                            if(value.length<1){
                                //store name to be used later
                                name=user.name
                                user=user.id
                                auth_user.mailerToken({user}).then(token=>{
                                    mail.inviteEmail(data.email, token, `invite to Sprint Trip by ${name}`, name) 
                                    res.status(200).json({code:"00", message:"invite sent successfully"})
                                })
                            }else{
                                res.status(203).json({code:"01", message:"this email is already registered"})
                            }
                        })
                    }
                })
                
            }
        })
    }catch(e){
        res.status(500)
    }
}

exports.login=(req, res)=>{
    var data={
        email:req.body.email,
        password:req.body.password
    }
    try{
        //check if email exist in regular user
        userModel.findOne({email:data.email}, (err, user)=>{
            //check if it exist on invited user
            inviteModel.findOne({email:data.email}, (err, invited_user)=>{
                if(user){
                    if(user.password==null){
                         res.status(201).json({code:"01", message:"please login with google"})
                    }else{
                     hasher.compare_password(data.password, user.password).then(value=>{
                          
                         if(value){
                             if(user.verified==false){
                                 res.status(201).json({code:"01", message:"please verify email before you log in"})
                             }else{
                                 user=user._id
                                 auth_user.createToken({user}).then(token=>{
                                     res.status(200).json({code:"00", token:token, message:"login successful"})
                                 })
                             }      
                 }
                 else{
                     res.status(201).json({code:"01", message:"invalid password"})
                 }
                     })  
                    } 
         } else if(invited_user){ 
                    hasher.compare_password(data.password, invited_user.password).then(value=>{    
                        if(value){ 
                                user=invited_user._id
                                auth_user.createToken({user}).then(token=>{
                                    user=invited_user.user
                                    auth_user.createToken({user}).then(token2=>{
                                        //send inited user token and user token
                                        res.status(200).json({code:"00", message:token, biz_acc_token:token2})
                                    })
                                })               
                }
                else{
                    res.json({code:"01", message:"invalid password"})
                }
                    })  
                 }else{
                    res.status(201).json({code:"01", message:"this email dosen't exist"});
                 }
            })
           
        })
    }catch(e){
       res.status(500)
    }
  }

  exports.getProfile=(req, res)=>{
      try{
        auth_user.verifyToken(req.token).then(decoded_user=>{
            res.status(200).json({code:"00", message:decoded_user})
        })
      }catch(e){
          res.status(500)
      }
  }


  exports.editDetails=(req, res)=>{
    var data={
        name:req.body.name,
        email:req.body.email,
    }
    try{
            auth_user.verifyToken(req.token).then(decoded_user=>{
                userModel.findByIdAndUpdate(decoded_user._id, data, (err)=>{
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
        res.status(500)
    }
  }

  exports.updateProfilePics=(req, res)=>{
    var data={
        pics:req.files[0].path
    }
    try{
        auth_user.verifyToken(req.token).then(user=>{
            cloud.pics_upload(data.pics).then(pics_url=>{
                data.pics=pics_url.secure_url
               
                userModel.findByIdAndUpdate(user.id, data, (err)=>{
                    if(err) res.status(201).json({code:"01", message:"error updating profile pics"})
                    res.status(200).json({code:"00", message:"pics updated successfully"})
                })
            })
        })
    }catch(e){
        res.status(500)
    }
  }

  exports.changePassword=(req, res)=>{
    var old_password= req.body.old_password
    var data={
        password:req.body.password
    }
    try{
        auth_user.verifyToken(req.token).then(decoded_user=>{
        hasher.compare_password(old_password, decoded_user.password).then(value=>{
            if(!value){
                res.json({message:"wrong old password"})
            }else{
                if(data.password.length<6){
                    res.json({code:"01", message:"password should be 6 or more characters"})
                }else{
                    hasher.hash_password(data.password).then(hashed=>{
                        data.password = hashed;
                        userModel.findByIdAndUpdate(decoded_user._id, data, function(err){
                            if(err) res.json({err:err, message:"error, could not update password"})
                            res.json({code:"00", message:"password changed successfully."})
                        })
                    })
                }
                
            }
        })
        })
    
    }catch(e){
        res.status(500)
    }
  }

  exports.deleteAccount=(req, res)=>{
    try{
                auth_user.verifyToken(req.token).then(user=>{
                    //todo: make this delete function run as a job
                    //store deleted user id to be used later
                    deleted_user_id=user._id
                    userModel.findByIdAndDelete(user._id, (err)=>{
                       
                        if(err){
                            res.json({code:"01", message:"error deleting account"})
                        }else{
                            res.json({code:"00", message:"account deleted successfully"})
                            inviteModel.find({user:deleted_user_id}, (err, invitedUser)=>{
                                for (const a of invitedUser) {
                                    inviteModel.findByIdAndDelete(a._id, (err)=>{
                                        //do nothing
                                    })
                                }
                            })
                        }
                    })
                })
    }catch(e){
        res.status(500)
    }
  }


  exports.notifyUsers=(req, res)=>{
    var data={
        header:req.body.header,
        content:req.body.content
    }
    try{
       userModel.find({verified:true}, (err, user)=>{
            for(item of user){
                
                mail.notify_email(data.header, data.content, item.email).then(response=>{
                    
                        if(response==true){
                            console.log("mail sent successfully")
                        }else{
                            console.log("error sending mail")
                        }
                    
                })
            }
        })
    }catch(e){
        res.status(500)
    }
}

exports.requestPdf=(req, res)=>{
    try{
        auth_user.verifyToken(req.token).then(user=>{
            BookingModel.find({user:user.id}, (err, booking)=>{
               if(booking.length < 1){
                res.status(200).json({code:"01", message:"you have no booking"})
               }else{
                mail.pdf_email(booking, user)
                res.status(200).json({code:"00", message:"booking sent to mail"})
               }
            })
        })
                
    }catch(e){
        res.status(500)
    }
}

exports.changeAccountType=(req, res)=>{
    var data={
        account_type:req.body.account_type
    }
    try{
        auth_user.verifyToken(req.token).then(user=>{
            userModel.findByIdAndUpdate(user.id, data, (err)=>{
                if(err)res.status(501).json({code:"01", message:"error updating account type. Please try again later"})
                res.status(200).json({code:"00", message:"account type updated successfully"})
            })
        })
    }catch(e){
        res.status(500)
    }
}

