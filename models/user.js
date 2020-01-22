var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
    name:String,
    email:{type: String, unique:true},
    password:String,
    auth_id:String,
    verified:{type:Boolean, default:false},
    date_created:Date,
    access:{type:Number, default:0},
    account_type:String,
    pics:{type:String, default:"https://res.cloudinary.com/school-fleep/image/upload/v1535357797/avatar-1577909_640.png"},

})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('user', schema);