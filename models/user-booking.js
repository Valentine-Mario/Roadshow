var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   type:{type: String, required: true},
   start_date:{type: Date},
   end_date:{type:Date},
   duration:{type: Number},
   hotel_id:{type:mongoose.Schema.Types.ObjectId, ref:'hotels'},
   price:{type: Number},
   roomType:{type:String},
   user:String,
   no_of_rooms:{type:String},
   car_id:{type:mongoose.Schema.Types.ObjectId, ref:'cars'},
   quantity:{type:String},
   venue_id:{type:mongoose.Schema.Types.ObjectId, ref:'venues'},
   flight_id:{type:mongoose.Schema.Types.ObjectId, ref:'flight'}, 
   no_of_people:{type: String},
   pending:Boolean,
   declined:Boolean,
   group:{type:mongoose.Schema.Types.ObjectId, ref:'employees'}
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('user-bookings', schema);