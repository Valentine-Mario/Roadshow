var airModel=require('../models/airline')
var cloudinary= require('cloudinary')
require('dotenv').config()
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });


exports.addAirline=(req, res)=>{
    var data={
        name:req.body.name,
        image:req.files[0].path
    }
    try{
        cloudinary.uploader.upload(data.image, function(result_pass){
        }, {resource_type:"image"}).then((result)=>{
            data.image=result.secure_url
            airModel.create(data, (err, value)=>{
                if(err)res.json({code:"01", message:"airline created successfully"})
                res.json({code:"00", message:"airline created successfully"})
            }) 
        })
    }catch(e){
        console.log(e)
    }
}

exports.editImg=(req, res)=>{
    var id={_id:req.params.id}
    data={
        image:req.files[0].path
      }
      try{
        cloudinary.uploader.upload(data.image, function(result_pass){
        }, {resource_type:"image"}).then((result)=>{
            data.image=result.secure_url

            airModel.findByIdAndUpdate(id, data, (err)=>{
                if(err)res.json({code:"01", message:"error updating  picture"})
                res.json({code:"00", message:"picture updated successfully"});
            })
        })
      }catch(e){
          console.log(e)
      }
}
