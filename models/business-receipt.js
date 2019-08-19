var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   images:[String],
   location:String,
   date:String,
   business:{type:mongoose.Schema.Types.ObjectId, ref:'business'}
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('business-receipt', schema);