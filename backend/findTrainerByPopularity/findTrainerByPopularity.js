//Import The trainer model
const trainerProfileModel = require('../models/trainerModels');

//Find trainers by category
exports.getTrainerByPopularity = (req, res) => {
    trainerProfileModel.find(
        
    )
    .then((doc) => res.send(doc))
    .catch((err) => res.send(err.data));
}