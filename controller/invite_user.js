const hasher=require('../helpers/password-bcrypt')
const inviteModel=require('../models/invited_user')
const userModel= require('../models/user');
const auth= require('../helpers/auth')

class Invite{
   
    accept(req, res){
        var email= req.query.email;
        var token= req.query.token;
        var data={
            password:req.body.password,
            date_created:Date.now(),
            limit:'Yes',
            limit_amount:0,
            user:'',
            email:'',
            name:req.body.name
        }
        try{
            auth.verifyTokenMail(token).then(user=>{
                data.user=user.id
                data.email=email
                if(data.password.length<6){
                    res.status(203).send("passsword must be at least 6 charcters")
                }else{
                    hasher.hash_password(data.password).then(hashed=>{
                        data.password=hashed
                        inviteModel.create(data, (err, user)=>{
                            if(err) {
                                if (err.name === 'MongoError' && err.code === 11000){
                                    res.send('Email already exist. Please tell admin to send a reinvite link with a new email')
                                }
                            }else{
                                res.render('welcome', { title: 'Strint Trip', message:"Welcome to Sprintrip" })
                            }

                        })
                    })
                }
            }).catch(err=>{
               
                 res.send(`${err.message} please get a new invite link`)
            })
        }catch(e){
            res.status(500)
        }
       
    }

    acceptLink(req, res){
        res.render('accept', {token:req.query.token, email:req.query.email})
    }

    deleteInvitedUser(req, res){
        var id={_id:req.params.id}
        try{
            auth.verifyToken(req.token).then(user=>{
                inviteModel.findById(id, (err, invitedUser)=>{
                    if(JSON.stringify(user.id)!== JSON.stringify(invitedUser.user)){
                        res.status(201).json({code:"01", message:"unauthorized to delete this user"})
                    }else{
                        inviteModel.findByIdAndDelete(id, (err)=>{
                            if(err) res.status(502).json({code:"01", message:"error deleting user"})
                            res.status(200).json({code:"00", message:`${invitedUser.name} deleted successfully`})
                        })
                    }

                })
            })
        }catch(e){
            res.status(500)
        }
    }

    getInvitedUser(req, res){
        try{
            auth.verifyInviteToken(req.token).then(user=>{
                res.status(200).json({code:"00", message:user})
            })
        }catch(e){
            res.status(500)
        }
    }
    modifyInvitedUser(req, res){
        var data={
            name:req.body.name
        }
        try{
            auth.verifyInviteToken(req.token).then(user=>{
                inviteModel.findByIdAndUpdate(user._id, data, (err)=>{
                    if(err) res.status(501).json({code:"01", message:"error modifying user"})
                    res.status(200).json({code:"00", message:"update successful"})
                })
            })
        }catch(e){
            res.status(500)
        }
    }

    modifyInvitedUserPassword(req, res){
        var old_password= req.body.old_password
    var data={
        password:req.body.password
    }
    try{
        auth_user.verifyInviteToken(req.token).then(decoded_user=>{
        hasher.compare_password(old_password, decoded_user.password).then(value=>{
            if(!value){
                res.json({message:"wrong old password"})
            }else{
                if(data.password.length<6){
                    res.json({code:"01", message:"password should be 6 or more characters"})
                }else{
                    hasher.hash_password(data.password).then(hashed=>{
                        data.password = hashed;
                        inviteModel.findByIdAndUpdate(decoded_user._id, data, function(err){
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

    modifyInvitedUserAccess(req, res){
        var data={
            limit:req.body.limit,
            limit_amount:req.body.limit_amount,
        }
        var id={_id:req.params.id}
        try{
            auth.verifyToken(req.token).then(user=>{
                inviteModel.findById(id, (err, invitedUser)=>{
                    if(JSON.stringify(user.id)!== JSON.stringify(invitedUser.user)){
                        res.status(201).json({code:"01", message:"unauthorized to modify user setting"})
                    }else{
                        inviteModel.findByIdAndUpdate(id, data, (err)=>{
                            if(err) res.status(501).json({code:"01", message:"error making update to user"})
                            res.status(200).json({code:"00", message:"update made successfully"})
                            
                        })
                    }
                })
            })
        }catch(e){
            res.status(500)
        }
    }

    getInvitedUserById(req, res){
        var id={_id:req.params.id}
        try{
            inviteModel.findById(id, (err, user)=>{
                if(err) res.status(501).json({code:"01", message:"error getting user"})
                res.status(200).json({code:"00", message:user})
            })
        }catch(e){
            res.status(500)
        }
    }

    getAllYourInvitedUser(req, res){
        try{
            auth.verifyToken(req.token).then(user=>{
                inviteModel.find({user:user.id}, (err, invited_user)=>{
                    if(err)res.status(501).json({code:"01", message:"error retriving data"})
                    res.status(200).json({code:"00", message:invited_user})
                })
            })
        }catch(e){
            res.status(500)
        }
    }
}

module.exports=new Invite();