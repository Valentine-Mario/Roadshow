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
                            res.json({code:"00", message:"review added successfully"})
                        })
                    })
                })
            }
        })
    }catch(e){
        console.log(e)
    }
}