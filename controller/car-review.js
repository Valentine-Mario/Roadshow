var reviewModel=require('../models/car-review');
var carModel=require('../models/cars');
var userModel=require('../models/user')
const jwt=require('jsonwebtoken');
const auth_user=require('../helpers/auth')
exports.addReview=(req, res)=>{
    var data={
        comment:req.body.comment,
        car:'',
        rating:req.body.rating,
        user:'',
        date:Date.now()
    }
    var id={_id:req.params.id}
    try{
        auth_user.verifyToken(req.token).then(user=>{
            data.user=user._id
            data.car=id
            if(parseInt(data.rating)>10||parseInt(data.rating)<1){
                res.json({code:"01", message:"please enter a valid rating"})
            }else{
                reviewModel.create(data, (err, review)=>{
                    carModel.findById(id, (err, car)=>{
                        car.rates.push(parseInt(review.rating))
                        car.save()
                        var sum=car.rates.reduce(function(a,b){
                            return a+b
                        })
                        mean=parseInt(sum)/parseInt(car.rates.length)
                        meanVal=mean.toFixed(2)
                        var update_data={
                            rate_value:meanVal
                        }
                        carModel.findByIdAndUpdate(id, update_data, (err)=>{
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
        reviewModel.paginate({car:id._id}, options, (err, value)=>{
            console.log(id._id)
            if(err)res.json({code:"01", message:"error getting review"})
            res.json({code:"00", message:value})
        })
    }catch(e){
        console.log(e)
    }
}