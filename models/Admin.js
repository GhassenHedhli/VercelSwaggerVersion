const mongoose=require("mongoose");
const adminSchema = new mongoose.Schema({
    nom:{
        type: String,
        required:true
    },
    prenom:{
        type:String,
        required:true
    },
    telephone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
        },
    
   
})

const adminModel = mongoose.model('admin',adminSchema)
module.exports = adminModel;