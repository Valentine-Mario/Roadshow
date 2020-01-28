var reviewModel=require('../models/venue-review');
var venueModel=require('../models/venues');
const auth_user=require('../helpers/auth')


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
        auth_user.verifyToken(req.token).then(user=>{
            data.user=user._id
            data.venue=id
            if(parseInt(data.rating)>10||parseInt(data.rating)<1){
                res.json({code:"01", message:"please enter a valid rating"})
            }else{
                reviewModel.create(data, (err, review)=>{
                    if(err)res.status(501).json({code:"01", message:"error adding reviews"})
                    res.status(200).json({code:"00", message:review})
                })
            }
        })
    }catch(e){
       res.status(500)
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

            //calculate the average of all rating
            reviewModel.find({venue:id._id}, (err, allRatins)=>{
                let ratings_result = allRatins.map(a => a.rating);
                var sum=ratings_result.reduce(function(a,b){
                         return a+b
              }, 0)
                mean=parseInt(sum)/parseInt( ratings_result.length)
                meanVal=mean.toFixed(2)
                if(err)res.status(501).json({code:"01", message:"error getting review"})
                res.status(200).json({code:"00", message:value, rating:meanVal})
            })
        })
    }catch(e){
       res.status(500)
    }
}