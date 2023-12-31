const express=require("express");
const {saveParticipationByChefPupitre,updateChoristeDetails} = require("../controllers/Chef_pupitre.js");



const router = express.Router();
router.post("/AddParticipation",saveParticipationByChefPupitre);
router.patch("/UpdateChoriste/:id",updateChoristeDetails);


module.exports= router;