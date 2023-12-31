const mongoose = require("mongoose");
const personModel= require ("../models/Personne.js");

const candidatSchema =new mongoose.Schema({
situationPro:{
    type:String,
    required:true
},
connaissanceMusic:{
    type:String,
    required:true
},
statut:{
    type:String,
    enum: ['Accorde', 'Refuse']
},

});


 
  
  
const candidatModel = personModel.discriminator("candidat",candidatSchema)

module.exports =candidatModel