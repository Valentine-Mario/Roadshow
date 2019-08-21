var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   type:String,
   airline:String,
   flight_id:{type:mongoose.Schema.Types.ObjectId, ref:'flight'}, 
   business:String,
   no_of_people:String,
   price:Number,
   employees:[{type:mongoose.Schema.Types.ObjectId, ref:'employees'}],
   approved:{type:Number, default:0}
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('business-flight-bookings', schema);