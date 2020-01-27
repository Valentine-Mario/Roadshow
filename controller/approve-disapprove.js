const auth_user=require('../helpers/auth')
const BookingModel=require('../models/user-booking')

class Approve{
    approveOrDisapproveBooooking(req, res){
            var data={
            pending:false,
            declined:req.body.declined
            }
            var id={_id:req.params.id}
        try{
            auth_user.verifyInviteToken(req.token).then(user=>{
                if(user.limit==undefined){
                    res.status(201).json({code:"01", message:"unauthorized to perform action"})
                }else{
                    BookingModel.findById(id, (err, booking)=>{
                    if(user.limit=='No'){    
                        BookingModel.findByIdAndUpdate(id, data, (err)=>{
                            if(err) res.status(501).json({code:"01", message:"error approving booking"})
                            res.status(200).json({code:"00", message:"updates made successfully"})
                        })
                    }else if(user.limit=='Yes'){
                        res.status(200).json({code:"01", message:"You don't have access to approve booking"})
                    }else{
                        if( user.limit_amount<=booking.price){
                            res.status(200).json({code:"01", message:"unauthorized to approve booking of this magnitude"})
                        }else{
                            BookingModel.findByIdAndUpdate(id, data, (err)=>{
                                if(err) res.status(501).json({code:"01", message:"error approving booking"})
                                res.status(200).json({code:"00", message:"updates made successfully"})
                            })
                        }
                       
                    }
                })
                }  
            }).catch(err=>{
                res.status(501).json({code:"01", message:"unauthorized to perform action"})
            })
        }catch(e){
            res.status(500)
        }
    }

    
}
module.exports=new Approve()