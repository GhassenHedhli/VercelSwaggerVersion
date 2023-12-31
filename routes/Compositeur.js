const express = require('express');
const router = express.Router();
const compositeurController = require('../controllers/Compositeur');

// Route pour la création d'un compositeur
router.post('/compositeurs', compositeurController.createCompositeurController);

// Route pour obtenir un compositeur par son ID
router.get('/compositeurs/:id', compositeurController.getCompositeurController);

module.exports = router;

