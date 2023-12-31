const express=require("express");
//import {notifyAdmin} from "../controllers/Admin.js"
const {AddAdmin,GetThFilterConcertRep,AbsenceStatus,getConcertStatistics,getOeuvreStatistics,getChoristeStatistics} = require("../controllers/Admin.js");
const router = express.Router();
router.post("/AddAdmin",AddAdmin);
router.get("/AbscenceStatus",AbsenceStatus);
router.get("/GetFiltersChoriste/:idChoriste",GetThFilterConcertRep);
router.get("/getConcertStatistics/:concertId",getConcertStatistics);
router.get("/getOeuvreStatistics/:oeuvreId",getOeuvreStatistics);
router.get("/getChoristeStatistics/:choristeId",getChoristeStatistics);

module.exports= router;

