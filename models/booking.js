var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   type:String,
   details:String,
   start_date:Date,
   end_date:Date
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('bookings', schema);