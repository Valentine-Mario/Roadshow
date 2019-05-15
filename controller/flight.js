var flightController=require('../models/flight');
var airlineController=require('../models/airline')

exports.addFlight=(req, res)=>{
    
    var data={
    destination_from:req.body.destination_from,
    destination_to:req.body.destination_to,
    departure_date:req.body.departure_date,
    arrival_date:req.body.arrival_date,
    departure_time:req.body.departure_time,
    arrival_time:req.body.arrival_time,
    airline:'',
    class:req.body.class,
    price:req.body.price
    }
    var id={_id:req.params.id}
    try{
        data.airline=id;
        flightController.create(data, (err, flight)=>{
            if(err)res.json({code:"01", message:"flight created successfully"})
            res.json({code:"00", message:"flight created successfully"})
        })
    }catch(e){
        console.log(e);
    }
}

exports.editFlight=(req, res)=>{
    var data={
        destination_from:req.body.destination_from,
        destination_to:req.body.destination_to,
        departure_date:req.body.departure_date,
        arrival_date:req.body.arrival_date,
        departure_time:req.body.departure_time,
        arrival_time:req.body.arrival_time,
        class:req.body.class,
        price:req.body.price
        }
        var id={_id:req.params.id}
    try{
        flightController.findByIdAndUpdate(id, data, (err)=>{
            if(err)res.json({code:"01", message:"error updating flight"})
            res.json({code:"00", message:"flight updated successfully"})
        })
    }catch(e){

    }
}

exports.deleteFlight=(req, res)=>{
    var id={_id:req.params.id}
    try{
        flightController.findByIdAndDelete(id, (err)=>{
            if(err)res.json({code:"01", message:"error deleting flight"})
            res.json({code:"00", message:"flight deleted successfully"})
        })
    }catch(e){
        console.log(e)
    }
}

exports.getAllFlight=(req, res)=>{
    var {page, limit,}= req.query;
    var options={
        page:parseInt(page, 10) || 1,
        limit:parseInt(limit, 10) || 10,
        sort:{'_id':-1},
        populate:'airline'
    }
    try{
        flightController.paginate({}, options, (err, flight)=>{
            if(err)res.json({code:"01", message:"error getting flight"})
            res.json({code:"00", message:flight})
        })
    }catch(e){
        console.log(e)
    }
}

exports.getFlightId=(req, res)=>{
    var id={_id:req.params.id}
    try{
        flightController.findById(id, (err, flight)=>{
            if(err)res.json({code:"01", message:"error getting flight"})
            res.json({code:"00", message:flight})
        }).populate('airline')
    }catch(e){
        console.log(e)
    }
}

exports.getFlightForAirline= (req, res)=>{
    var id={_id:req.params.id}
    var {page, limit,}= req.query;
    var options={
        page:parseInt(page, 10) || 1,
        limit:parseInt(limit, 10) || 10,
        sort:{'_id':-1},
        populate:'airline'
    }
    try{
        flightController.paginate({airline:id}, options, (err, flight)=>{
            if(err)res.json({code:"01", message:"error getting flight"})
            res.json({code:"00", message:flight})
        })
    }catch(e){
        console.log(e)
    }
}

exports.sortDestination=(req, res)=>{
    var value= req.params.value;
    var value2= req.params.value2
    var {page, limit}= req.query;
   var options={
       page:parseInt(page, 10) || 1,
       limit:parseInt(limit, 10) || 10,
       sort:{'_id':-1},
       populate:'airline'
}
    try{
       flightController.paginate({$and:[{"destination_from":{$regex: value, $options: 'gi'}}, {"destination_to":{$regex: value2, $options: 'gi'}}]}, options, (err, flight)=>{
           if(err)res.json({code:"01", message:"error getting flights"});
           res.json({code:"00", message:flight})
       }) 
    }catch(e){
        console.log(e)
    }
}

exports.sortClass=(req, res)=>{
    var value= req.params.value;
    var {page, limit}= req.query;
   var options={
       page:parseInt(page, 10) || 1,
       limit:parseInt(limit, 10) || 10,
       sort:{'_id':-1},
       populate:'airline'
}
        try{
            flightController.paginate({"class":{$regex: value, $options: 'gi'}}, options, (err, flight)=>{
                if(err)res.json({code:"01", message:"error getting flight"})
                res.json({code:"00", message:flight})
            })
        }catch(e){
            console.log(e)
        }
}
