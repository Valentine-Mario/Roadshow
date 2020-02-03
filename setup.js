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
    callbackURL: "https://rocky-mesa-69765.herokuapp.com"+"/user/google"
  },
  function(accessToken, refreshToken, profile, done) {
        User.find({auth_id: profile.id}, (err, user_value)=>{
            if(user_value){
                
                done(null, user_value[0]._id)
            }else{
                data={
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:null,
                    auth_id:profile.id,
                    verified:true,
                    access:0,
                    date_created:Date.now(),
                    pics:profile.photos[0].value,
                    account_type:'Personal',               
                }
                User.create(data, (err, user_details)=>{
                    if(err){
                        if (err.name === 'MongoError' && err.code === 11000) {
                            done(null)
                            
                          }
                    }else{
                        done(null, user_details._id)
                    }
                })
            }
           })

    
   }
  
));
