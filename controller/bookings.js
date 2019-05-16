const userModel=require('../models/user')
const bookingModel=require('../models/booking')
const carModel=require('../models/cars')
const flightModel=require('../models/flight')
const hotelModel=require('../models/hotels')
const roomModel=require('../models/rooms')
const venueModel=require('../models/venues')
const jwt=require('jsonwebtoken')

exports.addHotelBooking=(req, res)=>{
    var data={
        type:'Hotel Room Booking',
        details:``,
        start_date:req.body.start_date,
        end_date:req.body.end_date
    }
    var id={_id:req.params.id}
    try{
        jwt.verify(req.token, "golden_little_kids", (err, decoded_user)=>{
            userModel.findById(decoded_user.user, (err, user)=>{
                if(err){
                    res.json({code:"01", message:"error getting user information"})
                }else{
                    hotelModel.find({rooms:id._id}, (err, hotel)=>{
                        
                        roomModel.findById(id, (err, room)=>{
                            data.details=`Your booking at ${hotel[0].name} at ${hotel[0].location} in room type ${room.type} at the price of ${room.price} has been booked.`
                            bookingModel.create(data, (err, booking)=>{
                                if(err){
                                    res.json({code:"01", message:"error creating booking"})
                                }else{
                                    user.activity.push(booking);
                                    user.save();
                                    res.json({code:"00", message:"booking created successfully"})
                                }
                            })
                        })
                    })
                }
            })
        })
    }catch(e){
        console.log(e)
    }
}

exports.addHotelBooking_nonUser=(req, res)=>{
    var data={
        type:'Hotel Room Booking',
        details:``,
        start_date:req.body.start_date,
        end_date:req.body.end_date
    }
    var id={_id:req.params.id}
    try{
                    hotelModel.find({rooms:id._id}, (err, hotel)=>{
                        
                        roomModel.findById(id, (err, room)=>{
                            data.details=`Your booking at ${hotel[0].name} at ${hotel[0].location} in room type ${room.type} at the price of ${room.price} has been booked.`
                            bookingModel.create(data, (err, booking)=>{
                                if(err){
                                    res.json({code:"01", message:"error creating booking"})
                                }else{
                                    res.json({code:"00", message:"booking created successfully"})
                                }
                            })
                        })
                    })
    }catch(e){
        console.log(e)
    }
}

exports.addCarBooking=(req, res)=>{
    var data={
        type:'Car Rental Booking',
        details:``,
        start_date:req.body.start_date,
        end_date:req.body.end_date
    }
    var id={_id:req.params.id}
    try{
        jwt.verify(req.token, "golden_little_kids", (err, decoded_user)=>{
            userModel.findById(decoded_user.user, (err, user)=>{
                carModel.findById(id, (err, car)=>{
                    data.details=`Your car rental of ${car.name} from ${car.supplier_location} at the price of ${car.price} has been booked`
                    bookingModel.create(data, (err, booking)=>{
                        user.activity.push(booking);
                        user.save();
                        res.json({code:"00", message:"booking created successfully"})
                    })
                })
            })
        })
    }catch(e){
        console.log(e)
    }
}

exports.addCarBooking_nonUser=(req, res)=>{
    var data={
        type:'Car Rental Booking',
        details:``,
        start_date:req.body.start_date,
        end_date:req.body.end_date
    }
    var id={_id:req.params.id}
    try{
                carModel.findById(id, (err, car)=>{
                    data.details=`Your car rental of ${car.name} from ${car.supplier_location} at the price of ${car.price} has been booked`
                    bookingModel.create(data, (err, booking)=>{
                        res.json({code:"00", message:"booking created successfully"})
                    })
                })
    }catch(e){
        console.log(e)
    }
}


exports.addVenueBooking=(req, res)=>{
    var data={
        type:'Venue Rental',
        details:``,
        start_date:req.body.start_date,
        end_date:req.body.end_date
    }
    var id={_id:req.params.id}
    try{
        jwt.verify(req.token, "golden_little_kids", (err, decoded_user)=>{
            userModel.findById(decoded_user.user, (err, user)=>{
                venueModel.findById(id, (err, venue)=>{
                    data.details=`Your venue ${venue.name} at ${venue.location} at the price of ${venue.pricing} has been booked`
                    bookingModel.create(data, (err, booking)=>{
                        user.activity.push(booking);
                        user.save();
                        res.json({code:"00", message:"booking created successfully"})
                    })
                })
            })
        })
    }catch(e){
        console.log(e)
    }
}
exports.removeBooking=(req, res)=>{
    var index=req.body.index
    try{
        jwt.verify(req.token, "golden_little_kids", (err, decoded_user)=>{
            userModel.findById(decoded_user.user, (err, user)=>{
                if(err){
                    res.json({code:"01", err:err, message:"error getting user information"})
                }else{
                    var num=parseInt(index)
                    user.activity.splice(num, 1)
                    user.save();
                    res.json({code:"01", message:"booking removed successfully"})
                }
            })
        })
    }catch(e){
        console.log(e)
    }
}