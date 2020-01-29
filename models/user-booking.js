var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   type:{type: String, required: true},
   start_date:{type: Date, required: true},
   end_date:{type:Date, required: true},
   duration:{type: Number, required: true},
   hotel_id:{type:mongoose.Schema.Types.ObjectId, ref:'hotels'},
   price:{type: Number, required: true},
   roomType:{type:String, required: true},
   user:String,
   no_of_rooms:{type:Number, required: true},
   car_id:{type:mongoose.Schema.Types.ObjectId, ref:'cars'},
   quantity:{type:String, required: true},
   venue_id:{type:mongoose.Schema.Types.ObjectId, ref:'venues'},
   flight_id:{type:mongoose.Schema.Types.ObjectId, ref:'flight'}, 
   no_of_people:{type: String, required: true},
   pending:Boolean,
   declined:Boolean,
   group:{type:mongoose.Schema.Types.ObjectId, ref:'employees'}
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('user-bookings', schema);