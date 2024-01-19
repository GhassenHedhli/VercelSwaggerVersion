const Choriste=require("../models/Choriste.js");
const Concert=require("../models/Concert.js");
const Disponibilite=require("../models/Disponibilite.js");
const sendMail= require("../controllers/Sendmail.js");


const addChoristeResponse = async (req, res) => {
  try {
    const { choristeId, concertId, confirmation, ...additionalData } = req.body;
    
    // Check if choriste and concert IDs are valid
    const isValidChoriste = await Choriste.exists({ _id: choristeId });
    const isValidConcert = await Concert.exists({ _id: concertId });

    
    if (!isValidChoriste || !isValidConcert) {
      throw new Error('Invalid choriste or concert ID.');
    }
    // Use create method to save the document to the database
    const savedDisponibilite = await Disponibilite.create({
      choriste: choristeId,
      concert: concertId,
      date: new Date(),
      confirmation: confirmation || 'not_confirm',
      ...additionalData,
    });

    res.status(201).json({ response: savedDisponibilite, message: 'Choriste response added with success' });
  } catch (error) {
    console.error('Error adding choriste response:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const sendMailConfirmation = async(req,res)=>{
  try {
    const disponibilites = await Disponibilite.find({ confirmation: 'confirm' });

    // Fetch choristes and concerts using the IDs
    const choristeIds = disponibilites.map((disponibilite) => disponibilite.choriste);
    const concertIds = disponibilites.map((disponibilite) => disponibilite.concert);

    const choristes = await Choriste.find({ _id: { $in: choristeIds } });
    const concerts = await Concert.find({ _id: { $in: concertIds } });

    // Send email to each choriste for each disponibilite
    disponibilites.forEach(async (disponibilite) => {
      const choriste = choristes.find((c) => c._id.equals(disponibilite.choriste));
      const concert = concerts.find((c) => c._id.equals(disponibilite.concert));

      const resetURL = `<h1>Your audition has been scheduled</h1><p>Audition ID: ${disponibilite.concert}</p><p>Concert Name: ${concert.name}</p>`;
      const data = {
        to: choriste.email,
        text: `Your concert participation has been confirmed. Concert ID: ${disponibilite.concert}, Concert Name: ${concert.name}`,
        subject: "Concert Confirmation",
        html: resetURL,
      };

      await sendMail(data);
    });

    res.status(200).json({ choristes, message: 'Choristes fetched successfully' });
  } catch (error) {
    console.error('Error fetching choristes by confirmation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
const ChoristesThatConfirmed=async(req,res)=>{
  try
  {
    const disponibilites = await Disponibilite.find({ confirmation: 'confirm' }).select('choriste');

    const choristeIds = disponibilites.map((disponibilite) => disponibilite.choriste);

    
    const choristes = await Choriste.find({ _id: { $in: choristeIds } });
    res.status(200).json({ choristes, message: 'Choristes fetched successfully' });
  }catch (error) {
    console.error('Error fetching choristes by confirmation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports={addChoristeResponse,sendMailConfirmation,ChoristesThatConfirmed}