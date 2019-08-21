var nodemailer = require('nodemailer');
require('dotenv').config()
var pdf = require('html-pdf');
const fs = require('fs');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

class mailer{

    signup(email, subject, user, tempLink, user_acc){
        return new Promise((resolve, reject)=>{
            var mailTemplate  = `<div>
            Welcome to sprinttrip
            ${user}<br/>
            <a href="https://rocky-mesa-69765.herokuapp.com/${user_acc}/approve?token=${tempLink}">Click</a> to approve account
            <br/>
            link expires after 1 day
            </div>`
            var mailOptions = {
                from: '"Sprintrip"',
                to: email,
                subject: subject,
                html: `${mailTemplate}`
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  reject({code:"00", message:error});
                } else {
                  resolve({code:"00", message:"Mail sent successfully. Please verify account"})
                }
              });
        })
    }

    pdf_email(user){
        return new Promise((resolve, reject)=>{

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
            for(var a of user.activity){
                str += '<li> <b>Type</b>:'+ a.type + '<br/><br/> <b>Details</b>:'+ a.details + '<br/><br/> <b>Start date</b>:'+ a.start_date+ '<br/><br/> <b>End date</b>:'+ a.end_date+ '</li> <hr/>';
    
            }
            str += '</ol">';
            str+='<small><i>Thank you for using Roadshow </i></small>'
            pdf.create(str, options).toFile(`./files/${user._id}.pdf`, function(err, response) {
                if(err){
                    res.json({code:"01", err:err, message:"error writing to pdf"})
                }else{
                    
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
                                reject({code:"01", message:err})
                                
                            }else{
                                
                                resolve({code:"00", message:"email sent successfully"})
                                
                            }
                        })
                    
                }
              })
                }
            })
        }
    })
}
    notify_email(header, content, email, name){
        return new Promise((resolve, reject)=>{
            var mailOption={
                from:`Sprintrip`,
                to:email,
                subject:header,
                html:`
                hello ${name} <br/>
                ${content}
                `
            };
            transporter.sendMail(mailOption, function(err, info){
                if(err){
                    reject(false)
                }else{
                    resolve(true)  
                }
            })
        })
    }

    approval_mail(header, summary, email, link, type){
        return new Promise((resolve, reject)=>{
            var mailOption={
                from:`Sprintrip`,
                to:email,
                subject:header,
                html:`
                The following booking needs approval
                ${summary}<br/>
                <a href="http://localhost:7000/bizbookin/approve/${type}/${link}">click</a> to approve<br/>
                <a href="http://localhost:7000/bizbookin/disapprove/${type}/${link}">click</a> to disapprove
                `
            };
            transporter.sendMail(mailOption, function(err, info){
                if(err){
                    reject(false)
                }else{
                    resolve(true)  
                }
            })
        })
    }

}

module.exports=new mailer()