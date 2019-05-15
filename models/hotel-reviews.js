var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   comment:String,
   hotel:String,
   rating:Number,
   user:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
   date:Date
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('reviews', schema);