const mongoose = require("mongoose") ;

const adminSchema = mongoose.Schema({
    email : String
})

const adminModel = mongoose.model('admin' , adminSchema) ;

module.exports = adminModel ;