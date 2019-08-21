var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   type:String,
   start_date:Date,
   end_date:Date,
   duration:Number,
   car_id:{type:mongoose.Schema.Types.ObjectId, ref:'cars'},
   business:String,
   price:Number,
   quantity:String,
   approved:{type:Number, default:0}
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('business-car-bookings', schema);