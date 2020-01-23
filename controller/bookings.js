const userModel=require('../models/user')
const carModel=require('../models/cars')
const flightModel=require('../models/flight')
const hotelModel=require('../models/hotels')
const roomModel=require('../models/rooms')
const venueModel=require('../models/venues')
const auth_user=require('../helpers/auth')
const BookingModel=require('../models/user-booking')

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
        no_of_rooms:req.body.no_of_rooms,
        car_id:null,
        quantity:'-',
        venue_id:null,
        flight_id:null, 
        no_of_people:'-',
        pending:'',
        declined:false
    }
    var id={_id:req.params.id}
    try{
        auth_user.verifyToken(req.token).then(decoded_user=>{
            userModel.findById(decoded_user._id, (err, user)=>{
                if(err){
                    res.json({code:"01", message:"error getting user information"})
                }else{
                    hotelModel.find({rooms:id._id}, (err, hotel)=>{
                        
                        roomModel.findById(id, (err, room)=>{
                            data.duration=parseInt((data.end_date-data.start_date)/(1000*60*60*24))+1
                            var room_price=room.price.replace(/^\D+/g, '')
                            
                            data.price=parseInt(room_price)*parseInt(data.duration)*parseInt(data.no_of_rooms);
                            data.hotel_id=hotel[0]._id;
                            data.roomType=room.type
                            data.user=user._id
                            user.account_type=='Business' ? data.pending=true:data.pending=false

                            BookingModel.create(data, (err, hotelBooking)=>{
                                if(err){
                                    res.status(501).json({code:"01", err:err, message:"error creating booking"})
                                }else{
                                   
                                    res.status(200).json({code:"00", message:"hotel booking created successfully"})
                                }
                            })
                        })
                    })
                }
            })
        })
           
        
    }catch(e){
        res.status(500)
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
        user:'',
        no_of_rooms:req.body.no_of_rooms,
        car_id:null,
        quantity:'-',
        venue_id:null,
        flight_id:null, 
        no_of_people:'-',
        pending:false,
        declined:false
    }
    var id={_id:req.params.id}
    try{
                    hotelModel.find({rooms:id._id}, (err, hotel)=>{
                        
                        roomModel.findById(id, (err, room)=>{
                            data.duration=parseInt((data.end_date-data.start_date)/(1000*60*60*24))+1
                            var room_price=room.price.replace(/^\D+/g, '')
                            data.price=parseInt(room_price)*data.duration*parseInt(data.no_of_rooms);
                            data.hotel_id=hotel[0]._id;
                            data.roomType=room.type
                            data.user=null
                            BookingModel.create(data, (err, hotelBooking)=>{
                                if(err){
                                    res.status(501).json({code:"01", err:err, message:"error creating booking"})
                                }else{
                                    
                                    res.status(200).json({code:"00", message:"hotel booking created successfully"})
                                }
                            })
                        })
                    })
    }catch(e){
       res.status(500)
    }
}

exports.addHotelBookingInvitedUser=(req, res)=>{
    var data={
        type:'Hotel',
        start_date:new Date(req.body.start_date),
        end_date:new Date(req.body.end_date),
        duration:0,
        hotel_id:'',
        price:'',
        roomType:'',
        user:'',
        no_of_rooms:req.body.no_of_rooms,
        car_id:null,
        quantity:'-',
        venue_id:null,
        flight_id:null, 
        no_of_people:'-',
        pending:'',
        declined:false
    }
    var id={_id:req.params.id}
    try{
        auth_user.verifyInviteToken(req.token).then(decoded_user=>{
            userModel.findById(decoded_user.user, (err, user)=>{
                if(err){
                    res.json({code:"01", message:"error getting user information"})
                }else{
                    hotelModel.find({rooms:id._id}, (err, hotel)=>{
                        
                        roomModel.findById(id, (err, room)=>{
                            
                            data.duration=parseInt((data.end_date-data.start_date)/(1000*60*60*24))+1
                            var room_price=room.price.replace(/^\D+/g, '')
                            
                            data.price=parseInt(room_price)*parseInt(data.duration)*parseInt(data.no_of_rooms);
                            data.hotel_id=hotel[0]._id;
                            data.roomType=room.type
                            data.user=user._id
                            if(decoded_user.limit==='No'||decoded_user.limit==undefined){
                                data.pending=false
                               
                            }else if(decoded_user.limit==='Yes'){
                                data.pending=true
                            }else{
                                data.price>decoded_user.limit_amount ?data.pending=true:data.pending=false
                            }
                            BookingModel.create(data, (err, hotelBooking)=>{
                                if(err){
                                    res.status(501).json({code:"01", err:err, message:"error creating booking"})
                                }else{
                                   
                                    res.status(200).json({code:"00", message:"hotel booking created successfully"})
                                }
                            })
                        })
                    })
                }
            })
        })
    }catch(e){
        res.status(500)
    }
}

exports.addCarBooking=(req, res)=>{
    var data={
        type:'Car',
        start_date:new Date(req.body.start_date),
        end_date:new Date(req.body.end_date),
        duration:0,
        hotel_id:null,
        price:'',
        roomType:'-',
        user:'',
        no_of_rooms:null,
        car_id:'',
        quantity:req.body.quantity,
        venue_id:null,
        flight_id:null, 
        no_of_people:'-',
        pending:'',
        declined:false
    }
    var id={_id:req.params.id}
    try{
        auth_user.verifyToken(req.token).then(decoded_user=>{
            userModel.findById(decoded_user._id, (err, user)=>{
                carModel.findById(id, (err, car)=>{
                    data.duration=parseInt((data.end_date-data.start_date)/(1000*60*60*24))+1
                    var car_price=car.price.replace(/^\D+/g, '')
                    data.price=data.duration * parseInt(car_price)*parseInt(data.quantity) 
                    data.car_id=car._id;
                    data.user=user._id;
                    user.account_type=='Business' ? data.pending=true:data.pending=false
                    BookingModel.create(data, (err, carBooking)=>{
                        if(err){
                            res.status(501).json({code:"01", err:err, message:"error creating booking"})
                        }else{
                            res.status(200).json({code:"00", message:"car booking created successfully"})
                        }
                    })
                })
            })
        })
    }catch(e){
        res.status(500)
    }
}

exports.addCarBooking_nonUser=(req, res)=>{
    var data={
        type:'Car',
        start_date:new Date(req.body.start_date),
        end_date:new Date(req.body.end_date),
        duration:0,
        hotel_id:null,
        price:'',
        roomType:'-',
        user:'',
        no_of_rooms:null,
        car_id:'',
        quantity:req.body.quantity,
        venue_id:null,
        flight_id:null, 
        no_of_people:'-',
        pending:false,
        declined:false
    }
    var id={_id:req.params.id}
    try{
                carModel.findById(id, (err, car)=>{
                    data.duration=parseInt((data.end_date-data.start_date)/(1000*60*60*24))+1
                    var car_price=car.price.replace(/^\D+/g, '')
                    data.price=data.duration*parseInt(car_price)*parseInt(data.quantity) 
                    data.car_id=car._id;
                    data.user=null
                    BookingModel.create(data, (err, carBooking)=>{
                        if(err){
                            res.status(501).json({code:"01", err:err, message:"error creating booking"})
                        }else{
                            res.status(200).json({code:"00", message:"car booking created successfully"})
                        }
                    })
                })
    }catch(e){
        res.status(500)
    }
}

exports.addCarBookingInvitedUser=(req, res)=>{
    var data={
        type:'Car',
        start_date:new Date(req.body.start_date),
        end_date:new Date(req.body.end_date),
        duration:0,
        hotel_id:null,
        price:'',
        roomType:'-',
        user:'',
        no_of_rooms:null,
        car_id:'',
        quantity:req.body.quantity,
        venue_id:null,
        flight_id:null, 
        no_of_people:'-',
        pending:'',
        declined:false
    }
    var id={_id:req.params.id}
    try{
        auth_user.verifyInviteToken(req.token).then(decoded_user=>{
            userModel.findById(decoded_user.user, (err, user)=>{
                carModel.findById(id, (err, car)=>{
                    data.duration=parseInt((data.end_date-data.start_date)/(1000*60*60*24))+1
                    var car_price=car.price.replace(/^\D+/g, '')
                    data.price=data.duration * parseInt(car_price)*parseInt(data.quantity) 
                    data.car_id=car._id;
                    data.user=user._id;
                    if(decoded_user.limit==='No'||decoded_user.limit==undefined){
                        data.pending=false
                       
                    }else if(decoded_user.limit==='Yes'){
                        data.pending=true
                    }else{
                        data.price>decoded_user.limit_amount ?data.pending=true:data.pending=false
                    }
                    BookingModel.create(data, (err, carBooking)=>{
                        if(err){
                            res.status(501).json({code:"01", err:err, message:"error creating booking"})
                        }else{
                            res.status(200).json({code:"00", message:"car booking created successfully"})
                        }
                    })
                })
            })
        })
    }catch(e){
        res.status(500)
    }
}

exports.addVenueBooking=(req, res)=>{
    var data={
        type:'Venue',
        start_date:new Date(req.body.start_date),
        end_date:new Date(req.body.end_date),
        duration:0,
        hotel_id:null,
        price:'',
        roomType:'-',
        user:'',
        no_of_rooms:null,
        car_id:null,
        quantity:'-',
        venue_id:'',
        flight_id:null, 
        no_of_people:'-',
        pending:'',
        declined:false
    }
    var id={_id:req.params.id}
    try{
        auth_user.verifyToken(req.token).then(decoded_user=>{
            userModel.findById(decoded_user._id, (err, user)=>{
                venueModel.findById(id, (err, venue)=>{
                    data.duration=parseInt((data.end_date-data.start_date)/(1000*60*60*24))+1
                    data.venue_id=venue._id;
                    data.user=user._id;
                    var venue_price=venue.pricing.replace(/^\D+/g, '')
                    data.price=parseInt(venue_price)*data.duration
                    user.account_type=='Business' ? data.pending=true:data.pending=false

                    BookingModel.create(data, (err, venueBooking)=>{
                        if(err){
                            res.status(501).json({code:"01", err:err, message:"error creating booking"})
                        }else{
                           
                            res.status(200).json({code:"00", message:"venue booking created successfully"})
                        }
                    })
                })
            })
        })
    }catch(e){
       res.status(500)
    }
}

exports.addVenueBooking_nonUser=(req, res)=>{
    var data={
        type:'Venue',
        start_date:new Date(req.body.start_date),
        end_date:new Date(req.body.end_date),
        duration:0,
        hotel_id:null,
        price:'',
        roomType:'-',
        user:'',
        no_of_rooms:null,
        car_id:null,
        quantity:'-',
        venue_id:'',
        flight_id:null, 
        no_of_people:'-',
        pending:false,
        declined:false
    }
    var id={_id:req.params.id}
    try{
                venueModel.findById(id, (err, venue)=>{
                    data.duration=parseInt((data.end_date-data.start_date)/(1000*60*60*24))+1
                    data.venue_id=venue._id;
                    data.user=null
                    var venue_price=venue.pricing.replace(/^\D+/g, '')
                    data.price=parseInt(venue_price)*data.duration
                    BookingModel.create(data, (err, venueBooking)=>{
                        if(err){
                            res.status(501).json({code:"01", err:err, message:"error creating booking"})
                        }else{
                            res.status(200).json({code:"00", message:"venue booking created successfully"})
                        }
                    })
                })
       
    }catch(e){
        res.status(500)
    }
}

exports.addVenueBookingInvitedUser=(req, res)=>{
    var data={
        type:'Venue',
        start_date:new Date(req.body.start_date),
        end_date:new Date(req.body.end_date),
        duration:0,
        hotel_id:null,
        price:'',
        roomType:'-',
        user:'',
        no_of_rooms:null,
        car_id:null,
        quantity:'-',
        venue_id:'',
        flight_id:null, 
        no_of_people:'-',
        pending:'',
        declined:false
    }
    var id={_id:req.params.id}
    try{
        auth_user.verifyInviteToken(req.token).then(decoded_user=>{
            userModel.findById(decoded_user.user, (err, user)=>{
                venueModel.findById(id, (err, venue)=>{
                    data.duration=parseInt((data.end_date-data.start_date)/(1000*60*60*24))+1
                    data.venue_id=venue._id;
                    data.user=user._id;
                    var venue_price=venue.pricing.replace(/^\D+/g, '')
                    data.price=parseInt(venue_price)*data.duration
                    user.account_type=='Business' ? data.pending=true:data.pending=false
                    if(decoded_user.limit==='No'||decoded_user.limit==undefined){
                        data.pending=false
                       
                    }else if(decoded_user.limit==='Yes'){
                        data.pending=true
                    }else{
                        data.price>decoded_user.limit_amount ?data.pending=true:data.pending=false
                    }
                    BookingModel.create(data, (err, venueBooking)=>{
                        if(err){
                            res.status(501).json({code:"01", err:err, message:"error creating booking"})
                        }else{
                           
                            res.status(200).json({code:"00", message:"venue booking created successfully"})
                        }
                    })
                })
            })
        })
    }catch(e){
        res.status(500)
    }
}
exports.addFlight=(req, res)=>{
    var data={
        type:'Flight',
        start_date:'',
        end_date:'',
        duration:null,
        hotel_id:null,
        price:'',
        roomType:null,
        user:'',
        no_of_rooms:'-',
        car_id:null,
        quantity:'-',
        venue_id:null,
        flight_id:'', 
        no_of_people:req.body.no_of_people,
        pending:'',
        declined:false
    }
    var id={_id:req.params.id}
    try{
        auth_user.verifyToken(req.token).then(decoded_user=>{
            userModel.findById(decoded_user._id, (err, user)=>{
                flightModel.findById(id, (err, flight)=>{
                    var flight_price=flight.price.replace(/^\D+/g, '')
                    data.price=parseInt(data.no_of_people)*parseInt(flight_price) 
                    data.flight_id=flight._id,
                    data.user=user._id
                    data.start_date=flight.departure_date
                    data.end_date=flight.arrival_date
                    user.account_type=='Business' ? data.pending=true:data.pending=false
                    BookingModel.create(data, (err, flightBooking)=>{
                        if(err){
                            res.status(501).json({code:"01", message:"error creating booking"})
                        }else{
                           
                            res.status(200).json({code:"00", message:"flight booking created successfully"})
                        }
                        })
                    
                }).populate('airline')
            })
        
        })

    }catch(e){
       res.status(500)
    }
}

exports.addFlight_nonUser=(req, res)=>{
    var data={
        type:'Flight',
        start_date:'',
        end_date:'',
        duration:null,
        hotel_id:null,
        price:'',
        roomType:'-',
        user:'',
        no_of_rooms:null,
        car_id:null,
        quantity:'-',
        venue_id:null,
        flight_id:'', 
        no_of_people:req.body.no_of_people,
        pending:false,
        declined:false
    }
    var id={_id:req.params.id}

    try{
                flightModel.findById(id, (err, flight)=>{
                    data.flight_id=flight._id
                    var flight_price=flight.price.replace(/^\D+/g, '')
                    data.price=parseInt(data.no_of_people)*parseInt(flight_price) 
                    data.user=null
                    data.start_date=flight.departure_date
                    data.end_date=flight.arrival_date
                    BookingModel.create(data, (err, flightBooking)=>{
                        if(err)res.status(501).json({code:"01", message:"error creating booking"})
                        res.status(200).json({code:"00", message:"flight booking created successfully"})
                    })
                })
    }catch(e){
        res.status(500)
    }
}

exports.addFlightBookingInvitedUser=(req, res)=>{
    var data={
        type:'Flight',
        start_date:'',
        end_date:'',
        duration:null,
        hotel_id:null,
        price:'',
        roomType:'-',
        user:'',
        no_of_rooms:null,
        car_id:null,
        quantity:'-',
        venue_id:null,
        flight_id:'', 
        no_of_people:req.body.no_of_people,
        pending:'',
        declined:false
    }
    var id={_id:req.params.id}
    try{
        auth_user.verifyInviteToken(req.token).then(decoded_user=>{
            userModel.findById(decoded_user.user, (err, user)=>{
                flightModel.findById(id, (err, flight)=>{
                    var flight_price=flight.price.replace(/^\D+/g, '')
                    data.price=parseInt(data.no_of_people)*parseInt(flight_price) 
                    data.flight_id=flight._id,
                    data.user=user._id
                    data.start_date=flight.departure_date
                    data.end_date=flight.arrival_date
                    if(decoded_user.limit==='No'||decoded_user.limit==undefined){
                        data.pending=false
                       
                    }else if(decoded_user.limit==='Yes'){
                        data.pending=true
                    }else{
                        data.price>decoded_user.limit_amount ?data.pending=true:data.pending=false
                    }
                    BookingModel.create(data, (err, flightBooking)=>{
                        if(err){
                            res.status(501).json({code:"01", message:"error creating booking"})
                        }else{
                           
                            res.status(200).json({code:"00", message:"flight booking created successfully"})
                        }
                        })
                    
                }).populate('airline')
            })
        
        })
    }catch(e){
        res.status(500)
    }
}

exports.getAllUpcomingBookings=(req, res)=>{
    var {page, limit,}= req.query;
    var options={
        page:parseInt(page, 10) || 1,
        limit:parseInt(limit, 10) || 15,
        sort:{'_id':-1},
        populate:'venue_id',
        populate:'hotel_id',
        populate:{path:'flight_id',
        populate:{
            path:'airline'
        } },
        path:'car_id'

}
    try{
        auth_user.verifyToken(req.token).then(user=>{
            BookingModel.paginate({$and:[{user:user._id}, {"end_date":{$gte: new Date()}}]}, options, (err, booking)=>{
                if(err) res.status(501).json({code:"01", message:"error retriving data"})
                res.status(200).json({code:"00", message:booking})
            })
        })
    }catch(e){
       res.status(500)
    }
}

exports.getAllPastTrips=(req, res)=>{
    var {page, limit,}= req.query;
    var options={
        page:parseInt(page, 10) || 1,
        limit:parseInt(limit, 10) || 15,
        sort:{'_id':-1},
        populate:'venue_id',
        populate:'hotel_id',
        populate:{path:'flight_id',
        populate:{
            path:'airline'
        } },
        path:'car_id'
}
        try{
            auth_user.verifyToken(req.token).then(user=>{
                BookingModel.paginate({$and:[{user:user._id}, {"end_date":{$lte: new Date()}}]}, options, (err, booking)=>{
                    if(err) res.status(501).json({code:"01", message:"error retriving data"})
                    res.status(200).json({code:"00", message:booking})
                })
            })
        }catch(e){
            res.status(500)
        }
}

exports.getAllCurrentTrips=(req, res)=>{
    var {page, limit,}= req.query;
    var options={
        page:parseInt(page, 10) || 1,
        limit:parseInt(limit, 10) || 15,
        sort:{'_id':-1},
        populate:'venue_id',
        populate:'hotel_id',
        populate:{path:'flight_id',
        populate:{
            path:'airline'
        } },
        path:'car_id'
}
        try{
            auth_user.verifyToken(req.token).then(user=>{
                BookingModel.paginate({$and:[{user:user.id}, {end_date:new Date()}]}, options, (err, booking)=>{
                    if(err) res.status(501).json({code:"01", message:"error retriving data"})
                    res.status(200).json({code:"00", message:booking})
                })
            })
        }catch(e){
            res.status(500)
        }
}