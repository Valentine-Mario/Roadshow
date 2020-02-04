const emailNotificationModel=require('../models/email-notification')
var mail=require('../helpers/mail')
var Queue = require('bull');
const REDIS_URL=process.env.REDIS_URL||'redis://127.0.0.1:6379'
const WorkQueue = new Queue('email', REDIS_URL);
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

    retriveEmail(req, res){
        var data={
            header:req.body.header,
            content:req.body.content
        }
        const options = {
            attempts: 2
          };
        try{
            emailNotificationModel.find({}, (err, emails)=>{
                if(err){
                    res.status(501).json({code:"01", message:"error retriving email"})
                }else{
                    
                   
                   WorkQueue.add({email:emails}, options);
                     res.status(200).json({code:"00", message:"email has been queued to send"})
                     WorkQueue.process( job => {
                        for (var a of job.data.email) {
                            mail.notify_email(data.header, data.content, a.email)
                        }
                      })
                      WorkQueue.on('completed', (job, result) => {
                        console.log(`Job completed with result`);
                      })
                }
                
            })
        }catch(e){
            res.status(500)
        }
    }
}

module.exports=new EmailNotification()