const mongoose = require("mongoose");
const personModel = require("./Personne.js");

 // Ensure that choristeModel is importe


const chefpupitreSchema = new mongoose.Schema({
  repetitions: { type: Number, default: 3 },
  concerts: { type: Number, default: 3 },
  integration: {
    type: Date,
    default: Date.now, // Set the default value to the current date and time
  },
  statut: {
    type: String,
    enum: ['Junior', 'Choriste', 'Sénior', 'Vétéran', 'Inactif'],
    default: 'Junior',
  },
  saison: {
    type: Number,
    default: 1,
  },
  historique: [
    {
      saison: {
        type: Number,
      },
      statut: {
        type: String,
      },
    },
  ],
}, { timestamps: true });


const chefpupitreModel = personModel.discriminator('Chef_pupitre', chefpupitreSchema);

module.exports = chefpupitreModel;
