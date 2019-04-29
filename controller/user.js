const userModel= require('../models/user');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs')
require('dotenv').config()
var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      name:"job-finder",
      auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
      }
  });
const fs = require('fs');

exports.addGoogleUser=(req, res)=>{
    var user=req.user._id
    jwt.sign({user}, "golden_little_kids", (err, user_token)=>{
        if(err)res.json({code:"00", err:err, message:"error creating user token, try again"})
        res.json({code:"00", message:user_token})
    })
}
