var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
    name:String,
    email:{type: String, unique:true},
    description:String,
    password:String,
    verified:{type:Boolean, default:false},
    date_created:Date,
    boss_email:String,
    pics:{type:String, default:"https://res.cloudinary.com/school-fleep/image/upload/v1535357797/avatar-1577909_640.png"},
    hotel_price_spec:{type:Number, default:0},
    venue_price_spec:{type:Number, default:0},
    car_price_spec:{type:Number, default:0},
    fligh_price_perk:{type:Number, default:0},
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('business', schema);