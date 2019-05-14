var reviewModel=require('../models/hotel-reviews');
var hotelModel=require('../models/hotels');
var userModel=require('../models/user')
const jwt=require('jsonwebtoken');


exports.addReview=(req, res)=>{
    var data={
        comment:req.body.comment,
        hotel:'',
        rating:req.body.rating,
        user:''
    }
    var id={_id:req.params.id}
    try{
        jwt.verify(req.token, "golden_little_kids", (err, decoded_user)=>{
            data.user=decoded_user.user
            data.hotel=id
            if(parseInt(data.rating)>5||parseInt(data.rating)<1){
                res.json({code:"01", message:"please enter a valid rating"})
            }else{
                reviewModel.create(data, (err, review)=>{
                    hotelModel.findById(id, (err, hotel)=>{
                        hotel.rates.push(parseInt(review.rating))
                        hotel.save()
                        var sum=hotel.rates.reduce(function(a,b){
                            return a+b
                        })
                        mean=parseInt(sum)/parseInt(hotel.rates.length)
                        meanVal=mean.toFixed(2)
                        var update_data={
                            rate_value:meanVal
                        }
                        hotelModel.findByIdAndUpdate(id, update_data, (err)=>{
                            if(err)res.json({code:"01", message:"error adding reviews"})
                            res.json({code:"00", message:review})
                        })
                    })
                })
            }
        })
    }catch(e){
        console.log(e)
    }
}

exports.removeReview=(req, res)=>{
    var id={_id:req.params.id}
    var hotel_id={_id:req.params.hotel_id}
    try{
        jwt.verify(req.token, "golden_little_kids", (err, decoded_user)=>{
            reviewModel.findById(id, (err, review)=>{
                if(JSON.stringify(review.user)!==JSON.stringify(decoded_user.user)){
                    res.json({code:"01", message:"unauthorised to delete this review"})
                }else{
                    // console.log(JSON.stringify(hotel_id._id), JSON.stringify(review.hotel))
                    if(JSON.stringify(hotel_id._id)==JSON.stringify(review.hotel)){
                        hotelModel.findById(hotel_id, (err, hotel)=>{
                            var index=review.rating
                            hotel.rates.splice(index, 1)
                            hotel.save()
                            var sum=hotel.rates.reduce(function(a,b){
                                return a+b
                            })
                            mean=parseInt(sum)/parseInt(hotel.rates.length)
                            meanVal=mean.toFixed(2)
                            var update_data={
                                rate_value:meanVal
                            }
                            hotelModel.findByIdAndUpdate(hotel_id, update_data, (err)=>{
                                if(err)res.json({code:"01", message:"error deleting reviews"})
                                res.json({code:"00", message:"review deleted successfully"})
                            })
                        })
                    }else{
                        res.json({code:"01", message:"hotel not found"})
                    }
                }
            })
        })
    }catch(e){
        console.log(e)
    }
}

exports.getReviews=(req, res)=>{
    var id={_id:req.params.id}
    var {page, limit}= req.query;
   var options={
       page:parseInt(page, 10) || 1,
       limit:parseInt(limit, 10) || 10,
       sort:{'_id':-1},
       populate:'user'
}
    try{
        reviewModel.paginate({hotel:id._id}, options, (err, value)=>{
            if(err)res.json({code:"01", message:"error getting review"})
            res.json({code:"00", message:value})
        })
    }catch(e){
        console.log(e)
    }
}