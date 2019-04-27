var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
    name:String,
    email:{type: String, unique:true},
    password:String,
    activity:[Object],
    auth_id:String,
    verified:{type:Boolean, default:false},
    date_created:Date
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('user', schema);