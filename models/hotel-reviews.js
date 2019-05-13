var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   comment:String,
   hotel:String,
   rating:Number
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('reviews', schema);