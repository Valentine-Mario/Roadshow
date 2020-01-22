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
   user:String,
   no_of_rooms:Number,
   car_id:{type:mongoose.Schema.Types.ObjectId, ref:'cars'},
   user:String,
   quantity:String,
   venue_id:{type:mongoose.Schema.Types.ObjectId, ref:'venues'},
   flight_id:{type:mongoose.Schema.Types.ObjectId, ref:'flight'}, 
   no_of_people:String,
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('user-bookings', schema);