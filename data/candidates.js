const { v4: uuidv4 } = require('uuid');
const Candidat = require("../models/Candidat.js");
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

const generateRandomSituationPro = () => {
  const professions = ["Software Developer", "Data Scientist", "UX Designer", "Project Manager", "Software Engineer"];
  const randomIndex = Math.floor(Math.random() * professions.length);
  return professions[randomIndex];
};

const generateRandomConnaissanceMusic = () => {
  const musicLevels = ["Beginner", "Intermediate", "Advanced"];
  const randomIndex = Math.floor(Math.random() * musicLevels.length);
  return musicLevels[randomIndex];
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

const mockData = Array.from({ length: 10 }, (_, index) => {
  const currentDate = new Date();
  const isTenAM = currentDate.getHours() === 10 && currentDate.getMinutes() === 0;

  return {
    situationPro: generateRandomSituationPro(),
    connaissanceMusic: generateRandomConnaissanceMusic(),
    cin: generateRandomCin(),
    firstname: `FirstName${index + 1}`,
    lastname: `LastName${index + 1}`,
    email: generateRandomEmail(),
    sexe: generateRandomGender(),
    tel: generateRandomPhoneNumber(),
    tailleM: generateRandomHeight(),
    createdAt: isTenAM ? currentDate : undefined,
  };
});

const insertMockData = async () => {
  try {
    await Candidat.insertMany(mockData);
  } catch (error) {
    console.error('Error inserting mock data:', error);
  }
};
module.exports= insertMockData;
