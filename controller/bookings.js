const userModel=require('../models/user')
const bookingModel=require('../models/booking')
const carModel=require('../models/cars')
const flightModel=require('../models/flight')
const hotelModel=require('../models/hotels')
const roomModel=require('../models/rooms')
const venueModel=require('../models/venues')
const jwt=require('jsonwebtoken')
const flightBookingModel=require('../models/flight-booking')
const HotelBookingModel=require('../models/hotel-booking')
const carBookingModel=require('../models/car-booking')
const venueBookingModel=require('../models/venue-booking')
exports.addHotelBooking=(req, res)=>{
    var data={
        type:'Hotel',
        start_date:new Date(req.body.start_date),
        end_date:new Date(req.body.end_date),
        duration:0,
        hotel_id:'',
        price:'',
        roomType:'',
        user:'',
        no_of_rooms:req.body.no_of_people,
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
                            data.duration=parseInt((data.end_date-data.start_date)/(1000*60*60*24))+1
                            data.price=parseInt(room.price)*data.duration*parseInt(data.no_of_rooms);
                            var obj={
                                name:'Hotel',
                                details:`Hotel at ${hotel[0].name} located at ${hotel[0].location}, 
                                price is ${data.price} duration is ${data.duration} in days
                                room type is ${room.type}`,
                                start_date:data.start_date,
                                end_date:data.end_date 
                            }
                            data.hotel_id=hotel[0]._id;
                            
                            data.roomType=room.type
                            data.user=user._id
                            HotelBookingModel.create(data, (err, hotelBooking)=>{
                                if(err){
                                    res.status(401).json({code:"01", err:err, message:"error creating booking"})
                                }else{
                                    user.activity.push(obj);
                                    user.save();
                                    res.status(200).json({code:"00", message:"hotel booking created successfully"})
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
        type:'Hotel',
        start_date:new Date(req.body.start_date),
        end_date:new Date(req.body.end_date),
        duration:0,
        hotel_id:'',
        price:'',
        roomType:'',
        user:null,
        no_of_rooms:req.body.no_of_people,
    }
    var id={_id:req.params.id}
    try{
                    hotelModel.find({rooms:id._id}, (err, hotel)=>{
                        
                        roomModel.findById(id, (err, room)=>{
                            data.duration=parseInt((data.end_date-data.start_date)/(1000*60*60*24))+1
                            data.price=parseInt(room.price)*data.duration*parseInt(data.no_of_rooms);
                            data.hotel_id=hotel[0]._id;
                            data.roomType=room.type
                            data.user=user._id
                            HotelBookingModel.create(data, (err, hotelBooking)=>{
                                if(err){
                                    res.status(401).json({code:"01", err:err, message:"error creating booking"})
                                }else{
                                    
                                    res.status(200).json({code:"00", message:"hotel booking created successfully"})
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
        type:'Car',
        start_date:new Date(req.body.start_date),
        end_date:new Date(req.body.end_date),
        duration:0,
        car_id:'',
        user:'',
        price:'',
        quantity:req.body.quantity
    }
    var id={_id:req.params.id}
    try{
        jwt.verify(req.token, "golden_little_kids", (err, decoded_user)=>{
            userModel.findById(decoded_user.user, (err, user)=>{
                carModel.findById(id, (err, car)=>{
                    data.duration=parseInt((data.end_date-data.start_date)/(1000*60*60*24))+1
                    data.price=data.duration*parseInt(car.price)*parseInt(quantity) 
                    var obj={
                        name:'Car',
                        details:`Car rental of ${car.name} at ${car.supplier_location}
                        for the price of ${data.price} for ${data.quantity} quantity for the duration of ${data.duration} in days`,
                        start_date:data.start_date,
                        end_date:data.end_date 
                    }
                    data.car_id=car._id;
                    data.user=user._id;
                    carBookingModel.create(data, (err, carBooking)=>{
                        if(err){
                            res.status(401).json({code:"01", err:err, message:"error creating booking"})
                        }else{
                            user.activity.push(obj);
                            user.save();
                            res.status(200).json({code:"00", message:"car booking created successfully"})
                        }
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
        type:'Car',
        start_date:new Date(req.body.start_date),
        end_date:new Date(req.body.end_date),
        duration:0,
        car_id:'',
        user:null,
        price:'',
        quantity:req.body.quantity
    }
    var id={_id:req.params.id}
    try{
                carModel.findById(id, (err, car)=>{
                    data.duration=parseInt((data.end_date-data.start_date)/(1000*60*60*24))+1
                    data.price=data.duration*parseInt(car.price)*parseInt(quantity) 
                    data.car_id=car._id;
                    carBookingModel.create(data, (err, carBooking)=>{
                        if(err){
                            res.status(401).json({code:"01", err:err, message:"error creating booking"})
                        }else{
                            res.status(200).json({code:"00", message:"car booking created successfully"})
                        }
                    })
                })
    }catch(e){
        console.log(e)
    }
}


exports.addVenueBooking=(req, res)=>{
    var data={
        type:'Venue',
        start_date:new Date(req.body.start_date),
        end_date:new Date(req.body.end_date),
        duration:0,
        venue_id:'',
        user:'',
        price:''
    }
    var id={_id:req.params.id}
    try{
        jwt.verify(req.token, "golden_little_kids", (err, decoded_user)=>{
            userModel.findById(decoded_user.user, (err, user)=>{
                venueModel.findById(id, (err, venue)=>{
                    data.duration=parseInt((data.end_date-data.start_date)/(1000*60*60*24))+1
                    data.venue_id=venue._id;
                    data.user=user._id;
                    data.price=parseInt(venue.pricing)*data.duration
                    var obj={
                        name:'Venue',
                        details:`Venue rental at ${venue.name} at ${venue.location}
                        with ${venue.capacity} capacity, at the price of 
                        ${data.price} for the duration of ${data.duration} in days`,
                        start_date:data.start_date,
                        end_date:data.end_date 
                    }
                    venueBookingModel.create(data, (err, venueBooking)=>{
                        if(err){
                            res.status(401).json({code:"01", err:err, message:"error creating booking"})
                        }else{
                            user.activity.push(obj);
                            user.save();
                            res.status(200).json({code:"00", message:"venue booking created successfully"})
                        }
                    })
                })
            })
        })
    }catch(e){
        console.log(e)
    }
}

exports.addVenueBooking_nonUser=(req, res)=>{
    var data={
        type:'Venue',
        start_date:new Date(req.body.start_date),
        end_date:new Date(req.body.end_date),
        duration:0,
        venue_id:'',
        user:null,
        price:''
    }
    var id={_id:req.params.id}
    try{
                venueModel.findById(id, (err, venue)=>{
                    data.duration=parseInt((data.end_date-data.start_date)/(1000*60*60*24))+1
                    data.venue_id=venue._id;
                    data.user=user._id
                    data.price=parseInt(venue.pricing)*data.duration
                    venueBookingModel.create(data, (err, venueBooking)=>{
                        if(err){
                            res.status(401).json({code:"01", err:err, message:"error creating booking"})
                        }else{
                            res.status(200).json({code:"00", message:"venue booking created successfully"})
                        }
                    })
                })
       
    }catch(e){
        console.log(e)
    }
}

exports.addFlight=(req, res)=>{
    var data={
        type:'Flight',
        flight_id:'',
        user:'',
        no_of_people:req.body.no_of_people,
        price:''
    }
    var id={_id:req.params.id}
    try{
        jwt.verify(req.token, "golden_little_kids", (err, decoded_user)=>{
            userModel.findById(decoded_user.user, (err, user)=>{
                flightModel.findById(id, (err, flight)=>{
                    data.price=parseInt(data.no_of_people)*parseInt(flight.price) 
                    var obj={
                        name:'Flight',
                        details:`Flight from ${flight.destination_from} to ${flight.destination_to},
                        departure airport is ${flight.departure_airport} and arrival airport 
                        is ${flight.arrival_airport}. Price is ${data.price} for
                        ${data.no_of_people} person(s), airline is ${flight.airline.name}`,
                        start_date:flight.departure_date,
                        end_date:flight.arrival_date
                    }

                    data.flight_id=flight._id,
                    data.user=user._id
                    flightBookingModel.create(data, (err, flightBooking)=>{
                        if(err){
                            res.status(401).json({code:"01", message:"error creating booking"})
                        }else{
                            user.activity.push(obj);
                            user.save();
                            res.status(200).json({code:"00", message:"flight booking created successfully"})
                        }
                        })
                    
                }).populate('airline')
            })
        }) 
    }catch(e){
        console.log(e)
    }
}

exports.addFlight_nonUser=(req, res)=>{
    var data={
        type:'Flight',
        flight_id:'',
        user:null,
        no_of_people:req.body.no_of_people,
        price:''
    }
    try{
                flightModel.findById(id, (err, flight)=>{
                    data.flight_id=flight._id
                    data.price=parseInt(data.no_of_people)*parseInt(flight.price) 
                    flightBookingModel.create(data, (err, flightBooking)=>{
                        if(err)res.status(401).json({code:"01", message:"error creating booking"})
                        res.status(200).json({code:"00", message:"flight booking created successfully"})
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
