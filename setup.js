var GoogleStrategy = require('passport-google-oauth20').Strategy;
var passport=require('passport')
require('dotenv').config()
const User=require('./models/user')
passport.serializeUser((user, done)=>{
    done(null, user._id)
})
passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user_details)=>{
        done(null, user_details)
    })
})
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/user/google"
  },
  function(accessToken, refreshToken, profile, done) {
   
        User.findOne({auth_id: profile.id}, (err, user_value)=>{
            if(user_value!==null){
                console.log("log in successful")
                done(null, user_value)
            }else{
                new User({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:null,
                    auth_id:profile.id,
                    verified:true,
                    date_created:Date.now()
                    }).save().then(val=>{
                        
                        done(null, val._id)
                    })
            }
           })
    
   }
  
));