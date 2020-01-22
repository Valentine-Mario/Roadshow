var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   business:String,
   name:String,
   employees:[]
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('employees', schema);