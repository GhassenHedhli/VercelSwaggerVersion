const mongoose = require("mongoose");


const compositeurSchema = new mongoose.Schema(
  {  
    
   
    nom: { type: String,required:true },
    prenom: { type: String, required:true},
    
  },
  
);

const CompositeurModel = mongoose.model("Compositeur", compositeurSchema);
module.exports = CompositeurModel;