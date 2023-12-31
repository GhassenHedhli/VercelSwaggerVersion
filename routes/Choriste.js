const express = require("express");
const {
    addChoristeResponse,
    sendMailConfirmation,
    ChoristesThatConfirmed,
    
} = require("../controllers/Choriste.js");

const router = express.Router();
router.post('/addChoristeResponse', addChoristeResponse)
router.get('/sendMailConfirmation', sendMailConfirmation)
router.get('/ChoristesThatConfirmed', ChoristesThatConfirmed)



module.exports = router;