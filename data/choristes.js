const { v4: uuidv4 } = require('uuid');
const Choriste = require("../models/Choriste.js");
const Concert = require("../models/Concert.js");

const generateRandomCin = () => {
  const randomCin = Math.floor(10000000 + Math.random() * 90000000); // Generates an 8-digit random number
  return randomCin.toString();
};

const generateRandomEmail = () => {
  const randomEmail = uuidv4() + "@example.com"; // Generates a random email using UUID
  return randomEmail;
};

const generateRandomPhoneNumber = () => {
  const randomPhoneNumber = Math.floor(1000000000 + Math.random() * 900000000); // Generates a 9-digit random number
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
  const randomHeight = Math.floor(150 + Math.random() * 30); // Generates a random height between 150 and 180
  return randomHeight;
};

const generateRandomConcert = async () => {
  try {
    const concerts = await Concert.find(); // Assuming you have concerts already in your database
    const randomIndex = Math.floor(Math.random() * concerts.length);
    return concerts[randomIndex]._id;
  } catch (error) {
    console.error('Error fetching concerts:', error);
    throw error;
  }
};

const insertMockChoristeData = async () => {
  try {
    const mockData = await Promise.all(
      Array.from({ length: 10 }, async (_, index) => {
        const currentDate = new Date();
        const isTenAM = currentDate.getHours() === 10 && currentDate.getMinutes() === 0;

        return {
          statut: generateRandomStatut(),
          concert: await generateRandomConcert(), // Wait for the promise to resolve
          cin: generateRandomCin(),
          firstname: `FirstName${index + 1}`,
          lastname: `LastName${index + 1}`,
          email: generateRandomEmail(),
          sexe: generateRandomGender(),
          tel: generateRandomPhoneNumber(),
          tailleM: generateRandomHeight(),
          createdAt: isTenAM ? currentDate : undefined,
        };
      })
    );

    await Choriste.insertMany(mockData);
  } catch (error) {
    console.error('Error inserting mock choriste data:', error);
  }
};

module.exports = insertMockChoristeData;
