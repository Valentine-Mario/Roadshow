const hasher=require('../helpers/password-bcrypt')
const inviteModel=require('../models/invited_user')

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
            email:''
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
                            if(!err)res.render('welcome', { title: 'Strint Trip', message:"Welcome to Sprintrip" })

                        })
                    })
                }
            })
        }catch(e){
            res.status(500)
        }
       
    }

    acceptLink(req, res){
        res.render('accept', {token:req.query.token, email:req.query.email})
    }
}

module.exports=new Invite();