const { createArrangeur, getArrangeurById } = require('../models/Arrangeur');

const createArrangeurController = async (req, res) => {
  const { nom, prenom } = req.body;
  try {
    const newArrangeur = await createArrangeur({ nom, prenom });
    res.status(201).json({ message: 'Arrangeur créé avec succès', arrangeur: newArrangeur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'arrangeur', error: error.message });
  }
};

const getArrangeurController = async (req, res) => {
  const arrangeurId = req.params.id;
  try {
    const arrangeur = await getArrangeurById(arrangeurId);
    if (!arrangeur) {
      return res.status(404).json({ message: 'Arrangeur non trouvé' });
    }
    res.status(200).json({ arrangeur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'arrangeur', error: error.message });
  }
};

module.exports = {
  createArrangeurController,
  getArrangeurController
};

