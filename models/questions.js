var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   email:{type: String, required: true},
   name:{type:String, required:true},
   question:{type:String, required:true},
   date:Date
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('questions', schema);