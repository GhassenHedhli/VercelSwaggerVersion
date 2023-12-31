const adminModel =require("../models/Admin.js");
const Participation = require('../models/Participation.js');
const PersonModel = require('../models/Personne.js');
const Programme = require('../models/Programme.js');
const Concert = require('../models/Concert.js');
const Oeuvre = require('../models/Oeuvre.js');
const Repetition =require('../models/Repitition.js');

 const AddAdmin=async(req,res)=>{
    try{
        const newAdmin = await adminModel.create(req.body);
      res.status(201).json({Admin: newAdmin, message: "Admin added with success" });
       
    }
    catch(error){
        console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error " });
    }
}
const GetThFilterConcertRep = async (req, res) => {
  try {
    const idChoriste = req.params.idChoriste;
    const { year,title } = req.query;

    const commonQuery = {
      choriste: idChoriste,
      createdAt: {
        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        $lte: new Date(`${year}-12-31T23:59:59.999Z`),
      },
    };
    // Fetch the number of attended repetitions and concerts
    const attendedRepetitions = await Participation.countDocuments({
      ...commonQuery,
      theme: 'Repetition',
      presence: true,
    });

    const attendedConcerts = await Participation.countDocuments({
      ...commonQuery,
      theme: 'Concert',
      presence: true,
    });

    // Fetch the number of not attended repetitions and concerts
    const notAttendedRepetitions = await Participation.countDocuments({
      ...commonQuery,
      theme: 'Repetition',
      presence: false,
    });

    const notAttendedConcerts = await Participation.countDocuments({
      ...commonQuery,
      theme: 'Concert',
      presence: false,
    });

    const allConcerts = await Concert.find({
      createdAt: {
        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        $lte: new Date(`${year}-12-31T23:59:59.999Z`),
      },
    }).populate('programme_concert');
    const allPrograms = await Programme.find({
      createdAt: {
        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        $lte: new Date(`${year}-12-31T23:59:59.999Z`),
      },
    }).populate('oeuvres_liste');

    // Fetch all works for the specified year
    const allWorks = await Oeuvre.find({
      'programme_liste.createdAt': {
        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        $lte: new Date(`${year}-12-31T23:59:59.999Z`),
      },
      'programme_liste.oeuvre.titre': { $regex: new RegExp(title || ''), $options: 'i' }
    });
    return res.status(200).json({
      attendedRepetitions,
      attendedConcerts,
      notAttendedRepetitions,
      notAttendedConcerts,
      allConcerts,
      allPrograms,
      allWorks
    });
  } catch (error) {
    console.error('Error fetching choriste statistics:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

const AbsenceStatus = async(req,res)=>{
  try {
    const { date, startDate, endDate, programId, choristeId, pupitreId } = req.query;

    // Validate and parse dates
    const parsedDate = date ? new Date(date) : null;
    const parsedStartDate = startDate ? new Date(startDate) : null;
    const parsedEndDate = endDate ? new Date(endDate) : null;

    // Build the common query
    const commonQuery = {};

    if (parsedDate) {
      commonQuery.createdAt = {
        $gte: parsedDate,
        $lte: new Date(parsedDate.getTime() + 86400000), // Add one day to include the whole day
      };
    } else if (parsedStartDate && parsedEndDate) {
      commonQuery.createdAt = {
        $gte: parsedStartDate,
        $lte: new Date(parsedEndDate.getTime() + 86400000), // Add one day to include the whole day
      };
    }
    const absenceStatusQuery = {
      ...commonQuery,
      theme: 'Repetition',
      presence: false,
    };
     // Filter by choristeId if provided
     if (choristeId) {
      const isChoriste = await PersonModel.exists({ _id: choristeId, __t: 'choriste' });
      if (!isChoriste) {
        return res.status(404).json({ error: 'Invalid choristeId. Provide a valid choristeId.' });
      }
      absenceStatusQuery.choriste = choristeId;
    }

    // Filter by pupitreId if provided
    if (pupitreId) {
      const isPupitre = await PersonModel.exists({ _id: pupitreId, __t: 'pupitre' });
      if (!isPupitre) {
        return res.status(404).json({ error: 'Invalid pupitreId. Provide a valid pupitreId.' });
      }
      absenceStatusQuery.pupitre = pupitreId;
    }

    const absenceStatus = await Participation.find(absenceStatusQuery).populate({
        path: 'repetition',
        model: Repetition,
        populate: {
          path: 'programme_concert',
          model: Programme,
        },
      });
    // Filter by programId if provided
    const filteredAbsenceStatus = programId
      ? absenceStatus.filter((status) => status.repetition.programme_concert._id.toString() === programId)
      : absenceStatus;


    return res.status(200).json({ absenceStatus : filteredAbsenceStatus  });
  } catch (error) {
    console.error('Error fetching absence status:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
//concert stats
const getConcertStatistics = async (req, res) => {
  try {
    const concertId = req.params.concertId; // Assuming concertId is a parameter in the route

    if (!concertId) {
      return res.status(400).json({ error: 'Concert ID is required.' });
    }

    const concert = await Concert.findById(concertId);
    if (!concert) {
      return res.status(404).json({ error: 'Concert not found' });
    }

    const attendedChoristes = await Participation.countDocuments({
      theme: 'Concert',
      presence: true,
      'repetition.programme_concert': concertId,
    });

    const absentChoristes = await Participation.countDocuments({
      theme: 'Concert',
      presence: false,
      'repetition.programme_concert': concertId,
    });

    return res.json({
      concert,
      attendedChoristes,
      absentChoristes,
    });
  } catch (error) {
    return res.status(500).json({ error: `Error getting concert statistics: ${error.message}` });
  }
};
// ouvre stats
const getOeuvreStatistics = async (req, res) => {
  try {
    const oeuvreId = req.params.oeuvreId; // Assuming oeuvreId is a parameter in the route

    if (!oeuvreId) {
      return res.status(400).json({ error: 'Oeuvre ID is required.' });
    }

    const oeuvre = await Oeuvre.findById(oeuvreId);
    if (!oeuvre) {
      return res.status(404).json({ error: 'Oeuvre not found' });
    }

    // Ensure oeuvre.programmes is an array
    const programmesArray = Array.isArray(oeuvre.programmes) ? oeuvre.programmes : [oeuvre.programmes];

    const choristesPerformed = await Participation.distinct('choriste', {
      theme: 'Concert',
      'repetition.programme_concert': { $in: programmesArray },
      presence: true,
    });

    const performancesCount = choristesPerformed.length;

    return res.json({
      oeuvre,
      performancesCount,
      choristesPerformed,
    });
  } catch (error) {
    return res.status(500).json({ error: `Error getting oeuvre statistics: ${error.message}` });
  }
};

//choriste stats
const getChoristeStatistics = async (req, res) => {
  try {
    const choristeId = req.params.choristeId; // Assuming choristeId is a parameter in the route

    if (!choristeId) {
      return res.status(400).json({ error: 'Choriste ID is required.' });
    }

    const isChoriste = await PersonModel.exists({ _id: choristeId, __t: 'choriste' });
    if (!isChoriste) {
      return res.status(404).json({ error: 'Invalid choristeId. Provide a valid choristeId.' });
    }

    const choriste = await PersonModel.findById(choristeId);
    if (!choriste || choriste.__t !== 'choriste') {
      throw new Error('Invalid choriste ID');
    }

    const attendedRepetitions = await Participation.countDocuments({
      theme: 'Repetition',
      presence: true,
      choriste: choristeId,
    });

    const attendedConcerts = await Participation.countDocuments({
      theme: 'Concert',
      presence: true,
      choriste: choristeId,
    });

    return res.json({
      choriste,
      attendedRepetitions,
      attendedConcerts,
    });
  } catch (error) {
    return res.status(500).json({ error: `Error getting choriste statistics: ${error.message}` });
  }
};


module.exports={AddAdmin,GetThFilterConcertRep,AbsenceStatus,getConcertStatistics,getOeuvreStatistics,getChoristeStatistics}