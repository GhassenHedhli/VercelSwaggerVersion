const express = require("express");
const {
   // parseExcelFile,
    AddConcert,
    FindAllConcerts,
    FindOneConcert,
    UpdateConcert,
    DeleteConcert
} = require("../controllers/Concert.js");

const {
    AddOeuvre,
    FindAllOeuvre,
    FindOneOeuvre,
    UpdateOeuvre,
    DeleteOeuvre
} = require("../Controllers/Oeuvre.js");

const {
    AddProgramme,
    FindAllProgramme,
    FindOneProgramme,
    UpdateProgramme,
    DeleteProgramme,
    DeleteReferenceOeuvreFromList_Oeuvre
} = require("../controllers/Programme.js");

const router = express.Router();
// CRUD Oeuvre
router.post('/AddOeuvre', AddOeuvre)
router.get('/FindAllOeuvre', FindAllOeuvre)
router.get('/FindOneOeuvre/:id', FindOneOeuvre)
router.patch('/UpdateOeuvre/:id',UpdateOeuvre)
router.delete('/DeleteOeuvre/:id', DeleteOeuvre)
// CRUD Programme
router.post('/AddProgramme', AddProgramme)
router.get('/FindAllProgramme', FindAllProgramme)
router.get('/FindOneProgramme/:id', FindOneProgramme)
router.patch('/UpdateProgramme/:id',UpdateProgramme)
router.delete('/DeleteProgramme/:id', DeleteProgramme)
router.delete('/DeleteReferenceOeuvreFromList_Oeuvre/:idProg/:idOeuvre', DeleteReferenceOeuvreFromList_Oeuvre)
// CRUD Concert
//router.post('/parseExcelFile', parseExcelFile)
router.post('/AddConcert', AddConcert)
router.get('/FindAllConcerts', FindAllConcerts)
router.get('/FindOneConcert/:id', FindOneConcert)
router.patch('/UpdateConcert/:id',UpdateConcert)
router.delete('/DeleteConcert/:id', DeleteConcert);




module.exports = router;
