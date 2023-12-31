const express = require("express");
const {
    Ajouter_Chef_Pupitre,
} = require("../controllers/ChefPupitre.js");

const router = express.Router();
router.patch('/Ajouter_Chef_Pupitre', Ajouter_Chef_Pupitre)


module.exports = router;