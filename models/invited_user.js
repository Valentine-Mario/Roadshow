var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
    name:{type: String, required: true},
    email:{type: String, unique:true},
    password:{type: String, required: true},
    date_created:Date,
    limit:String,
    limit_amount:Number,
    user: {type:mongoose.Schema.Types.ObjectId, ref:'user'},
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('invited_user', schema);