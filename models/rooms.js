var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   images:String,
   price:String,
   perks:[String],
   available:Number,
   type:String
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('rooms', schema);