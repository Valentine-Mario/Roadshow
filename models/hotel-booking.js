var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   type:String,
   start_date:Date,
   end_date:Date,
   duration:Number,
   hotel_id:{type:mongoose.Schema.Types.ObjectId, ref:'hotels'},
   price:String,
   roomType:String,
   user:String,
   no_of_rooms:String,
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('hotel-bookings', schema);