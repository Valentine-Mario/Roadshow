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
}
module.exports=new business();