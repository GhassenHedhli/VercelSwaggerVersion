const { createCompositeur, getCompositeurById } = require('../models/Compositeur.js');

const createCompositeurController = async (req, res) => {
  const { nom, prenom } = req.body;
  try {
    const newCompositeur = await createCompositeur({ nom, prenom });
    res.status(201).json({ message: 'Compositeur créé avec succès', compositeur: newCompositeur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du compositeur', error: error.message });
  }
};

const getCompositeurController = async (req, res) => {
  const compositeurId = req.params.id;
  try {
    const compositeur = await getCompositeurById(compositeurId);
    if (!compositeur) {
      return res.status(404).json({ message: 'Compositeur non trouvé' });
    }
    res.status(200).json({ compositeur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du compositeur', error: error.message });
  }
};

module.exports = {
  createCompositeurController,
  getCompositeurController
};



