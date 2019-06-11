var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
    destination_from:String,
    destination_to:String,
    departure_date:String,
    arrival_date:String,
    departure_time:String,
    arrival_time:String,
    airline:{type:mongoose.Schema.Types.ObjectId, ref:'airline'},
    class:String,
    price:String,
    departure_airport:String,
    arrival_airport:String,
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('flight', schema);