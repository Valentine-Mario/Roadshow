var receiptModel= require('../models/receipts');
const auth_user=require('../helpers/auth')
const cloud=require('../helpers/cloud')
class Receipts{
    add_receipt(req, res){
        var data={
            images:req.files,
            location:req.body.location,
            date:'',
            user:''  
        }
        var img=[]
        try{
            
            var count=data.images.length
            auth_user.verifyToken(req.token).then(user=>{
                for(var i=0; i< data.images.length; i++){
                    cloud.pics_upload(data.images[i].path).then(val=>{
                        img.push(val.secure_url);
                        data.images=img;
                        
                        if(count==data.images.length){
                            data.user=user._id
                            var today_date=new Date();
                            var day=today_date.getDate();
                            var month=today_date.getMonth() +1;
                            var year=today_date.getFullYear();
                            data.date=year + '-' + month + '-' + day;
                            
                            receiptModel.create(data, (err, receipt)=>{
                                if(err)res.status(501).json({err:err, message:"error adding recepits"})
                                res.status(200).json({code:"00", message:receipt})
                            })
                        }
                    })
                        
                   
                }
            })
           
        }catch(e){
            res.status(500)
        }
    }

    addImagesToReceipt(req, res){
        var id={_id:req.params.id}
        var data={
            images:req.files
        }
        var count=[]
        try{
            auth_user.verifyToken(req.token).then(user=>{
                receiptModel.findById(id, (err, receipt)=>{
                    if(JSON.stringify(receipt.user)!== JSON.stringify(user._id)){
                       
                         res.status(201).json({code:"01", message:"unauthorised to add images"})
                    }else{
                       
                        for(var i=0; i<data.images.length; i++){
                            cloud.pics_upload(data.images[i].path).then(val=>{
                                
                                 count.push(val.secure_url)
                                 receipt.images.push(val.secure_url)
                                
                                //track for successful upload then terminate function
                                if(count.length==data.images.length){
                                    res.status(200).json({code:"00", message:"upload successful"})
                                    receipt.save()
                                }
                            })
                            
                        } 
                    }
                })
            })
            
        }catch(e){
            res.status(500)
        }
    }

    editReceiptDetails(req, res){
        var id={_id:req.params.id}
        var data={
            location:req.body.location
        }
        try{
            auth_user.verifyToken(req.token).then(user=>{
                receiptModel.findById(id, (err, receipt)=>{
                    if(JSON.stringify(receipt.user)!== JSON.stringify(user._id)){
                        res.status(201).json({code:"01", message:"unauthorised to edit details"})
                    }else{
                        receiptModel.findByIdAndUpdate(id, data, (err)=>{
                            if(err)res.status(501).json({code:"01", message:"error editing details"})
                            res.status(200).json({code:"00", message:"details modified successfully"})
                        })
                    }
                })
            })
        }catch(e){
           res.status(500)
        }
    }

    removeImageFromReceipt(req, res){
        var id={_id:req.params.id}
        var data={
             images:req.body.images
        }
      try{
       auth_user.verifyToken(req.token).then(user=>{
        receiptModel.findById(id, (err, receipt)=>{
            if(JSON.stringify(receipt.user)!== JSON.stringify(user._id)){
                res.status(201).json({code:"01", message:"unauthorised to remove image"})
            }else{
                if(receipt.images.includes(data.images)){
                    receipt.images.splice(receipt.images.indexOf(data.images), 1)
                    receipt.save()
                    res.status(200).json({code:"00", message:"image successfully removed"})
                    }else{
                        res.status(201).json({code:"01", message:"image not found"})
                    }
            }
        })
       })
        
      }catch(e){
          res.status(500)
      }
    }


    removeReceipt(req, res){
        var id={_id:req.params.id}
        try{
            auth_user.verifyToken(req.token).then(user=>{
                receiptModel.findById(id, (err, receipt)=>{
                    if(JSON.stringify(receipt.user)!== JSON.stringify(user._id)){
                        res.status(201).json({code:"01", message:"unauthorised to delete receipt"})
                    }else{
                        receiptModel.findByIdAndDelete(id, (err)=>{
                            if(err)res.status(501).json({code:"01", message:"error deleting receipt"})
                            res.status(200).json({code:"00", message:"receipt deleted successfully"})
                        })
                    }
                })
            })   
        }catch(e){
            res.status(500)
        }
    }


    getReceipt(req, res){
        var {page, limit,}= req.query;
        var options={
        page:parseInt(page, 10) || 1,
        limit:parseInt(limit, 10) || 15,
        sort:{'_id':-1}
}
        try{
            auth_user.verifyToken(req.token).then(user=>{
                receiptModel.paginate({user:user._id}, options, (err, receipt)=>{
                    if(err)res.status(501).json({code:"01", err:err, message:"error getting details"})
                    res.status(200).json({code:"00", message:receipt})
                })
            })
        }catch(e){
            res.status(500)
        }
        
    }
    getReceiptById(req, res){
        var id={_id:req.params.id}
        try{
            receiptModel.findById(id, (err, receipt)=>{
                if(err)res.status(501).json({code:"01", message:"error getting receipt"})
                res.status(200).json({code:"00", message:receipt})
            })
        }catch(e){
           res.status(500)
        }
    }
    getRceiptByDay(req, res){
        var data={
            date:req.params.date
        }
        var {page, limit,}= req.query;
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 15,
            sort:{'_id':-1}
    }
        try{
            auth_user.verifyToken(req.token).then(user=>{
                receiptModel.paginate({$and:[{user:user._id}, {date:data.date}]}, options, (err, receipt)=>{
                    if(err)res.status(501).json({code:"01", err:err, message:"error getting details"})
                    res.status(200).json({code:"00", message:receipt})
                })
            })
        }catch(e){
            res.status(500)
        }
    }

    getReceiptByLocation(req, res){
       
        var value= req.params.value;
        var {page, limit,}= req.query;
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 15,
            sort:{'_id':-1}
    }
        try{
            auth_user.verifyToken(req.token).then(user=>{
                receiptModel.paginate({$and:[{user:user._id}, {"location":{$regex: value, $options: 'gi'}}]}, options, (err, receipt)=>{
                    if(err) res.status(501).json({code:"01", message:"error getting search result"})
                    res.status(200).json({code:"00", message:receipt})
                })
            })
        }catch(e){
            res.status(500)
        }
    }
}

module.exports=new Receipts();