var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   business:String,
   role:String,
   name:String,
   email:String
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('employees', schema);