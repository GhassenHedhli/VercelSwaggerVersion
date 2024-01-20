const express = require('express');
const router = express.Router();
const arrangeurController = require('../controllers/Arrangeur.js');

// Route pour la création d'un arrangeur
router.post('/arrangeurs', arrangeurController.createArrangeurController);

// Route pour obtenir un arrangeur par son ID
router.get('/arrangeurs/:id', arrangeurController.getArrangeurController);

module.exports = router;

