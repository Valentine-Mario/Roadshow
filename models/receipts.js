var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   images:[String],
   location:String,
   date:String,
   user:{type:mongoose.Schema.Types.ObjectId, ref:'user'}
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('receipt', schema);