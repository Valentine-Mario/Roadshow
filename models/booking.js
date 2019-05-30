var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   type:String,
   details:String,
   start_date:String,
   end_date:String
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('bookings', schema);