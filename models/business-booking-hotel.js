var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   type:String,
   start_date:Date,
   end_date:Date,
   duration:Number,
   hotel_id:{type:mongoose.Schema.Types.ObjectId, ref:'hotels'},
   price:Number,
   roomType:String,
   business:String,
   no_of_rooms:Number,
   employees:[{type:mongoose.Schema.Types.ObjectId, ref:'employees'}],
   approved:{type:Number, default:0}
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('business-hotel-bookings', schema);