const { v4: uuidv4 } = require('uuid');
const Pupitre = require("../models/Chef_pupitre.js");
const Concert = require("../models/Concert.js");

const generateRandomCin = () => {
  const randomCin = Math.floor(10000000 + Math.random() * 90000000);
  return randomCin.toString();
};

const generateRandomEmail = () => {
  const randomEmail = uuidv4() + "@example.com";
  return randomEmail;
};

const generateRandomPhoneNumber = () => {
  const randomPhoneNumber = Math.floor(1000000000 + Math.random() * 900000000);
  return randomPhoneNumber.toString();
};

const generateRandomStatut = () => {
  const statuts = ["Junior", "Senior"];
  const randomIndex = Math.floor(Math.random() * statuts.length);
  return statuts[randomIndex];
};

const generateRandomGender = () => {
  const genders = ["Male", "Female"];
  const randomIndex = Math.floor(Math.random() * genders.length);
  return genders[randomIndex];
};

const generateRandomHeight = () => {
  const randomHeight = Math.floor(150 + Math.random() * 30);
  return randomHeight;
};

const generateRandomConcert = async () => {
  try {
    const concerts = await Concert.find();
    const randomIndex = Math.floor(Math.random() * concerts.length);
    return concerts[randomIndex]._id;
  } catch (error) {
    console.error('Error fetching concerts:', error);
    throw error;
  }
};

const insertMockPupitreData = async () => {
  try {
    const mockData = await Promise.all(
      Array.from({ length: 4 }, async (_, index) => {
        return {
          __t: 'pupitre',  // Set the discriminator field
          statut: generateRandomStatut(),
          concert: await generateRandomConcert(), // Await for the promise to resolve
          cin: generateRandomCin(),
          firstname: `FirstName${index + 1}`,
          lastname: `LastName${index + 1}`,
          email: generateRandomEmail(),
          sexe: generateRandomGender(),
          tel: generateRandomPhoneNumber(),
          tailleM: generateRandomHeight(),
        };
      })
    );

    await Pupitre.insertMany(mockData);
  } catch (error) {
    console.error('Error inserting mock pupitre data:', error);
  }
};

module.exports = insertMockPupitreData;
