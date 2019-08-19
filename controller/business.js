const business_model=require('../models/business')
const mail=require('../helpers/mail')
const auth=require('../helpers/auth')
const hasher=require('../helpers/password-bcrypt')
class business{
    add_buisness(req, res){
        var data={
            name:req.body.name,
            email:req.body.email,
            description:req.body.description,
            password:req.body.password,
            date_created:Date.now()
        }
        try{
            if(data.password.length<6){
                res.status(201).json({code:"01", message:"password must be at least 6 characters"})
            }else{
                business_model.findOne({email: data.email}, (err, email_value)=>{
                    if(email_value!==null){
                        res.json({code:"01", message:"email already exist choose a new email"})
                    }else{
                        hasher.hash_password(data.password).then(hashed=>{
                            data.password=hashed
                            business_model.create(data, (err, business)=>{
                               var biz=business._id
                                auth.mailerToken({biz}).then(token=>{
                                    mail.signup(business.email, "Welcome", business.name, token, 'business').then(val=>{
                                        res.status(200).json(val)
                                    })  
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

    verify_email(req, res){
        var token=req.query.token
    var data={
        verified:true
    }
    try{
        auth.verifyTokenMailBiz(token).then(buisness=>{
            business_model.findByIdAndUpdate(buisness._id, data, (err)=>{
                if(err)res.json({code:"01", err:err, message:"error approving account, try again"})
                res.json({code:"00", message:"account approved successfully"})
            })
        })
    }catch(e){
        console.log(e)
    }
    }

    login(req, res){
        var data={
            email:req.body.email,
            password:req.body.password
        }
        try{
            business_model.findOne({email:data.email}, (err, business)=>{
                if(business){
                    hasher.compare_password(data.password, business.password).then(value=>{
                        if(value){
                            if(business.verified==false){
                                res.json({code:"01", message:"please verify email before you log in"})
                            }else{
                                var biz=business._id
                                auth.createToken({biz}).then(token=>{
                                    res.status(200).json({code:"00", message:token})
                                })
                            }
                            
                }
                else{
                    res.status(201).json({code:"01", message:"invalid password"})
                }
                    })   
        } else{
                    res.status(203).json({code:"01", message:"this email dosen't exist"});
                }
            })
        }catch(e){
            console.log(e)
        }
    }

    getProfile(req, res){
        try{
            auth.verifyBusinessToken(req.token).then(business=>{
                res.status(200).json({code:"00", message:business})
            })
        }catch(e){
            console.log(e)
        }
    }


        editProfile(req, res){
            var data={
                name:req.body.name,
                email:req.body.email,
                description:req.body.description  
            }
            try{
                auth.verifyBusinessToken(req.token).then(business=>{
                    business_model.findByIdAndUpdate(business._id, data, (err)=>{
                        if(err){
                            if (err.name === 'MongoError' && err.code === 11000) {
                                res.status(201).json({code:"01", message:"email already exist"})
                              }
                           } else{
                            res.status(200).json({code:"00", message:"update successful"});
                           }  
                    })
                })
            }catch(e){
                console.log(e)
            }
        }


        updatePassword(req, res){
            var old_password= req.body.old_password
            var data={
                password:req.body.password
            }
            try{
                auth.verifyBusinessToken(req.token).then(business=>{
                    hasher.compare_password(old_password, business.password).then(value=>{
                        if(!value){
                            res.status(201).json({message:"wrong old password"})
                        }else{
                            if(data.password.length<6){
                                res.status(201).json({code:"01", message:"password should be 6 or more characters"})
                            }else{
                                hasher.hash_password(data.password).then(hashed=>{
                                    data.password = hashed;
                                    business_model.findOneAndUpdate(business._id, data, function(err){
                                        if(err) res.status(501).json({code:"01", err:err, message:"error, could not update password"})
                                        res.status(200).json({code:"00", message:"password changed successfully."})
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
    

        deleteAcc(req, res){
            try{
                auth.verifyBusinessToken(req.token).then(business=>{
                    business_model.findOneAndDelete(business._id, (err)=>{
                        if(err) res.status(501).json({code:"01", message:err})
                        res.status(200).json({code:"00", message:"account deleted successfully"})
                    })
                })
            }catch(e){
                console.log(e)
            }
        }
}
module.exports=new business();