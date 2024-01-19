const mongoose=require("mongoose");
//import choriste from "../models/Choriste.js"
const choriste = require("../models/Choriste.js");
const concertSchema =mongoose.Schema({
    date:{
        type:Date,
    },
    lieu:{
         type:String
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
      },
});
const concertModel = mongoose.model("Concerte",concertSchema)
module.exports = concertModel;