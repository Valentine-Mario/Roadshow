require('dotenv').config()
const jwt=require('jsonwebtoken')
const usrModel=require('../models/user')
class auth{
    createToken(data){
        return new Promise((res, rej)=>{
            jwt.sign(data, process.env.JWT_SECRET, (err, token_value)=>{
                if(err)rej(err)
                res(token_value);
            })
        })
    }

    verifyToken(data){
        return new Promise((res, rej)=>{
            jwt.verify(data, process.env.JWT_SECRET, (err, decoded_token)=>{
                if(err){
                    rej(err)
                }else{
                    usrModel.findById(decoded_token.user, (err, user)=>{
                        if(err)rej(err)
                        res(user)
                    })
                }
            })
        })
    }

    mailerToken(data){
        return new Promise((resolve, reject)=>{
            jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token_value)=>{
                if(err)reject(err)
                resolve(token_value)
            })
        })
    }
}

module.exports=new auth()