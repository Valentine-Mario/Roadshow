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

    approveFlight(req, res){
        var id={_id:req.params.id}
        var data={
            approved:1
        }
        try{
            flightBookingModel.findByIdAndUpdate(id, data, (err)=>{
                if(err)res.status(501).json({code:"01", message:"error approving flight"})
                res.status(200).json({code:"00", message:"flight approved successfully"})
            })
        }catch(e){
            console.log(e)
            res.status(500)
        }
    }

    disApproveFlight(req, res){
        var id={_id:req.params.id}
        var data={
            approved:2
        }
        try{
            flightBookingModel.findByIdAndUpdate(id, data, (err)=>{
                if(err)res.status(501).json({code:"01", message:"error approving flight"})
                res.status(200).json({code:"00", message:"flight disapproved successfully"})
            })
        }catch(e){
            console.log(e)
            res.status(500)
        }
    }
    approveVenue(req, res){
        var id={_id:req.params.id}
        var data={
            approved:1
        }
        try{
            venueBookingModel.findByIdAndUpdate(id, data, (err)=>{
                if(err)res.status(501).json({code:"01", message:"error approving venue"})
                return res.status(200).json({code:"00", message:"venue approved successfully"})
            })
        }catch(e){
            console.log(e)
        }
    }
    disApproveVenue(req, res){
        var id={_id:req.params.id}
        var data={
            approved:2
        }
        try{
            venueBookingModel.findByIdAndUpdate(id, data, (err)=>{
                if(err)res.status(501).json({code:"01", message:"error disapproving venue"})
                return res.status(200).json({code:"00", message:"venue disapproved successfully"})
            })
        }catch(e){
            console.log(e)
        }
    }

    approveCar(req, res){
        var id={_id:req.params.id}
        var data={
            approved:1
        }
        try{
            carBookingModel.findByIdAndUpdate(id, data, (err)=>{
                if(err)res.status(501).json({code:"01", message:"error approving car rental"})
                return res.status(200).json({code:"00", message:"car rental approved successfully"})
            })
        }catch(e){
            console.log(e)
        }
    }
    disApproveCar(req, res){
        var id={_id:req.params.id}
        var data={
            approved:2
        }
        try{
            carBookingModel.findByIdAndUpdate(id, data, (err)=>{
                if(err)res.status(501).json({code:"01", message:"error disapproving car rental"})
                return res.status(200).json({code:"00", message:"car rental disapproved successfully"})
            })
        }catch(e){
            console.log(e)
        }
    }
}
module.exports=new Approve()