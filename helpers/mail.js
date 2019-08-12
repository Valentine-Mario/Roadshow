var nodemailer = require('nodemailer');
require('dotenv').config()
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

class mailer{

    signup(email, subject, user, tempLink){
        return new Promise((resolve, reject)=>{
            var mailTemplate  = `<div>
            Welcome to sprinttrip
            ${user}<br/>
            <a href="https://rocky-mesa-69765.herokuapp.com/user/approve?token=${tempLink}">Click</a> to approve account
            <br/>
            link expires after 1 hour
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
                  resolve({code:"00", message:"mail sent successfully"})
                }
              });
        })
    }
}

module.exports=new mailer()