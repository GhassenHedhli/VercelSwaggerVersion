const programmeModel = require("../models/Programme.js");
const concertModel = require("../models/Concert.js");

// THIS PART U SHOULD DELETE IT {Start}



/*Add One Programme*/ 
 const AddProgramme = async (req, res) => {
  try {
    // Check if an Programme with the same values already exists
    const { nom_programme } = req.body;
    const existingProgramme = await programmeModel.findOne({ nom_programme });

    if (existingProgramme) {
      // If the Programme already exists, return a 409 Conflict status
      return res.status(409).json({ message: "Programme with the same values already exists" });
    }

    // If the Programme doesn't exist, create a new one
    const newProgramme = await programmeModel.create(req.body);
    res.status(201).json({ Programme: newProgramme, message: "Programme added with success" });
  } catch (e) {
    res.status(400).json({
      error: e.message,
      message: "Programme Not Added"
    });
  }
};
/*Find All Programme*/ 
 const FindAllProgramme = async (req, res) => {
  try {
    const Programmes = await programmeModel.find().populate({path: 'oeuvres_liste'}).exec();

    if (!Programmes || Programmes.length === 0) {
      return res.status(404).json({ message: "Programmes Not Found" });
    }

    res.status(200).json({
      Programmes: Programmes,
      message: "Programmes Founded!!",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "We can't fetch Programmes",
    });
  }
};
/*Find One Programme*/
 const FindOneProgramme = async(req,res)=>{
  try {
    const Programmes = await programmeModel.findOne({_id:req.params.id}).populate({path: 'oeuvres_liste'}).exec();

    if (!Programmes ) {
      return res.status(404).json({ message: "Programme Not Found" });
    }

    res.status(200).json({
      Programmes: Programmes,
      message: "Programme Founded!!",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "We can't fetch Programme",
    });
  }
};
/* Update One Programme */
const UpdateProgramme = async (req, res) => {
  try {
    const { oeuvres_liste, ...restOfFields } = req.body;

    const existingProgramme = await programmeModel.findById(req.params.id);

    if (!existingProgramme) {
      return res.status(404).json({ message: "Programme Not Found" });
    }

    let updatedProgramme;

    if (oeuvres_liste) {
      // Check for duplicate values before updating oeuvres_liste
      const uniqueOeuvresListe = oeuvres_liste.filter(
        (oeuvre) => !existingProgramme.oeuvres_liste.includes(oeuvre)
      );

      updatedProgramme = await programmeModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: restOfFields, // Use $set to update other specified fields
          $push: { oeuvres_liste: { $each: uniqueOeuvresListe } }, // Use $push to add new values to oeuvres_liste
        },
        { new: true }
      );
    } else {
      updatedProgramme = await programmeModel.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );
    }

    if (!updatedProgramme) {
      return res.status(404).json({ message: "Programme Not Found" });
    }

    res.status(200).json({
      Programme: updatedProgramme,
      message: "Programme Updated!!",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "We can't Update Programme",
    });
  }
};

/* Delete One Programme */
 const DeleteProgramme = async (req, res) => {
  try {
    // Find the program to get the nom_programme value
    const programToDelete = await programmeModel.findOne({ _id: req.params.id });

    if (!programToDelete) {
      return res.status(404).json({ message: "The Programme Was Not Found To Be Deleted. Try Another ID" });
    }

    // Get the nom_programme value
    const _idProgrammeToDelete = programToDelete._id;

    // Delete the program
    await programmeModel.deleteOne({ _id: req.params.id });

   // Remove the programme_concert attribute from Concert documents
   await concertModel.updateMany(
    { programme_concert: _idProgrammeToDelete._id },
    { $unset: { programme_concert: "" } }
  );

    res.status(201).json({ message: "Programme and Associated with Concerts Deleted With Success" });

  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "We can't Delete Programme",
    });
  }
};
 const DeleteReferenceOeuvreFromList_Oeuvre = async (req, res) => {
  try {

    // Remove the reference from the oeuvres_liste array in all related Programme documents
    await programmeModel.updateMany(
      { _id:req.params.idProg,oeuvres_liste: { $in: [req.params.idOeuvre] }},
      { $pull: { oeuvres_liste: req.params.idOeuvre} }
    );

    res.status(200).json({ message: "Oeuvre and associated references in programme list deleted successfully" });

  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Unable to delete reference Oeuvre From List_Oeuvre",
    });
  }
};
module.exports = {
  AddProgramme,FindAllProgramme,FindOneProgramme,UpdateProgramme,DeleteProgramme,DeleteReferenceOeuvreFromList_Oeuvre
};
