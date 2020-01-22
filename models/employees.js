var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   user:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
   name:String,
   employees:[]
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('employees', schema);