const carModel=require('../models/cars')
const flightModel=require('../models/flight')
const hotelModel=require('../models/hotels')
const roomModel=require('../models/rooms')
const venueModel=require('../models/venues')
const flightBookingModel=require('../models/business-booking-flight')
const HotelBookingModel=require('../models/business-booking-hotel')
const carBookingModel=require('../models/business-booking-car')
const venueBookingModel=require('../models/business-booking-venue')
const auth=require('../helpers/auth')
const mailer=require('../helpers/mail')
const employees=require('./employee')
class Business_booking{
    addHotel(req, res){
        var data={
            type:'Hotel',
            start_date:new Date(req.body.start_date),
            end_date:new Date(req.body.end_date),
            duration:0,
            hotel_id:'',
            price:'',
            roomType:'',
            business:'',
            no_of_rooms:req.body.no_of_rooms,
            employees:'' 
        }
        var id={_id:req.params.id}
        try{
            auth.verifyBusinessToken(req.token).then(business=>{
                hotelModel.find({rooms:id._id}, (err, hotel)=>{
                        
                    roomModel.findById(id, (err, room)=>{
                        data.duration=parseInt((data.end_date-data.start_date)/(1000*60*60*24))+1
                        var room_price=room.price.replace(/^\D+/g, '')
                        data.price=parseInt(room_price)*data.duration*parseInt(data.no_of_rooms);
                        
                        data.hotel_id=hotel[0]._id;
                        
                        data.roomType=room.type
                        data.business=business._id
                        employees.getEmployeeForUse(business._id).then(employee_details=>{
                            data.employees=employee_details
                            HotelBookingModel.create(data, (err, hotelBooking)=>{
                            if(err){
                                res.status(501).json({code:"01", err:err, message:"error creating booking"})
                            }else{
                                var summary=`Hotel booking at ${hotel[0].name} located at ${hotel[0].location}.
                                 Price is ${data.price} duration is ${data.duration} in days room type is ${room.type} at
                                  the price of $ ${data.price}
                                  start date:${data.start_date},
                                    end date:${data.end_date},
                                    for ${employee_details}`
                                mailer.approval_mail("Approval mail", summary, business.boss_email, hotelBooking._id, 'hotel')
                                res.status(200).json({code:"00", message:"hotel booking created successfully"})
                            }
                        })
                        })
                        
                        
                    })
                }) 
            })
        }catch(e){
            console.log(e)
            res.status(500)
        }
    }

    getHotelBooking(req, res){
        var number= req.params.number
        var {page, limit,}= req.query;
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 10,
            sort:{'_id':-1}
    }
        try{
            auth.verifyBusinessToken(req.token).then(business=>{
                
                HotelBookingModel.paginate({$and:[{business:business._id}, {approved:parseInt(number)}]}, options, (err, data)=>{
                    if(err)res.staus(501).json({code:"01", message:"error getting booking"})
                    res.status(200).json({code:"00", message:data})
                })
            })
        }catch(e){
            console.log(e)
            res.status(500)
        }
    }

    addFlight(req, res){
        var data={
            type:'Flight',
            flight_id:'',
            business:'',
            no_of_people:'',
            price:'',
            employees:''
        }
        var id={_id:req.params.id}
        try{
            auth.verifyBusinessToken(req.token).then(business=>{
                flightModel.findById(id, (err, flight)=>{
                    var flight_price=flight.price.replace(/^\D+/g, '')
                    data.flight_id=flight._id,
                    data.business=business._id
                    employees.getEmployeeForUse(business._id).then(employee_details=>{
                        data.no_of_people=employee_details.length
                        data.employees=employee_details
                        data.price=parseInt(data.no_of_people)*parseInt(flight_price) 
                        flightBookingModel.create(data, (err, flightBooking)=>{
                            if(err){
                                res.status(501).json({code:"01", err:err, message:"error creating booking"})
                            }else{
                                var summary=`Flight from ${flight.destination_from} to ${flight.destination_to}
                                departure airport is ${flight.departure_airport} and arrival airport 
                                is ${flight.arrival_airport}. Price is $ ${data.price} for
                                ${data.no_of_people} person(s), airline is ${flight.airline.name}
                                start date:${flight.departure_date}
                                arrivale date:${flight.arrival_date}
                                employess:${employee_details}
                                `
                                mailer.approval_mail("Approval mail", summary, business.boss_email, flightBooking._id, 'flight')
                                res.status(200).json({code:"00", message:"flight booking created successfully"})
                            }
                            })
                    })
                }).populate('airline')
            })
        }catch(e){
            console.log(e)
            res.status(500)
        }
    }

    getFlightBooking(req, res){
        var number= req.params.number
        var {page, limit,}= req.query;
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 10,
            sort:{'_id':-1}
    }
        try{
            auth.verifyBusinessToken(req.token).then(business=>{
                
                flightBookingModel.paginate({$and:[{business:business._id}, {approved:parseInt(number)}]}, options, (err, data)=>{
                    if(err)res.staus(501).json({code:"01", message:"error getting booking"})
                    res.status(200).json({code:"00", message:data})
                })
            })
        }catch(e){
            console.log(e)
            res.status(500)
        }
    }
    
    addVenue(req, res){
        var data={
            type:'Venue',
            start_date:new Date(req.body.start_date),
            end_date:new Date(req.body.end_date),
            duration:0,
            venue_id:'',
            business:'',
            price:''
        }
        var id={_id:req.params.id}
        try{
            auth.verifyBusinessToken(req.token).then(business=>{
                venueModel.findById(id, (err, venue)=>{
                    data.duration=parseInt((data.end_date-data.start_date)/(1000*60*60*24))+1
                    data.venue_id=venue._id;
                    data.business=business._id;
                    var venue_price=venue.pricing.replace(/^\D+/g, '')
                    data.price=parseInt(venue_price)*data.duration
                   
                    venueBookingModel.create(data, (err, venueBooking)=>{
                        if(err){
                            res.status(501).json({code:"01", err:err, message:"error creating booking"})
                        }else{
                            var summary=`Venue rental at ${venue.name} at ${venue.location}
                            with ${venue.capacity} capacity, at the price of 
                            ${data.price} for the duration of ${data.duration} in days
                            start date: ${data.start_date}
                            end date: ${data.end_date}`
                            mailer.approval_mail("Approval mail", summary, business.boss_email, venueBooking._id, 'venue')
 
                            res.status(200).json({code:"00", message:"venue booking created successfully"})
                        }
                    })
                })
            })
        }catch(e){
            console.log(e)
        }
    }
}

module.exports=new Business_booking();