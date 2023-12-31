const express = require("express");
const {
    AddAudition,
    FindAllAuditions,
    FindOneAudition,
    UpdateAudition,
    AddCandidat,
    DeleteAudition,
    AddPersonne
} = require("../controllers/Audition.js");

const router = express.Router();
router.post('/AddAudition', AddAudition)
router.get('/FindAllAuditions', FindAllAuditions )
router.get('/FindOneAudition/:id',FindOneAudition)
router.patch('/UpdateAudition/:id',UpdateAudition)
router.delete('/DeleteAudition/:id', DeleteAudition)



router.post('/AddPersonne', AddPersonne)
router.post('/AddCondidat', AddCandidat)
module.exports = router;