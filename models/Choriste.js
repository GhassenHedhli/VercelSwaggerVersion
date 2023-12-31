const mongoose = require("mongoose");
const personModel = require("../models/Personne.js");
const Concert =require("../models/Concert.js");
const choristeSchema =new mongoose.Schema({
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

const choristeModel = personModel.discriminator("choriste",choristeSchema)

module.exports =choristeModel