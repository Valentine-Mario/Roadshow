const emailNotificationModel=require('../models/email-notification')


class EmailNotification{
    subscribeEmail(req, res){
        var data={
            email:req.body.email,
            date:Date.now()
        }
        try{
            emailNotificationModel.create(data, (err, sub)=>{
                if(err){
                    if (err.name === 'MongoError' && err.code === 11000) {
                        res.status(201).json({code:"01", message:"This email has already been subscribed"})
                      }
                }else{
                    res.status(200).json({code:"00", message:"Email subscribed successfully"})
                }
            })
        }catch(e){
            res.status(500)
        }
    }
}

module.exports=new EmailNotification()