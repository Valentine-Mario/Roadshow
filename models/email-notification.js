var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   email:{type: String, required: true, unique:true},
   date:Date
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('email_notification', schema);