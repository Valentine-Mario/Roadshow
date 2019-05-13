var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   images:String,
   price:String,
   perks:[String],
   available:Number
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('reviews', schema);