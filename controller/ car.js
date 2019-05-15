var carModel=require('../models/cars');
var cloudinary= require('cloudinary')
require('dotenv').config()
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });


  exports.addCar=(req, res)=>{
      var data={
        name:req.body.name,
        image:req.files[0].path,
        price:req.body.price,
        supplier_location:req.body.supplier_location,
        info:req.body.info,
        requirements:req.body.requirements,
        description:req.body.description,
      }
      try{
        cloudinary.uploader.upload(data.image, function(result_pass){
        }, {resource_type:"image"}).then((result)=>{
            data.image=result.secure_url
            info_array=data.info.split(', ')
            data.info=info_array;
            requirements_array=data.requirements.split(', ')
            data.requirements=requirements_array;
            carModel.create(data, (err, car)=>{
                if(err)res.json({code:"01", message:"error creating car"})
                res.json({code:"00", message:car})
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

            carModel.findByIdAndUpdate(id, data, (err)=>{
                if(err)res.json({code:"01", message:"error updating  picture"})
                res.json({code:"00", message:"picture updated successfully"});
            })
        })
      }catch(e){
          console.log(e)
      }
}