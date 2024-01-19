// services/excelService.js
//const xlsx = require("xlsx");
const programmeModel = require("../models/Programme.js");
const Oeuvre = require('../Controllers/Oeuvre.js');
const concertModel = require("../models/Concert.js");
const qrcode =require("qrcode");
const fs=require("fs");
/*Add One Concert*/ 
const AddConcert = async(req, res) => {
  try {
    const { Date, lieu, programme_concert } = req.body;
  
    // Check if the programme exists before adding the concert
    const isProgrammeExist = await programmeModel.exists({ _id: programme_concert });
    if (!isProgrammeExist) {
      return res.status(400).json({ error: 'Invalid programme ID. Provide a valid programme ID.' });
    }
  
    // Create a new concert
    const newConcert = await concertModel.create({ Date, lieu, programme_concert });
  
    return res.status(201).json({ concert: newConcert, message: 'Concert added successfully.' });
  } catch (error) {
    console.error('Error adding concert:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// La saisie du programme peut se faire via un fichier excel selon un format spécifique {start}
//  const parseExcelFile = async (req, res) => {
//   try {
//     const filePath = req.body.filePath; 

//     const workbook = xlsx.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const data = xlsx.utils.sheet_to_json(sheet);
//     for (const row of data) {

//       const oeuvre = await oeuvreModel.findOneAndUpdate(// chouf lahna tnjm nafess ll ghoneya tetbadel marra tesst7a9 chourist ou marra le
//         { titre: row.Nom_Chonson, choeur: row.Chouriste },
//         { titre: row.Nom_Chonson, choeur: row.Chouriste },
//         { upsert: true, new: true }
//       );

//       // Find or create Programme
//       const programme = await programmeModel.findOneAndUpdate(
//         { nom_programme: row.Programme },
//         { nom_programme: row.Programme },
//         { upsert: true, new: true }
//       );

//       if (!programme.oeuvres_liste.includes(oeuvre._id)) {
//         programme.oeuvres_liste.push(oeuvre._id);
//         await programme.save();
//       }
//     }

//     res.status(200).json({ message: "Excel file processed successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
// // La saisie du programme peut se faire via un fichier excel selon un format spécifique {end}

/*Find All Concert*/ 
 const FindAllConcerts = async (req, res) => {
  try {
    const Concerts = await concertModel.find({}, ' -createdAt -updatedAt -__v').populate({path:'programme_concert',select: '-_id -createdAt -updatedAt -__v',populate: {
      path: 'oeuvres_liste',
      select: '-_id  -createdAt -updatedAt -__v',
    },}).exec();
    
    if (!Concerts || Concerts.length === 0) {
      return res.status(404).json({ message: "Concert Not Found" });
    }

    res.status(200).json({
      Concerts: Concerts,
      message: "Concert Found!!",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "We can't fetch Concert",
    });
  }
};

/*Find One Concert*/
 const FindOneConcert = async (req, res) => {
  try {
    const Concerts = await concertModel.find({_id:req.params.id}, ' -createdAt -updatedAt -__v').populate({path:'programme_concert',select: '-_id -createdAt -updatedAt -__v',populate: {
      path: 'oeuvres_liste',
      select: '-_id  -createdAt -updatedAt -__v',
    },}).exec();
    
    if (!Concerts || Concerts.length === 0) {
      return res.status(404).json({ message: "Concert Not Found" });
    }

    res.status(200).json({
      Concerts: Concerts,
      message: "Concert Found!!",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "We can't fetch Concert",
    });
  }
};

/*Update One Concert*/ 
 const UpdateConcert = async (req, res) => { 
  try {
  
  const Concerts = await concertModel.findOneAndUpdate( { _id: req.params.id },req.body,{ new: true });

  if(!Concerts){ 
      return res.status(404).json({ message: "Concert Not Found" });
  }
  
    res.status(200).json({
      Concerts: Concerts,
      message: "Concert Updated!!",
    });
    
} catch (error) {
  res.status(500).json({
      error: error.message,
      message: "We can't Update Concert",
    });
}
};

/*Delete One Concert*/ 
 const DeleteConcert = async (req, res) => {
  try {
     const Concerts = await concertModel.findOne({_id:req.params.id});

     if(!Concerts){ 
            return res.status(404).json({ message: "The Concert Was Not Found To Be Deleted. Try Another ID" });
      }

      await concertModel.deleteOne({ _id: req.params.id });
      res.status(201).json({ message: "Concert Deleted With Success" });

    } catch (error) {
      res.status(500).json({
          error: error.message,
          message: "We can't Delete Concert",
        });
    }
}
// const ConcertForQR=async (req, res) => {
//   const qrCodeURL = 'https://docs.google.com/forms/d/e/1FAIpQLScJ9jz8K_n2l58GGN8_zP8PJW8ETjT3VV2cOb1wicREJcYthg/viewform';
//   let qrCodeIndex = 1; // Index to generate unique names for QR codes

//   try {
//       // Generate the QR code
//       const qrCode = await qrcode.toDataURL(qrCodeURL);

//       // Save the QR code as an image file
//       const imagePath = `images/qrcode_${qrCodeIndex}.png`;
//       fs.writeFileSync(imagePath, qrCode.split(',')[1], 'base64');
//       // Increment the index for the next QR code
//       qrCodeIndex++;
//       // Send the path to the saved image in response
//       res.send(`<p>QR Code saved as <a href="${imagePath}" target="_blank">${imagePath}</a></p>`);
//   } catch (error) {
//       console.error('Error generating QR code:', error);
//       res.status(500).send('Internal Server Error');
//   }
// }
const ConcertForQR = async (req, res) => {
  try {
    // Fetch all concerts
    const concerts = await concertModel.find({}, 'lieu Date');

    // Generate and save QR code for each concert
    let qrCodeIndex = 1;
    const qrCodePromises = concerts.map(async (concert) => {
      const concertDetails = `${concert.lieu} - ${concert.Date}`;
      const qrCode = await qrcode.toDataURL(concertDetails);

      // Save the QR code as an image file
      const imagePath = `images/qrcode_${qrCodeIndex}.png`;
      fs.writeFileSync(imagePath, qrCode.split(',')[1], 'base64');
      // Increment the index for the next QR code
      qrCodeIndex++;

      return { concertDetails, imagePath };
    });

    // Wait for all QR codes to be generated
    const qrCodeResults = await Promise.all(qrCodePromises);

    // Send response with paths to the saved images
    const responseHtml = qrCodeResults.map(({ concertDetails, imagePath }) =>
      `<p>${concertDetails}: <a href="${imagePath}" target="_blank">${imagePath}</a></p>`
    );

    res.send(responseHtml.join('\n'));
  } catch (error) {
    console.error('Error generating QR codes:', error);
    res.status(500).send('Internal Server Error');
  }
};
// const AddOuvre = async(req,res)=>{
//   try {
//     const {
//       titre,
//       compositeurs,
//       arrangeurs,
//       annee,
//       genre,
//       paroles,
//       partition,
//       aPartieChorale,
//       sectionsChorale,
//       choeur,
//     } = req.body;

//     // Validate if compositeurs and arrangeurs exist
//     const existingCompositeurs = await Compositeur.find({ _id: { $in: compositeurs } });
//     const existingArrangeurs = await Arrangeur.find({ _id: { $in: arrangeurs } });

//     if (existingCompositeurs.length !== compositeurs.length || existingArrangeurs.length !== arrangeurs.length) {
//       return res.status(400).json({ error: 'Invalid compositeurs or arrangeurs provided. Provide valid IDs.' });
//     }

//     const newOeuvre = new Oeuvre({
//       titre,
//       compositeurs,
//       arrangeurs,
//       annee,
//       genre,
//       paroles,
//       partition,
//       aPartieChorale,
//       sectionsChorale,
//       choeur,
//     });

//     await newOeuvre.save();

//     return res.status(201).json({ message: 'Oeuvre created successfully.', oeuvre: newOeuvre });
//   } catch (error) {
//     console.error('Error creating oeuvre:', error.message);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// }
module.exports = {
  ConcertForQR,AddConcert,FindAllConcerts,FindOneConcert,UpdateConcert,DeleteConcert
};

