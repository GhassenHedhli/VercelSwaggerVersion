const Participation = require("../models/Participation.js");
const personModel = require("../models/Personne.js");
const cron = require('node-cron');


const saveParticipationByChefPupitre= async(req, res)=>{
try {
  const { concertId, repetitionId, choristeId } = req.body;

  if (!concertId && !repetitionId) {
    return res.status(400).json({ error: 'Provide either concertId or repetitionId in the request body.' });
  }

  let choristes;

  // Check if choristeId is provided in the request body
  if (choristeId) {
    const choriste = await personModel.findById(choristeId);
    if (!choriste || choriste.__t !== 'choriste') {
      return res.status(404).json({ error: 'Invalid choristeId. Provide a valid choristeId.' });
    }
    choristes = [choriste];
  } else {
    // If no choristeId is provided, update all choristes with __t set to 'choriste'
    choristes = await personModel.find({ __t: 'choriste' });
  }

  const participationData = {
    presence: req.body.presence || false,
    raison: req.body.raison || '',
    choriste: choristeId,
  };
  if (concertId) {
    participationData.theme = 'Concert';
    participationData.concert = concertId;
  } else {
    participationData.theme = 'Repetition';
    participationData.repetition = repetitionId;
  }

  const participation = new Participation(participationData);
  await participation.save();

  return res.status(201).json({ message: 'Participation saved successfully.' });
} catch (error) {
  console.error('Error saving participation:', error.message);
  return res.status(500).json({ error: 'Internal Server Error' });
}


}



let notif;
const updateChoristeDetails = async (req, res) => {
  try {
    let choristes;
    // Check if a choriste ID is provided in the request
    if (req.params.id) {
      const choriste = await personModel.findById(req.params.id);
      if (!choriste) {
        return res.status(404).json({ message: 'Choriste not found' });
      }
      choristes = [choriste];
    } else {
      // If no choriste ID is provided, update all choristes
      choristes = await personModel.find({ __t: 'choriste' });
      // Check if choristes is empty
      if (!choristes.length) {
        return res.status(404).json({ message: 'No choristes found' });
      }
    }
    const updatedChoristes = choristes.filter((choriste) => {
      const updatedStatut = req.body.statut || choriste.statut;
      return choriste.statut !== updatedStatut && choriste._id.toString() === req.params.id;
    });
    if (updatedChoristes.length > 0) {
      // Schedule notification for updated choristes
      scheduleNotification(updatedChoristes);
    }
    // Iterate through each choriste
    for (const choriste of choristes) {
      // Update the statut based on the values provided in req.body
      choriste.statut = req.body.statut || choriste.statut;

      // Save the updated choriste
      await choriste.save();
    }
    
    return res.status(200).json({ message: 'Choriste statuts updated successfully' });

  } catch (error) {
    console.error('Error updating choriste statuts:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const scheduleNotification = (updatedChoristes) => {
  // You can customize the schedule based on your requirements
  if (notif) {
    notif.stop();
  }

  notif = cron.schedule(
    // Set the cron schedule here
    '0 10 * * *', // Example: Runs every day at 8:00 AM
    () => {
      // Logic to send notifications to choristes with updated details
      updatedChoristes.forEach((choriste) => {
        console.log(`Sending notification to Choriste ID: ${choriste._id} - Updated statut: ${choriste.statut}`);
      });
    },
    {
      scheduled: false,
    }
  );

  notif.start();
};




module.exports = { saveParticipationByChefPupitre, updateChoristeDetails };
