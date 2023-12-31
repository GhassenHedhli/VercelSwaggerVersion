const mongoose = require("mongoose");
const Oeuvre =require("./Oeuvre.js");
 
const ProgrammeSchema = new mongoose.Schema(
  {  
    
      nom_programme: {
        type: String,
      },
    oeuvres_liste: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: Oeuvre, // This references an "Author" model
      required: false,
    }],  
  },
  { timestamps: true }
);

const programmeModel = mongoose.model("Programme", ProgrammeSchema);
module.exports = programmeModel;
