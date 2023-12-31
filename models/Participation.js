const mongoose = require("mongoose");
const Concert = require("./Concert.js");
const Repetition = require("./Repitition.js");
const choriste = require("./Choriste.js");
const participationSchema = new mongoose.Schema({
  presence: {
    type: Boolean,
    default: false, 
  },
  raison: {
    type: String,
    trim: true, 
  },
  theme :{
    type:String,
    enum: ['Concert', 'Repetition']
  },
  concert:{
    type: mongoose.Schema.Types.ObjectId,
    ref: Concert, 
    required: false,
  },
  repetition:{
    type: mongoose.Schema.Types.ObjectId,
    ref: Repetition, 
    required: false,
  },
  choriste:{
    type: mongoose.Schema.Types.ObjectId,
    ref: choriste, 
    required: false,
  }
},{timestamps:true});

const Participation = mongoose.model("Participation", participationSchema);

module.exports = Participation;
