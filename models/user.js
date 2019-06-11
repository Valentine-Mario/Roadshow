var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
    name:String,
    email:{type: String, unique:true},
    password:String,
    activity:[Object],
    auth_id:String,
    verified:{type:Boolean, default:false},
    date_created:Date,
    receipts:[],
    access:{type:Number, default:0},
    hotel_price_spec:{type:Number, default:0},
    venue_price_spec:{type:Number, default:0},
    car_price_spec:{type:Number, default:0},
    fligh_price_perk:{type:Number, default:0},
    flight_type_spec:String
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('user', schema);