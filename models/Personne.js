const mongoose = require("mongoose");

const prsonSchema = new mongoose.Schema({
    cin:{
        type:String,
        required:true,
     
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        
    },
    sexe:{
        type:String,
        enum: ['Male', 'Female']
    },
    tel:{
        type:String,
        required:true,
    },
    tailleM:{
        type:Number,
    }
},{ timestamps: true })
const personModel = mongoose.model("person", prsonSchema);
module.exports = personModel