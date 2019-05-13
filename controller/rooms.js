var roomModel= require('../models/rooms');
var hotelModel=require('../models/hotels')
var cloudinary= require('cloudinary')
require('dotenv').config()
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });


exports.addRoom=(req, res)=>{
    var data={
   images:req.files[0].path,
   price:req.body.price,
   perks:req.body.perks,
   available:req.body.available,
   type:req.body.type
    }
    var id={_id:req.params.id}
    try{
     hotelModel.findById(id, (err, hotel)=>{
         if(err){
             res.json({code:"01", message:"error getting hotel details"})
         }else{
             cloudinary.uploader.upload(data.images, function(result_pass){
            }, {resource_type:"image"}).then((result)=>{
                data.images=result.secure_url
                var perks_array=data.perks.split(', ')
                data.perks=perks_array;
                roomModel.create(data, (err, room)=>{
                    if(err){
                        res.json({code:"01", message:"error creating rooms"})
                    }else{
                        hotel.rooms.push(room._id)
                        res.json({code:"00", message:room})
                        hotel.save();
                    }
                })
            })
         }
     })
    }catch(e){
        console.log(e)
    }
}

exports.addPerks=(req, res)=>{
    var id={_id:req.params.id}
    var perks=req.body.perks
    try{
        perks_array=perks.split(', ')
        count=[]
        roomModel.findById(id, (err, room)=>{
            if(err){
                res.json({code:"01", message:"error getting room data"})
            }else{
                for(i=0; i<perks_array.length; i++){
                    count.push(perks_array[i])
                    room.perks.push(perks_array[i])
                                                
                 if(count.length==perks_array.length){
                    res.json({code:"00", message:"additional data added successfully"});
                     room.save()
                    }
                }
            }
        })
    }catch(e){
        console.log(e)
    }
}

exports.removePerks=(req, res)=>{
    var id={_id:req.params.id}
    var perks=req.body.perks
    try{
        roomModel.findById(id, (err, room)=>{
            if(err){
                res.json({code:"01", messagse:"error getting room details"})
            }else{
                if(room.perks.includes(perks)){
                    var index= room.perks.indexOf(perks)
                    room.perks.splice(index, 1)
                    room.save()
                    res.json({code:"00", message:"item successfully removed"})
                }else{
                    res.json({code:"01", message:"item dosen't exist"})
                }
            }
        })
    }catch(e){
        console.log(e)
    }
}

exports.editRoom=(req, res)=>{
    var data={
        price:req.body.price,
        available:req.body.available,
        type:req.body.type
    }
    var id={_id:req.params.id}
    try{
        roomModel.findByIdAndUpdate(id, data, (err)=>{
            if(err)res.json({code:"01", message:"error editing details"})
            res.json({code:"00", message:"details updated successfully"})
        })
    }catch(e){
        console.log(e)
    }
}

exports.editImg=(req, res)=>{
    var id={_id:req.params.id}
    data={
        images:req.files[0].path
      }
      try{
          console.log(data.images)
        cloudinary.uploader.upload(data.images, function(result_pass){
        }, {resource_type:"image"}).then((result)=>{
            data.images=result.secure_url

            roomModel.findByIdAndUpdate(id, data, (err)=>{
                if(err)res.json({code:"01", message:"error updating  picture"})
                res.json({code:"00", message:"picture updated successfully"});
            })
        })
      }catch(e){
          console.log(e)
      }
}

exports.getRoom=(req, res)=>{
    var {page, limit,}= req.query;
    var options={
        page:parseInt(page, 10) || 1,
        limit:parseInt(limit, 10) || 10,
        sort:{'_id':-1}
}
    try{
        roomModel.paginate({}, options, (err, value)=>{
            if(err)res.json({code:"01", message:"error getting rooms"})
            res.json({code:"00", message:value})
        })
    }catch(e){
        console.log(e)
    }
}

exports.getRoomId=(req, res)=>{
    var id={_id:req.params.id}
    try{
        roomModel.findById(id, (err, room)=>{
            if(err)res.json({code:"01", message:"error getting room details"})
            res.json({code:"00", message:room})
        })
    }catch(e){
        console.log(e)
    }
}

exports.removeRoom=(req, res)=>{
    var id={_id:req.params.id}
    try{
        roomModel.findByIdAndRemove(id, (err)=>{
            if(err)res.json({code:"01", message:"error deleting room"})
            res.json({code:"00", message:"room deleted successfully"})
        })
    }catch(e){
        console.log(e)
    }
}