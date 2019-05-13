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
    images:req.files,
    location:req.body.location,
    information:req.body.information,
    description:req.body.description,
    interest:req.body.interest
   } 
   try{
    //initiate an empty array to keep the image url
    img=[]
    //keep count of the number of files inputed
    var count=data.images.length
    for(i=0; i<data.images.length; i++){
        cloudinary.uploader.upload(data.images[i].path, function(result_pass){
        }, {resource_type:"image"}).then((result)=>{
            img.push(result.secure_url);
            data.images=img;
            if(count==data.images.length){
                information_array=data.information.split(', ')
                data.information=information_array
                interest_array=data.interest.split(', ');
                data.interest=interest_array;
                hotelModel.create(data, (err, value)=>{
                    if(err)res.json({code:"01", message:"error creaating hotels", err:err})
                    res.json({code:"00", message:"hotel created successfully"})
                })
            }
        })
    }
   }catch(e){
       console.log(e)
   }
}