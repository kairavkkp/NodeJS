var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('User',userSchema)