const mongoose = require("mongoose");
const candidat = require("./Candidat.js");
const { constants } = require("fs/promises");
const auditionSchema = new mongoose.Schema({
    date:{
        type: Date,
        required:true
    },
    heureDeb:{
        type:String,
        required:true
    },
    heureFin:{
        type:String,
        required:true
    },
    email:[{
        type:String,
            }],
    tessiture:{
        type:String,
    },
    extrait_music:{
        type: String,
    },
    remarque:{
        type: String,
    },
    numero_aud:{
        type: Number,
    },
    candidates:[{
        type: mongoose.Schema.Types.ObjectId,
      ref: candidat,
    }]
})

const auditionModel = mongoose.model('audition',auditionSchema)
module.exports= auditionModel