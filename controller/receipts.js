var receiptModel= require('../models/receipts');
var cloudinary= require('cloudinary')
var jwt=require('jsonwebtoken')
require('dotenv').config()
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });

class Receipts{
    add_receipt(req, res){
        var data={
            images:req.files,
            location:req.body.location,
            date:Date.now(),
            user:''  
        }
        var img=[]
        try{
            
            var count=data.images.length
            jwt.verify(req.token, 'golden_little_kids', (err, decoded_user)=>{
                for(var i=0; i< data.images.length; i++){
                    cloudinary.uploader.upload(data.images[i].path, function(result_pass){
                    }, {resource_type:"image"}).then((result)=>{
                        img.push(result.secure_url);
                        data.images=img;
                        if(count==data.images.length){
                            data.user=decoded_user.user
                            receiptModel.create(data, (err, receipt)=>{
                                if(err)res.status(503).json({err:err, message:"error adding recepits"})
                                res.status(200).json({code:"00", message:"receipt created successfully"})
                            })
                        }
                    })
                }
            })
        }catch(e){
            console.log(e)
        }
    }

    addImagesToReceipt(req, res){
        var id={_id:req.params.id}
        var data={
            images:req.files
        }
        var count=[]
        try{
            jwt.verify(req.token, 'golden_little_kids', (err, decoded_user)=>{
                receiptModel.findById(id, (err, receipt)=>{
                    if(JSON.stringify(receipt.user)!== JSON.stringify(decoded_user.user)){
                        res.status(503).json({code:"01", message:"unauthorised to add images"})
                    }else{
                        for(var i=0; i<data.images.length; i++){
                    
                            cloudinary.uploader.upload(data.images[i].path).then((result)=>{
                                count.push(result.secure_url)
                                receipt.images.push(result.secure_url)
                                
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
            console.log(e)
        }
    }

    editReceiptDetails(req, res){
        var id={_id:req.params.id}
        var data={
            location:req.body.location
        }
        try{
            jwt.verify(req.token, 'golden_little_kids', (err, decoded_user)=>{
                receiptModel.findById(id, (err, receipt)=>{
                    if(JSON.stringify(receipt.user)!== JSON.stringify(decoded_user.user)){
                        res.status(503).json({code:"01", message:"unauthorised to edit details"})
                    }else{
                        receiptModel.findByIdAndUpdate(id, data, (err)=>{
                            if(err)res.status(501).json({code:"01", message:"error editing details"})
                            res.status(200).json({code:"00", message:"details modified successfully"})
                        })
                    }
                })
            })
        }catch(e){
            console.log(e)
        }
    }
}

module.exports=new Receipts();