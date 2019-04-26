var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
    name:String,
    email:{type: String, unique:true},
    password:String,
    activity:[Object]
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('user', schema);