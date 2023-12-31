const mongoose = require("mongoose");
const Programme =require("./Programme.js")
const ConcertSchema = new mongoose.Schema(
  {  
    
    Date: {
      type: Date,
      default: Date.now, // You can set a default value if needed
    },
    lieu: {
      type: String,
      required: true,
    },
    programme_concert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Programme, // This references an "Author" model
      required: true,
    },  
  },
  { timestamps: true }
);

const concertModel = mongoose.model("Concert", ConcertSchema);
module.exports = concertModel;
