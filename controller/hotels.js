var hotelModel= require('../models/hotels');
var cloudinary= require('cloudinary')
require('dotenv').config()
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });



exports.addHotel=(req, res)=>{
   var data={
    images:[String],
    location:String,
    information:[String],
    description:String,
    interest:[String],
    rates:[],
    rate_value:Number,
    rooms:[{type:mongoose.Schema.Types.ObjectId, ref:'rooms'}]
   } 
   try{
    //initiate an empty array to keep the image url
    img=[]
    //keep count of the number of files inputed
    var count=data.image.length
   }catch(e){
       console.log(e)
   }
}