const choristeModel = require("../models/Choriste.js");
const chefpupitreModel = require("../models/ChefPupitre.js");

    const Ajouter_Chef_Pupitre = async (req, res) => {
        const id_choriste=req.body.id
        try {
            const choriste = await choristeModel.findOne({ _id: id_choriste }).select("-createdAt -__v -updatedAt -__t -_id ");;
    
            if (!choriste) {
                return res.status(404).send({ message: 'Choriste not found.' });
            } 
             console.log(choriste)
            const newChefPupitre = new chefpupitreModel({
                ...choriste.toObject(),
            });
          
  // Save the new Choriste document
  await newChefPupitre.save();
  await choristeModel.deleteOne({ _id: id_choriste });
            res.status(200).send({ message: 'Chef de pupitre ajouté !' });
        } catch (err) {
            console.error(err);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    };
    module.exports = {
        Ajouter_Chef_Pupitre
      };