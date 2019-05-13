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

exports.addImages=(req, res)=>{
    var id={_id:req.params.id}
    data={
        images:req.files
      }
    try{
        count=[]
        hotelModel.findById(id, (err, hotel)=>{
            if(err){
                res.json({err:err, code:"01", message:"error getting hotel"})
            }else{
                for(i=0; i<data.images.length; i++){
                    
                    cloudinary.uploader.upload(data.images[i].path).then((result)=>{
                        count.push(result.secure_url)
                        hotel.images.push(result.secure_url)
                        
                        //track for successful upload then terminate function
                        if(count.length==data.images.length){
                            res.json({code:"00", message:"upload successful"})
                            hotel.save()
                        }
                    })
                } 
            }
        })

    }catch(e){
        console.log(e)
    }
}

exports.removeImg=(req, res)=>{
    var id={_id:req.params.id}
    data={
        images:req.body.images
      }
    try{
        hotelModel.findById(id, (err, value)=>{
            if(err){
                res.json({code:"00", error:err, message:"error getting data"})
            }else{
                if(value.images.includes(data.images)){
                var index= value.images.indexOf(data.images)
                value.images.splice(index, 1)
                value.save()
                res.json({code:"00", message:"image successfully removed"})
                }else{
                    res.json({code:"01", message:"image not found"})
                }
            }
        })
    }catch(e){
        console.log(e)
    }
}

exports.addInfo=(req, res)=>{
    var id={_id:req.params.id}
    var information=req.body.information
    try{
        info_array=information.split(', ')
        count=[]
        hotelModel.findById(id, (err, hotel)=>{
            if(err){
                res.json({code:"01", message:"error getting hotel data"})
            }else{
                for(i=0; i<info_array.length; i++){
                    count.push(info_array[i])
                    hotel.information.push(info_array[i])
                                                
                 if(count.length==info_array.length){
                    res.json({code:"00", message:"additional information added successfully"});
                     hotel.save()
                    }
                }
            }
        })
    }catch(e){
        console.log(e)
    }
}

exports.removeInfo=(req, res)=>{
    var id={_id:req.params.id}
    var information=req.body.information
    try{
        hotelModel.findById(id, (err, hotel)=>{
            if(err){
                res.json({code:"01", message:"error getting hotel from database"})
            }else{
                if(hotel.information.includes(information)){

                
                var index= hotel.information.indexOf(information)
                hotel.information.splice(index, 1)
                hotel.save()
                res.json({code:"00", message:"item successfully removed"})
                }else{
                    res.json({code:"01", message:"item not found"})
                }
            }
        })
    }catch(e){
        console.log(e)
    }
}

exports.addInterest=(req, res)=>{
    var id={_id:req.params.id}
    var interest=req.body.interest
    try{
        interest_array=interest.split(', ')
        count=[]
        hotelModel.findById(id, (err, hotel)=>{
            if(err){
                res.json({code:"01", message:"error getting hotel data"})
            }else{
                for(i=0; i<interest_array.length; i++){
                    count.push(interest_array[i])
                    hotel.interest.push(interest_array[i])
                                                
                 if(count.length==interest_array.length){
                    res.json({code:"00", message:"additional interest added successfully"});
                     hotel.save()
                    }
                }
            }
        })
    }catch(e){
        console.log(e)
    }
}

exports.removeInterest=(req, res)=>{
    var id={_id:req.params.id}
    var interest=req.body.interest
    try{
        hotelModel.findById(id, (err, hotel)=>{
            if(err){
                res.json({code:"01", message:"error getting hotel from database"})
            }else{
                if(hotel.interest.includes(interest)){

                
                var index= hotel.interest.indexOf(interest)
                hotel.interest.splice(index, 1)
                hotel.save()
                res.json({code:"00", message:"item successfully removed"})
                }else{
                    res.json({code:"01", message:"item not found"})
                }
            }
        })
    }catch(e){
        console.log(e)
    }
}
