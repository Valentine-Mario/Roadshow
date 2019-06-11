var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   type:String,
   start_date:Date,
   end_date:Date,
   duration:Number,
   venue_id:{type:mongoose.Schema.Types.ObjectId, ref:'venues'},
   user:String
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('venue-bookings', schema);