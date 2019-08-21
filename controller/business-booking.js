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
}

module.exports=new Business_booking();