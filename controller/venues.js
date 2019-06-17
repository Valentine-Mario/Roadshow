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
 
 exports.addImages=(req, res)=>{
    var id={_id:req.params.id}
    data={
        images:req.files
      }
     try{
        count=[]
        venueModel.findById(id, (err, venue)=>{
            if(err){
                res.json({err:err, code:"01", message:"error getting venue"})
            }else{
                for(i=0; i<data.images.length; i++){
                    
                    cloudinary.uploader.upload(data.images[i].path).then((result)=>{
                        count.push(result.secure_url)
                        venue.images.push(result.secure_url)
                        
                        //track for successful upload then terminate function
                        if(count.length==data.images.length){
                            res.json({code:"00", message:"upload successful"})
                            venue.save()
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
        venueModel.findById(id, (err, value)=>{
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

exports.addAmenities=(req, res)=>{
    var id={_id:req.params.id}
    var amenities=req.body.amenities
    try{
        info_array=amenities.split(', ')
        count=[]
        venueModel.findById(id, (err, venue)=>{
            if(err){
                res.json({code:"01", message:"error getting venue data"})
            }else{
                for(i=0; i<info_array.length; i++){
                    count.push(info_array[i])
                    venue.amenities.push(info_array[i])
                                                
                 if(count.length==info_array.length){
                    res.json({code:"00", message:"additional amenities added successfully"});
                     venue.save()
                    }
                }
            }
        })
    }catch(e){
        console.log(e)
    }
}

exports.removeAmenities=(req, res)=>{
    var id={_id:req.params.id}
    var amenities=req.body.amenities
    try{
        venueModel.findById(id, (err, venue)=>{
            if(err){
                res.json({code:"01", message:"error getting venue from database"})
            }else{
                if(venue.amenities.includes(amenities)){
                var index= venue.amenities.indexOf(amenities)
                venue.amenities.splice(index, 1)
                venue.save()
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

exports.editVenue=(req, res)=>{
    var id={_id:req.params.id}
    var data={
        name:req.body.name,
        location:req.body.location,
        description:req.body.description,
        availability:req.body.availability,
        pricing:req.body.pricing,
        capacity:req.body.capacity,
        type:req.body.type
       } 
       try{
        venueModel.findByIdAndUpdate(id, data, (err)=>{
            if(err)res.json({code:"01", message:"error editing details"})
            res.json({code:"00", message:"venue edited successfully"})
        })
       }catch(e){
           console.log(e)
       }
}

exports.deleteVenue=(req, res)=>{
    var id={_id:req.params.id}
    try{
        venueModel.findByIdAndRemove(id, (err)=>{
            if(err)res.json({code:"01", message:"error deleting venue"})
            res.json({code:"00", message:"venue deleted successfully"})
        })
    }catch(e){
        console.log(e)
    }
}

exports.getVenue=(req, res)=>{
    var {page, limit,}= req.query;
    var options={
        page:parseInt(page, 10) || 1,
        limit:parseInt(limit, 10) || 10,
        sort:{'_id':-1}
}
    try{
        venueModel.paginate({}, options, (err, venue)=>{
            if(err)res.json({code:"01", message:"error getting venue list"})
            res.json({code:"00", message:venue})
        })
    }catch(e){
        console.log(e)
    }
}

exports.getId=(req, res)=>{
    var id={_id:req.params.id}
    try{
        venueModel.findById(id, (err, venue)=>{
            if(err)res.json({code:"01", message:"error getting venue"})
            res.json({code:"00", message:venue})
        })
    }catch(e){
        console.log(e)
    }
}

exports.searchVenue=(req, res)=>{
    var value= req.params.value;
    var {page, limit}= req.query;
   var options={
       page:parseInt(page, 10) || 1,
       limit:parseInt(limit, 10) || 10,
       sort:{'_id':-1}
}
    try{
        venueModel.paginate({"location":{$regex: value, $options: 'gi'}}, options, (err, venue)=>{
            if(err)res.json({code:"01", message:"error returning venue"})
            res.json({code:"00", message:venue})
        })
    }catch(e){
        console.log(e)
    }
}