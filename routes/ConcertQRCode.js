const express=require("express");
const {ConcertForQR} =require ("../controllers/Concert.js");

const router = express.Router();
router.get("/concert", ConcertForQR);

module.exports = router;