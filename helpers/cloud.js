require('dotenv').config()
var cloudinary= require('cloudinary')
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });


  class cloud{
    pics_upload(file){
        return new Promise((res, rej)=>{
            cloudinary.uploader.upload(file, function(err, result)=>{
                if(err)rej(err)
                res(result)
            })
        })
    }
  }

  module.exports=new cloud()