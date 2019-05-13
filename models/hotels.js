var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
    name:String,
   images:[String],
   location:String,
   information:[String],
   description:String,
   interest:[String],
   rates:[],
   rate_value:Number,
   rooms:[{type:mongoose.Schema.Types.ObjectId, ref:'rooms'}]
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('hotels', schema);