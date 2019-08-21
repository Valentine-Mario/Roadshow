const flightBookingModel=require('../models/business-booking-flight')
const HotelBookingModel=require('../models/business-booking-hotel')
const carBookingModel=require('../models/business-booking-car')
const venueBookingModel=require('../models/business-booking-venue')

class Approve{
    approveHotel(req, res){
        var id={_id:req.params.id}
        var data={
            approved:1
        }
        try{
            HotelBookingModel.findByIdAndUpdate(id, data, (err)=>{
                if(err)res.status(501).json({code:"01", message:"error approving hotel"})
                res.status(200).json({code:"00", message:"hotel approved successfully"})
            })
        }catch(e){
            console.log(e)
            res.status(500)
        }
    }

    disApproveHotel(req, res){
        var id={_id:req.params.id}
        var data={
            approved:2
        }
        try{
            HotelBookingModel.findByIdAndUpdate(id, data, (err)=>{
                if(err)res.status(501).json({code:"01", message:"error approving hotel"})
                res.status(200).json({code:"00", message:"hotel disapproved successfully"})
            })
        }catch(e){
            console.log(e)
            res.status(500)
        }
    }
}
module.exports=new Approve()