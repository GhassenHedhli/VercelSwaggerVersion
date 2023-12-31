const oeuvreModel = require("../models/Oeuvre.js");
const programmeModel = require("../models/Programme.js");



 const AddOeuvre = async (req, res) => {
  try {
    // Check if an Oeuvre with the same values already exists
    const { nom, choeur } = req.body;
    const existingOeuvre = await oeuvreModel.findOne({ nom, choeur });

    if (existingOeuvre) {
      // If the Oeuvre already exists, return a 409 Conflict status
      return res.status(409).json({ message: "Oeuvre with the same values already exists" });
    }

    // If the Oeuvre doesn't exist, create a new one
    const newOeuvre = await oeuvreModel.create(req.body);
    res.status(201).json({ Oeuvre: newOeuvre, message: "Oeuvre added with success" });
  } catch (e) {
    res.status(400).json({
      error: e.message,
      message: "Oeuvre Not Added"
    });
  }
};
/*Find All Oeuvre*/ 
const FindAllOeuvre = async (req, res) => {
  try {
    const Oeuvres = await oeuvreModel
      .find()
      .populate('compositeurs')
      .populate('arrangeurs');

    if (!Oeuvres || Oeuvres.length === 0) {
      return res.status(404).json({ message: "Aucune oeuvre trouvée" });
    }

    res.status(200).json({
      Oeuvres: Oeuvres,
      message: "Oeuvres trouvées avec succès",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Impossible de récupérer les oeuvres",
    });
  }
};
/*Find One Oeuvre*/
const FindOneOeuvre = async (req, res) => {
  try {
    const Oeuvres = await oeuvreModel
      .findOne({ _id: req.params.id })
      .populate('compositeurs') // Populer le champ 'compositeurs'
      .populate('arrangeurs'); // Populer le champ 'arrangeurs'

    if (!Oeuvres) {
      return res.status(404).json({ message: "Oeuvre Not Found" });
    }

    res.status(200).json({
      Oeuvres: Oeuvres,
      message: "Oeuvre Founded!!",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "We can't fetch Oeuvre",
    });
  }
};
/*Update One Oeuvre*/ 
 const UpdateOeuvre = async (req, res) => { 
  try {
  
  const Oeuvres = await oeuvreModel.findOneAndUpdate( { _id: req.params.id },req.body,{ new: true });

  if(!Oeuvres){ 
      return res.status(404).json({ message: "Oeuvre Not Found" });
  }
  
    res.status(200).json({
      Oeuvres: Oeuvres,
      message: "Oeuvre Updated!!",
    });
    
} catch (error) {
  res.status(500).json({
      error: error.message,
      message: "We can't Update Oeuvre",
    });
}
};


/* Delete One Oeuvre */
 const DeleteOeuvre = async (req, res) => {
  try {
    // Find the Oeuvre to be deleted
    const oeuvreToDelete = await oeuvreModel.findById(req.params.id);

    if (!oeuvreToDelete) {
      return res.status(404).json({ message: "Oeuvre not found" });
    }

    // Delete the Oeuvre
    await oeuvreModel.deleteOne({ _id: req.params.id });

    // Remove the reference from the oeuvres_liste array in all related Programme documents
    await programmeModel.updateMany(
      { oeuvres_liste: { $in: [req.params.id] } },
      { $pull: { oeuvres_liste: req.params.id } }
    );

    res.status(200).json({ message: "Oeuvre and associated references in programme list deleted successfully" });

  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Unable to delete Oeuvre",
    });
  }
};
module.exports = {
  DeleteOeuvre,UpdateOeuvre,FindOneOeuvre,FindAllOeuvre,AddOeuvre
};








