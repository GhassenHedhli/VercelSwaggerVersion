const mongoose = require("mongoose");
const Choriste = require("../models/Choriste.js");
const Concert = require("../models/Concert.js");

const disponibiliteSchema = new mongoose.Schema({
  choriste: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Choriste,
    required: true,
  },
  concert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Concert,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  confirmation: {
    type: String,
    enum: ['confirm', 'not_confirm'],
    default: 'not_confirm',
  },
});

const Disponibilite = mongoose.model("Disponibilite", disponibiliteSchema);

module.exports = Disponibilite;
