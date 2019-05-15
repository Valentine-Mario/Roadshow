var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   name:String,
   image:String
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('airline', schema);