const mongoose = require("mongoose");
const personModel = require("../models/Personne.js");
const Concert =require("../models/Concert.js");
const pupitreSchema =new mongoose.Schema({
statut:{
    type:String,
    required:true
},
concert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Concert, 
    required: true,
  }
});

const pupitreModel = personModel.discriminator("pupitre",pupitreSchema)

module.exports =pupitreModel