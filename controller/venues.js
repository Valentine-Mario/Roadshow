var venueModel=require('../models/venues')
var cloudinary= require('cloudinary')
require('dotenv').config()
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });