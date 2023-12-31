const auditionModel = require("../models/Audition.js");
const personModel = require("../models/Personne.js");
const candidatModel = require("../models/Candidat.js");
/*Add One Candidat*/ 
 const AddCandidat = async(req, res) => {
  try { 
      const newCandidat = await candidatModel.create(req.body);
      res.status(201).json({Candidat: newCandidat, message: "Candidat added with success" });
    }
catch (e) {
  res.status(400).json({
      e:e.message,
      message:"Candidat Not Added"
  })
}
};
 const AddPersonne = async(req, res) => {
  try { 
   
      const newPersonne = await personModel.create(req.body);
      res.status(201).json({Personne: newPersonne, message: "Personne added with success" });
    }
catch (e) {
  res.status(400).json({
      e:e.message,
      message:"Personne Not Added"
  })
}
};
// THIS PART U SHOULD DELETE IT  {end} 



/* Add One Audition */
 const AddAudition = async (req, res) => {
  try {
    const { candidat_info, date, heureDeb, heureFin,numero_aud } = req.body;

    // Ensure required fields are present in the request
    if (!candidat_info || !date || !heureDeb || !heureFin||!numero_aud ) {
      return res.status(400).json({
        message: 'Required fields are missing.',
      });
    }

    // Create a new Audition object with the provided values
    const newAuditionData = {
      numero_aud,
      candidat_info,
      date,
      heureDeb,
      heureFin,
      tessiture:" ",
      appreciation:" ",
      extrait_music:" ",
      decision:" ",
      remarque:" ",
    };

    const newAudition = await auditionModel.create(newAuditionData);
    res.status(201).json({ Audition: newAudition, message: 'Audition added successfully' });
  } catch (e) {
    res.status(400).json({
      error: e.message,
      message: 'Audition not added',
    });
  }
};

/*Find All Audition !!!*/ 
 const FindAllAuditions = async (req, res) => {
  try {
    // Assuming 'Audition' is your model
    const auditions = await auditionModel.find({}, '-createdAt -updatedAt -__v')
      .populate({
        path: 'candidat_info',
        select: '-_id -createdAt -updatedAt -__v'
      })
      .exec();

    if (!auditions || auditions.length === 0) {
      return res.status(404).json({ message: "Auditions Not Found" });
    }

    res.status(200).json({
      auditions: auditions,
      message: "Auditions Found!!",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "We can't fetch Auditions",
    });
  }
};


/*Find One Audition !!!*/
 const FindOneAudition = async(req,res)=>{
  try {
    const Auditions = await auditionModel.findOne({_id:req.params.id}).populate({path:'candidat_info',select: '-_id -createdAt -updatedAt -__v'}).exec();
    if (!Auditions ) {
      return res.status(404).json({ message: "Auditions Not Found" });
    }

    res.status(200).json({
      Auditions: Auditions,
      message: "Auditions Founded!!",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "We can't fetch Auditions",
    });
  }
};

/*Update One Audition*/ 
 const UpdateAudition = async (req, res) => { 
  try {
    const updatedaudition = await auditionModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedaudition) { 
      return res.status(404).json({ message: "Audition Not Found" });
    }

    res.status(200).json({
      Audition: updatedaudition,
      message: "Audition Updated!!",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "We can't Update Audition",
    });
  }
};


/* Delete One Audition */
 const DeleteAudition = async (req, res) => {
  try {
    const audition = await auditionModel.findOne({ _id: req.params.id });

    if (!audition) {
      return res.status(404).json({ message: "The Audition Was Not Found To Be Deleted. Try Another ID" });
    }

    await auditionModel.deleteOne({ _id: req.params.id });
    res.status(201).json({ message: "Audition Deleted With Success" });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "We can't Delete Audition",
    });
  }
};

module.exports = {
  AddCandidat,AddPersonne,AddAudition,FindAllAuditions,FindOneAudition,UpdateAudition,DeleteAudition
};


