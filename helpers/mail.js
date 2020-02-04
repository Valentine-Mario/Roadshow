var nodemailer = require('nodemailer');
require('dotenv').config()
var pdf = require('html-pdf');
const fs = require('fs');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }, tls: {
        rejectUnauthorized: false
      }
});

class mailer{

    signup(email, subject, user, tempLink, user_acc){
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
                  console.log(error, false)
                } else {
                    console.log(true)
                }
              });
        
    }

    inviteEmail(email, token, subject, user){
        var mailTemplate  = `<div>
       Invite link by ${user}
        <a href="https://rocky-mesa-69765.herokuapp.com/invite/approve?token=${token}&email=${email}">Click</a> To create account
        <br/>
        link expires after 24 hours
        </div>`
        var mailOptions = {
            from: '"Sprintrip"',
            to: email,
            subject: subject,
            html: `${mailTemplate}`
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error, false)
            } else {
                console.log(true)
            }
          });
    }

    pdf_email(list, user){
            fs.appendFile(`./files/${user._id}.pdf`, '', (err)=>{
                if(err){
                    res.status(501)
                }else{
                    var options = { format: 'Letter' };

                    var pdf_table=`<table style="width:70%; border:1px;">`
                        for(var a of list){
                            pdf_table+= `<tr style="width:100%">`
                            pdf_table+=`<td>Type: ${a.type}</td> <td>Start date: ${a.start_date}</td> <td>End Date: ${a.end_date}</td> <td>Duration: ${a.duration} days</td> <td>Price($): ${a.price}</td>`
                            pdf_table+=`</tr>`
                            pdf_table+= `<tr style="width:100%">`
                            pdf_table+=`<td>Room Type: ${a.roomType}</td> <td>No of rooms: ${a.no_of_rooms}</td> <td>Quantity: ${a.quantity}</td> <td>No of people: ${a.no_of_people}</td> <td>Declined: ${a.declined}</td> <td>Pending: ${a.pending}</td>`
                            pdf_table+=`</tr>`
                        }
                   pdf_table+=`</table>`
                    pdf_table+=`<p>Thank you for using sprintrip`
            
            pdf.create(pdf_table, options).toFile(`./files/${user._id}.pdf`, function(err, response) {
                if(err){
                    res.status(501)
                }else{
                    
                        var mailOption={
                            from:`Sprintrip`,
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
                           Attached to this mail is a copy of your bookings on sprintrip
                           </div>
                           <br/>
                            `
                        };
                        transporter.sendMail(mailOption, function(err, info){
                            if(err){
                                console.log(err, false)
                                
                            }else{
                                
                               console.log(true)
                               fs.unlink(`./files/${user._id}.pdf`, (err)=>{
                               })
                                
                            }
                        })
                    
                }
              })
                }
            })
        
    
}
    notify_email(header, content, email){
            var mailOption={
                from:`Sprintrip`,
                to:email,
                subject:header,
                html:`
                ${content}
                `
            };
            transporter.sendMail(mailOption, function(err, info){
                if(err){
                    console.log(false, err)
                }else{
                    console.log(true)  
                }
            })
    
    }

    approval_mail(header, summary, email, link, type){
            var mailOption={
                from:`Sprintrip`,
                to:email,
                subject:header,
                html:`
                The following booking needs approval
                ${summary}<br/>
                <a href="https://rocky-mesa-69765.herokuapp.com/bizbookin/approve/${type}/${link}">click</a> to approve<br/>
                <a href="https://rocky-mesa-69765.herokuapp.com/bizbookin/disapprove/${type}/${link}">click</a> to disapprove
                `
            };
            transporter.sendMail(mailOption, function(err, info){
                if(err){
                    console.log(false, err)
                }else{
                    console.log(true)  
                }
            })
        
    }

}

module.exports=new mailer()