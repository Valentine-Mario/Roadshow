var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   comment:{type: String, required: true},
   car:{type: String, required: true},
   rating:{type: Number, required: true},
   user:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
   date:Date
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('car-review', schema);