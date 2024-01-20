const ReptiotionModel = require("../models/Repitition.js");

const AddRep = async(req, res) => {
    try { 
     
        const newConcert = await ReptiotionModel.create(req.body);
        res.status(201).json({Repetition: newConcert, message: "Repetition added with success" });
      }
  catch (e) {
    res.status(400).json({
        e:e.message,
        message:"Repetition Not Added"
    })
  }
  };
  
  module.exports={AddRep}