const userModel= require('../models/user');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
var pdf = require('html-pdf');
var cloudinary= require('cloudinary')
require('dotenv').config()
const fs = require('fs');
var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      name:"job-finder",
      auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
      }
  });
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });

exports.addGoogleUser=(req, res)=>{
    try{
        var user=req.user._id
    jwt.sign({user}, "golden_little_kids", (err, user_token)=>{
       var responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close(); </script></html>'
    responseHTML = responseHTML.replace('%value%', JSON.stringify({
        code:"00",
        user: user_token
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
                                                <a href="https://rocky-mesa-69765.herokuapp.com/user/approve/${user_details._id}">click</a>
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


  exports.notifyUsers=(req, res)=>{
    var data={
        header:req.body.header,
        content:req.body.content
    }
    try{
       userModel.find({verified:true}, (err, user)=>{
            for(item of user){
                var mailOption={
                    from:`Road Show`,
                    to:item.email,
                    subject:`${data.header}`,
                    html:`
                    ${data.content}
                    `
                };
                transporter.sendMail(mailOption, function(err, info){
                    if(err){
                        console.log(err)
                        return false
                    }else{
                        console.log("email sent")
                        res.json({code:"00", message:"email sent successfully"})
                        return true;
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
        jwt.verify(req.token, 'golden_little_kids', (err, decoded_user)=>{
            userModel.findById(decoded_user.user, (err, user)=>{
                if(err){
                    res.json({code:"01", err:err, message:"error getting user details"})
                }else{
                    if(user.activity.length<1){
                        res.json({code:"01", message:"you have no booking records"})
                    }else{
                        fs.appendFile(`./files/${user._id}.pdf`, '', (err)=>{
                            if(err){
                                res.json({code:"01", message:"error creating pdf. Try again"})
                            }else{
                                var options = { format: 'Letter' };
                        var str=`<div style="width:100%;">
                        <div style="width:30%; float:left;">
                            <img width='200' height='200' src="https://res.cloudinary.com/rchain/image/upload/v1556621544/roadshow.png">
                        </div>
                        <div style="width:70%; font-family:Comic Sans MS, cursive, sans-serif; float:left;">
                            <h2 style="padding-top: 50px;">Your Roadshow Booking Details</h2>
                            <br/>
                            <p style="padding-top: 10px; font-size: 18px;">Dear ${user.name}, below is the details of your bookings on Roadshow</p>
                        </div>
                        <hr/>
                    </div>
                          <ol style="padding-top:30px;">`
                        for(a of user.activity){
                            str += '<li> <b>Type</b>:'+ a.type + '<br/><br/> <b>Details</b>:'+ a.details + '<br/><br/> <b>Start date</b>:'+ a.start_date+ '<br/><br/> <b>End date</b>:'+ a.end_date+ '</li> <hr/>';

                        }
                        str += '</ol">';
                        str+='<small><i>Thank you for using Roadshow </i></small>'
                        pdf.create(str, options).toFile(`./files/${user._id}.pdf`, function(err, response) {
                            if(err){
                                res.json({code:"01", err:err, message:"error writing to pdf"})
                            }else{
                                // cloudinary.uploader.upload(`./files/${user._id}.pdf`, (pdf_details)=>{

                                // }, {resource_type:"auto"}).then((user_pdf)=>{
                                //     user_link=user_pdf.secure_url
                                    var mailOption={
                                        from:`Road Show`,
                                        to:user.email,
                                        subject:`Booking details in PDF`,
                                        attachments:[
                                            {   
                                                filename:`${user.name}.pdf`,
                                                path:`./files/${user._id}.pdf`
                                            },
                                        ],
                                        html:`
                                       <div>
                                       Attached to this mail is a copy of your bookings on roadshow
                                       </div>
                                       <br/>
                                        `
                                    };
                                    transporter.sendMail(mailOption, function(err, info){
                                        if(err){
                                            console.log(err)
                                            return false
                                        }else{
                                            console.log("email sent")
                                            res.json({code:"00", message:"email sent successfully"})
                                            return true;
                                        }
                                    })
                                // })
                            }
                          })
                            }
                        })
                    }
                }
            })
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
        jwt.verify(req.token, 'golden_little_kids', (err, decoded_user)=>{
            userModel.findByIdAndUpdate(decoded_user.user, data, (err)=>{
                if(err)res.status(401).json({code:"01", message:"error modifying details"})
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
        jwt.verify(req.token, 'golden_little_kids', (err, decoded_user)=>{
            userModel.findByIdAndUpdate(decoded_user.user, data, (err)=>{
                if(err)res.status(401).json({code:"01", message:"error modifying details"})
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
        jwt.verify(req.token, 'golden_little_kids', (err, decoded_user)=>{
            userModel.findByIdAndUpdate(decoded_user.user, data, (err)=>{
                if(err)res.status(401).json({code:"01", message:"error modifying details"})
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
        jwt.verify(req.token, 'golden_little_kids', (err, decoded_user)=>{
            userModel.findByIdAndUpdate(decoded_user.user, data, (err)=>{
                if(err)res.status(401).json({code:"01", message:"error modifying details"})
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
        jwt.verify(req.token, 'golden_little_kids', (err, decoded_user)=>{
            userModel.findByIdAndUpdate(decoded_user.user, data, (err)=>{
                if(err)res.status(401).json({code:"01", message:"error modifying details"})
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
        jwt.verify(req.token, 'golden_little_kids', (err, decoded_user)=>{
            userModel.findByIdAndUpdate(decoded_user.user, data, (err)=>{
                if(err)res.status(401).json({code:"01", message:"error modifying details"})
                res.status(200).json({code:"00", message:"details modified successfully"})
            })
        })
    }catch(e){
        console.log(e)
    }
}

exports.setFlight=(req, res)=>{
    var data={
    fligh_price_perk:req.body.fligh_price_perk,
    flight_type_spec:req.body.flight_type_spec
    }
    try{
        jwt.verify(req.token, 'golden_little_kids', (err, decoded_user)=>{
            userModel.findByIdAndUpdate(decoded_user.user, data, (err)=>{
                if(err)res.status(401).json({code:"01", message:"error modifying details"})
                res.status(200).json({code:"00", message:"details modified successfully"})
            })
        })
    }catch(e){
        console.log(e)
    }
}

exports.resetFlight=(req, res)=>{
    var data={
        fligh_price_perk:0,
        flight_type_spec:undefined
        }
    try{
        jwt.verify(req.token, 'golden_little_kids', (err, decoded_user)=>{
            userModel.findByIdAndUpdate(decoded_user.user, data, (err)=>{
                if(err)res.status(401).json({code:"01", message:"error modifying details"})
                res.status(200).json({code:"00", message:"details modified successfully"})
            })
        })
    }catch(e){
        console.log(e)
    }
}