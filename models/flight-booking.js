var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   type:String,
   airline:String,
   flight_id:{type:mongoose.Schema.Types.ObjectId, ref:'flight'}, 
   user:String  
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('flight-bookings', schema);