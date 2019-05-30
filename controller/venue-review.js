var reviewModel=require('../models/venue-review');
var venueModel=require('../models/venues');
var userModel=require('../models/user')
const jwt=require('jsonwebtoken');


exports.addReview=(req, res)=>{
    var data={
        comment:req.body.comment,
        venue:'',
        rating:req.body.rating,
        user:'',
        date:Date.now()
    }
    var id={_id:req.params.id}
    try{
        jwt.verify(req.token, "golden_little_kids", (err, decoded_user)=>{
            data.user=decoded_user.user
            data.venue=id
            if(parseInt(data.rating)>10||parseInt(data.rating)<1){
                res.json({code:"01", message:"please enter a valid rating"})
            }else{
                reviewModel.create(data, (err, review)=>{
                    venueModel.findById(id, (err, venue)=>{
                        venue.rates.push(parseInt(review.rating))
                        venue.save()
                        var sum=venue.rates.reduce(function(a,b){
                            return a+b
                        })
                        mean=parseInt(sum)/parseInt(venue.rates.length)
                        meanVal=mean.toFixed(2)
                        var update_data={
                            rate_value:meanVal
                        }
                        venueModel.findByIdAndUpdate(id, update_data, (err)=>{
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
        reviewModel.paginate({venue:id._id}, options, (err, value)=>{
            if(err)res.json({code:"01", message:"error getting review"})
            res.json({code:"00", message:value})
        })
    }catch(e){
        console.log(e)
    }
}