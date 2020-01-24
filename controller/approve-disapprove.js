const auth_user=require('../helpers/auth')
const BookingModel=require('../models/user-booking')

class Approve{
    approveBooooking(req, res){
            var data={
            pending:false,
            declined:false
            }
            var id={_id:req.params.id}
        try{
            auth_user.verifyInviteToken(req.token).then(user=>{
                BookingModel.findById(id, (err, booking)=>{
                    if(user.limit=='No'){    
                        BookingModel.findByIdAndUpdate(id, data, (err)=>{
                            if(err) res.status(501).json({code:"01", message:"error approving booking"})
                        })
                    }else if(user.limit=='Yes'){
                        res.status(200).json({code:"01", message:"You don't have access to approve booking"})
                    }else{
                        if( user.limit_amount<=booking.price){
                            res.status(200).json({code:"01", message:"unauthorized to approve booking of this magnitude"})
                        }else{
                            BookingModel.findByIdAndUpdate(id, data, (err)=>{
                                if(err) res.status(501).json({code:"01", message:"error approving booking"})
                            })
                        }
                       
                    }
                })
                
            })
        }catch(e){
            res.status(500)
        }
    }

    declinedBooing(req, res){
        var data={
            pending:false,
            declined:true
            }
            var id={_id:req.params.id}
        try{
            auth_user.verifyInviteToken(req.token).then(user=>{
                BookingModel.findById(id, (err, booking)=>{
                    if(user.limit=='No'){    
                        BookingModel.findByIdAndUpdate(id, data, (err)=>{
                            if(err) res.status(501).json({code:"01", message:"error declining booking"})
                        })
                    }else if(user.limit=='Yes'){
                        res.status(200).json({code:"01", message:"You don't have access to decline booking"})
                    }else{
                        if( user.limit_amount<=booking.price){
                            res.status(200).json({code:"01", message:"unauthorized to decline booking of this magnitude"})
                        }else{
                            BookingModel.findByIdAndUpdate(id, data, (err)=>{
                                if(err) res.status(501).json({code:"01", message:"error declining booking"})
                            })
                        }
                       
                    }
                })
                
            })
        }catch(e){
            res.status(500)
        }
    }
}
module.exports=new Approve()