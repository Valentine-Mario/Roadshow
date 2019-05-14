var venueModel=require('../models/venues')
var cloudinary= require('cloudinary')
require('dotenv').config()
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });


  exports.addVenue=(req, res)=>{
    var data={
     name:req.body.name,
     images:req.files,
     location:req.body.location,
     amenities:req.body.amenities,
     description:req.body.description,
     availability:req.body.availability,
     pricing:req.body.pricing,
     capacity:req.body.capacity,
     type:req.body.type
    } 
    try{
     //initiate an empty array to keep the image url
     img=[]
     //keep count of the number of files inputed
     var count=data.images.length;
     for(i=0; i<data.images.length; i++){
         cloudinary.uploader.upload(data.images[i].path, function(result_pass){
         }, {resource_type:"image"}).then((result)=>{
             img.push(result.secure_url);
             data.images=img;
             if(count==data.images.length){
                 amenities_array=data.amenities.split(', ')
                 data.amenities=amenities_array
                 venueModel.create(data, (err, value)=>{
                     if(err)res.json({code:"01", message:"error creaating venue", err:err})
                     res.json({code:"00", message:"venue created successfully"})
                 })
             }
         })
     }
    }catch(e){
        console.log(e)
    }
 }
 