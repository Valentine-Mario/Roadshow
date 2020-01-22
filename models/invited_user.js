var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
    name:String,
    email:{type: String, unique:true},
    password:String,
    date_created:Date,
    limit:String,
    limit_amount:Number,
    user: {type:mongoose.Schema.Types.ObjectId, ref:'user'},
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('invited_user', schema);