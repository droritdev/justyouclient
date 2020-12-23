//Import The trainer model
const trainerProfileModel = require('../models/trainerModels');

//Find trainers of a specific place
exports.getTrainersOfPlace = (req, res) => {
    trainerProfileModel.find(
        {
            placeId: req.body.placeId
        } 
    )
    .then((doc) => res.send(doc))
    .catch((err) => res.send(err))
}