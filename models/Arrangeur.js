const mongoose = require("mongoose");


const ArrangeurSchema = new mongoose.Schema(
  {  
    
   
    nom: { type: String,required:true },
    prenom: { type: String, required:true},
    
  },
  
);

const ArrangeurModel = mongoose.model("Arrangeur", ArrangeurSchema);
module.exports = ArrangeurModel;
