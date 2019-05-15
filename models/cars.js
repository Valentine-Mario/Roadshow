var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   name:String,
   image:String,
   price:String,
   supplier_location:String,
   info:[],
   requirements:[],
   description:String,
   rates:[],
   rate_value:Number,
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('cars', schema);