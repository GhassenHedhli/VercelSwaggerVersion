const express = require("express");
const {AddRep} = require("../controllers/Repetition.js");

const router = express.Router();
router.post("/repetition", AddRep);
module.exports = router;