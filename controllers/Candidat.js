
const Candidat= require("../models/Candidat.js");
const Audition= require("../models/Audition.js");
const sendMail= require("../controllers/Sendmail.js");

 const GetUser= async(req,res)=>{
  try {
    const { page = 1, limit = 10, firstname, lastname } = req.query;

    const query = {};

    if (firstname) {
      query.firstname = { $regex: new RegExp(firstname), $options: "i" };
    }

    if (lastname) {
      query.lastname = { $regex: new RegExp(lastname), $options: "i" };
    }

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    const candidates = await Candidat.find(query)
      .limit(parsedLimit)
      .skip((parsedPage - 1) * parsedLimit);

    const totalCount = await Candidat.countDocuments(query);

    const totalPages = Math.ceil(totalCount / parsedLimit);

    if (parsedPage > totalPages || parsedPage < 1) {
      console.log("Total pages:", totalPages);
      return res.status(400).json({ error: "Invalid page number" });
    }
    res.json({
      candidates,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }}

   const saveAndSendMailAudition = async (req, res) => {
    try {
      const { numCandidates, debutheure, finheure, duration, ...auditionDetails } = req.body;
  
      // Fetch all candidates
      const candidates = await Candidat.find();
  
      // Calculate the number of auditions needed
      const numAuditions = Math.ceil(numCandidates / 3);
  
      // Create an array to store the promises of updating candidates
      const updatePromises = [];
  
      // Iterate through the number of auditions
      for (let i = 0; i < numAuditions; i++) {
        // Calculate the start and end index for candidates in this audition
        const startIndex = i * 3;
        const endIndex = Math.min((i + 1) * 3, numCandidates);
  
        // Get candidates for this audition
        const auditionCandidates = candidates.slice(startIndex, endIndex);
  
        // Create an array to store the promises for this audition
        const auditionPromises = auditionCandidates.map(async (candidate, index) => {
          // Check if the email is already in the Audition table
          const existingAudition = await Audition.findOne({ emails: candidate.email });
  
          if (existingAudition) {
            console.log(`Audition for ${candidate.email} already exists. Skipping.`);
            return;
          }
  
          // Create the audition
          const audition = await Audition.create({
            ...auditionDetails,
            email: auditionCandidates.map(candidate => candidate.email),
            date: new Date(),
            heureDeb: debutheure + index,
            heureFin: debutheure + index + 1,
            candidates: auditionCandidates.map(candidate => candidate._id),
          });
  
          // Associate the candidate with the audition
          await Candidat.findByIdAndUpdate(candidate._id, { $push: { auditions: audition._id } });
  
          // Send an email to the candidate
          const resetURL = `<h1>Your audition has been scheduled</h1><p>Audition ID: ${audition._id}</p>`;
          const data = {
            to: candidate.email,
            text: `Your audition has been scheduled. Audition ID: ${audition._id}`,
            subject: "Audition Scheduled",
            html: resetURL,
          };
          await sendMail(data);
        });
  
        // Add the promises for this audition to the main array
        updatePromises.push(...auditionPromises);
      }
  
      // Wait for all promises to complete
      await Promise.all(updatePromises);
  
      res.status(201).json({ success: true, message: 'Auditions and candidate associations created successfully.' });
    } catch (error) {
      console.error("Error in saveAndSendMailAudition:", error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };

 const showAllAuditions= async(req,res)=>{
  try{
    const allAudition =await Audition.find()
    if(!allAudition){
      return res.status(404).send('No auditions found')
    }
    res.status(200).json(allAudition)
  }catch(error){
    console.error("Error in check it check it:", error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}


 const sendMailAbscent = async (req, res) => {
  try {
    const { sendMailType, emailList, debutheure, finheure, duration, ...auditionDetails } = req.body;

    const sendEmailPromises = emailList.map(async (email, index) => {
      // Check if the email exists in the candidate database
      const candidate = await Candidat.findOne({ email });

      if (candidate) {
        // Create the audition
        const audition = await Audition.create({
          ...auditionDetails,
          email: email,
          date: new Date(),
          heureDeb: debutheure + index,
          heureFin: debutheure + index + 1,
        });

        // Send an email to the specified email address
        if (sendMailType === "FirstAbsent") {
          const resetURL = `<h1>Your new audition has been scheduled</h1><p>Audition ID: ${audition._id}</p>`;
          const data = {
            to: email,
            text: `Your audition has been scheduled. Audition ID: ${audition._id}`,
            subject: "You've been abscent and this resend it ",
            htm: resetURL,
          };

          // Only send the email if the sendMailType is "FirstAbsent"
          await sendMail(data);
        }
      } else {
        // Handle the case when the email is not found in the candidate database
        console.log(`Candidate not found for email: ${email}`);
      }
    });

    // Wait for all promises to complete
    await Promise.all(sendEmailPromises);

    res.json({ success: true, message: 'Audition and email associations created successfully.' });
  } catch (error) {
    console.error("Error in saveAndSendMailAudition:", error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


const AddCandidat = async(req, res) => {
  try { 
      const newCandidat = await Candidat.create(req.body);
      res.status(201).json({Candidat: newCandidat, message: "Candidat added with success" });
    }
catch (e) {
  res.status(400).json({
      e:e.message,
      message:"Candidat Not Added"
  })
}
};















module.exports={
  GetUser,
  saveAndSendMailAudition,
  showAllAuditions,
  sendMailAbscent,
  AddCandidat
}