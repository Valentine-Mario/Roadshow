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

exports.addInfo=(req, res)=>{
    var id={_id:req.params.id}
    var info=req.body.info
    try{
        info_array=info.split(', ')
        count=[]
        carModel.findById(id, (err, car)=>{
            if(err){
                res.json({code:"01", message:"error getting car data"})
            }else{
                for(i=0; i<info_array.length; i++){
                    count.push(info_array[i])
                    car.info.push(info_array[i])
                                                
                 if(count.length==info_array.length){
                    res.json({code:"00", message:"additional information added successfully"});
                     car.save()
                    }
                }
            }
        })
    }catch(e){
        console.log(e)
    }
}

exports.addRequirements=(req, res)=>{
    var id={_id:req.params.id}
    var requirements=req.body.requirements
    try{
        info_array=requirements.split(', ')
        count=[]
        carModel.findById(id, (err, car)=>{
            if(err){
                res.json({code:"01", message:"error getting car data"})
            }else{
                for(i=0; i<info_array.length; i++){
                    count.push(info_array[i])
                    car.requirements.push(info_array[i])
                                                
                 if(count.length==info_array.length){
                    res.json({code:"00", message:"additional information added successfully"});
                     car.save()
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
    var info=req.body.info
    try{
        carModel.findById(id, (err, car)=>{
            if(err){
                res.json({code:"01", message:"error getting car from database"})
            }else{
                if(car.info.includes(info)){

                
                var index= car.info.indexOf(info)
                car.info.splice(index, 1)
                car.save()
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

exports.removeRequirements=(req, res)=>{
    var id={_id:req.params.id}
    var requirements=req.body.requirements
    try{
        carModel.findById(id, (err, car)=>{
            if(err){
                res.json({code:"01", message:"error getting car from database"})
            }else{
                if(car.requirements.includes(requirements)){

                
                var index= car.requirements.indexOf(requirements)
                car.requirements.splice(index, 1)
                car.save()
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

exports.editCar=(req, res)=>{
    var id={_id:req.params.id}
    var data={
        name:req.body.name,
        price:req.body.price,
        supplier_location:req.body.supplier_location,
        description:req.body.description,
    }
    carModel.findByIdAndUpdate(id, data, (err)=>{
        if(err)res.json({code:"01", message:"error editing details"})
        res.json({code:"00", message:"updates made successfully"})
    })
}

exports.deleteCar=(req, res)=>{
    var id={_id:req.params.id}
    try{
        carModel.findByIdAndDelete(id, (err)=>{
            if(err)res.json({code:"01", message:"error deleting car"})
            res.json({code:"00", message:"item deleted successfully"})
        })
    }catch(e){
        console.log(e)
    }
}

exports.getCars=(req, res)=>{
    var {page, limit,}= req.query;
    var options={
        page:parseInt(page, 10) || 1,
        limit:parseInt(limit, 10) || 10,
        sort:{'_id':-1}
}
    carModel.paginate({}, options, (err, cars)=>{
        if(err)res.json({code:"01", err:err, message:"errorm getting cars"})
        res.json({code:"00", message:cars})
    })
}

exports.getCar=(req, res)=>{
    var id={_id:req.params.id}
    try{
        carModel.findById(id, (err, car)=>{
            if(err)res.json({code:"01", message:"error getting car details"})
            res.json({code:"00", message:car})
        })
    }catch(e){
        console.log(e)
    }
}
exports.searchCar=(req, res)=>{
    var {page, limit,}= req.query;
    var options={
        page:parseInt(page, 10) || 1,
        limit:parseInt(limit, 10) || 10,
        sort:{'_id':-1}
    }
    var value= req.params.value;
    try{
        carModel.paginate({$or:[{"name":{$regex: value, $options: 'gi'}}, {"price":{$regex: value, $options: 'gi'}}, {"supplier_location":{$regex: value, $options: 'gi'}}]}, options, (err, car)=>{
            if(err)res.json({code:"01", messaeg:"error returning car"})
            res.json({code:"00", message:car})
        }) 
    }catch(e){
        console.log(e)
    }
}

exports.sortCar=(req, res)=>{
    var {page, limit,}= req.query;
    var options={
        page:parseInt(page, 10) || 1,
        limit:parseInt(limit, 10) || 10,
        sort:{'price':1}
    }
    try{
        carModel.paginate({}, options, (err, value)=>{
            if(err)res.json({code:"01", message:"error getting cars"})
            res.json({code:"00", messaeg:value})
        })
    }catch(e){
        console.log(e)
    }
}