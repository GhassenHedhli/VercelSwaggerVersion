const express=require("express");
const {AddCandidat,GetUser, saveAndSendMailAudition,showAllAuditions,sendMailAbscent} =require("../controllers/Candidat.js");


const router = express.Router();
router.post("/AddCandidat",AddCandidat)
router.get("/getCandidat", GetUser);
router.post("/saveandsendmail", saveAndSendMailAudition);
router.get("/getAllAudition", showAllAuditions);
router.post("/sendMailAbscent",sendMailAbscent);
module.exports =router;