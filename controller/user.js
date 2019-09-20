const userModel= require('../models/user');
const auth_user=require('../helpers/auth')
const mail=require('../helpers/mail')
const hasher=require('../helpers/password-bcrypt')


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
    date_created:Date.now()
    }
    try{
        if(data.password.length<6){
            res.json({code:"01", message:"password must be at least 6 characters"})
        }else{
            userModel.findOne({email: data.email}, (err, email_value)=>{
                if(email_value!==null){
                    res.json({code:"01", message:"email already exist choose a new email"})
                }else{
                    hasher.hash_password(data.password).then(hashed=>{
                        data.password=hashed
                        userModel.create(data, (err, user_details)=>{
                            user=user_details._id
                            auth_user.mailerToken({user}).then(token=>{
                                mail.signup(user_details.email, "Welcome", user_details.name, token, 'user')
                                    res.json({code:"00", message:"approval mail sent"})
                                 
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
    var token=req.query.token
    var data={
        verified:true
    }
    try{
        auth_user.verifyTokenMail(token).then(user_value=>{
            userModel.findByIdAndUpdate(user_value._id, data, (err)=>{
                if(err)res.json({code:"01", err:err, message:"error approving account, try again"})
                res.json({code:"00", message:"account approved successfully"})
            })
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
               if(user.password==null){
                    res.json({code:"01", message:"please login with google"})
               }else{
                hasher.compare_password(data.password, user.password).then(value=>{
                     
                    if(value){
                        if(user.verified==false){
                            res.json({code:"01", message:"please verify email before you log in"})
                        }else{
                            user=user._id
                            auth_user.createToken({user}).then(token=>{
                                res.json({code:"00", message:token})
                            })
                        }
                        
            }
            else{
                res.json({code:"01", message:"invalid password"})
            }
                })  
               } 
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
        auth_user.verifyToken(req.token).then(decoded_user=>{
            res.json({code:"00", message:decoded_user})
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
        console.log(e)
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
        console.log(e)
    }
  }

  exports.deleteAccount=(req, res)=>{
    try{
                auth_user.verifyToken(req.token).then(user=>{
                    userModel.findByIdAndRemove(user._id, (err)=>{
                        if(err)res.json({code:"01", message:"error deleting account"})
                        res.json({code:"00", message:"account deleted successfully"})
                    })
                })
    }catch(e){
        console.log(e)
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
                
                mail.notify_email(data.header, data.content, item.email, item.name).then(response=>{
                    
                        if(response==true){
                            console.log("mail sent successfully")
                        }else{
                            console.log("error sending mail")
                        }
                    
                })
            }
        })
    }catch(e){
        console.log(e)
    }
}

exports.requestPdf=(req, res)=>{
    try{
        auth_user.verifyToken(req.token).then(user=>{
            mail.pdf_email(user)
                res.json({code:"00", message:"booking sent to mail"})
        })
                
    }catch(e){
        console.log(e)
    }
}

exports.setHotel=(req, res)=>{
    var data={
        hotel_price_spec:req.body.hotel_price_spec,
    }
    try{
        auth_user.verifyToken(req.token).then(user=>{
            userModel.findByIdAndUpdate(user._id, data, (err)=>{
                if(err)res.status(501).json({code:"01", message:"error modifying details"})
                res.status(200).json({code:"00", message:"details modified successfully"})
            })
        })
    }catch(e){
        console.log(e)
    }


}

exports.resetHotel=(req, res)=>{
    var data={
        hotel_price_spec:0,
    }
    try{
            auth_user.verifyToken(req.token).then(user=>{
                userModel.findByIdAndUpdate(user._id, data, (err)=>{
                    if(err)res.status(501).json({code:"01", message:"error modifying details"})
                    res.status(200).json({code:"00", message:"details modified successfully"})
                })
            })
       
    }catch(e){
        console.log(e)
    }
}

exports.setVenue=(req, res)=>{
    var data={
        venue_price_spec:req.body.venue_price_spec
    }
    try{
        auth_user.verifyToken(req.token).then(user=>{
            userModel.findByIdAndUpdate(user._id, data, (err)=>{
                if(err)res.status(501).json({code:"01", message:"error modifying details"})
                res.status(200).json({code:"00", message:"details modified successfully"})
            })
        })
            
    }catch(e){
        console.log(e)
    }
}

exports.resetVenue=(req, res)=>{
    var data={
        venue_price_spec:0
    }
    try{
        auth_user.verifyToken(req.token).then(user=>{
            userModel.findByIdAndUpdate(user._id, data, (err)=>{
                if(err)res.status(501).json({code:"01", message:"error modifying details"})
                res.status(200).json({code:"00", message:"details modified successfully"})
            })
        })
    }catch(e){
        console.log(e)
    }
}

exports.setCar=(req, res)=>{
    var data={
        car_price_spec:req.body.car_price_spec
    }
    try{
        auth_user.verifyToken(req.token).then(user=>{
            userModel.findByIdAndUpdate(user._id, data, (err)=>{
                if(err)res.status(501).json({code:"01", message:"error modifying details"})
                res.status(200).json({code:"00", message:"details modified successfully"})
            })
        })
    }catch(e){
        console.log(e)
    }
}

exports.resetCar=(req, res)=>{
    var data={
        car_price_spec:0
    }
    try{
        auth_user.verifyToken(req.token).then(user=>{
            userModel.findByIdAndUpdate(user._id, data, (err)=>{
                if(err)res.status(501).json({code:"01", message:"error modifying details"})
                res.status(200).json({code:"00", message:"details modified successfully"})
            })
        })
        
    }catch(e){
        console.log(e)
    }
}

exports.setFlight=(req, res)=>{
    var data={
    fligh_price_perk:req.body.fligh_price_perk
    }
    try{
        auth_user.verifyToken(req.token).then(user=>{
            userModel.findByIdAndUpdate(user._id, data, (err)=>{
                if(err)res.status(501).json({code:"01", message:"error modifying details"})
                res.status(200).json({code:"00", message:"details modified successfully"})
            })
        })
    }catch(e){
        console.log(e)
    }
}

exports.resetFlight=(req, res)=>{
    var data={
        fligh_price_perk:0
            }
    try{
        auth_user.verifyToken(req.token).then(user=>{
            userModel.findByIdAndUpdate(user._id, data, (err)=>{
                if(err)res.status(501).json({code:"01", message:"error modifying details"})
                res.status(200).json({code:"00", message:"details modified successfully"})
            })
        })
    }catch(e){
        console.log(e)
    }
}