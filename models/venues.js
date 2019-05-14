var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   name:String,
   images:[String],
   location:String,
   information:[String],
   description:String,
   availability:String,
   rates:[],
   rate_value:Number,
   pricing:String,
   capacity:String,
   type:String
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('hotels', schema);