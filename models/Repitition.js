const mongoose = require('mongoose');
const Programme =require('./Programme.js');
const repetitionSchema = new mongoose.Schema({
  
  lieu: { type: String, required: true },
  date: { type: Date, required: true },
  heureDebut: { type: String, required: true },
  heureFin: { type: String, required: true },
  pourcentageParPupitre: { type: Map, of: Number, required: false },
  programme_concert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Programme, 
    required: true,
  }, 
});

const Repetition = mongoose.model('repetition', repetitionSchema);

module.exports = Repetition;