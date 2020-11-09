//Import The trainer model 
const trainerProfileModel = require('../models/trainerModels');

//Add trainer to a place trainers list
exports.addTrainerToPlace = (req, res) => {
    trainerProfileModel.findByIdAndUpdate(
        {_id: req.body.id},
        {placeId: req.body.placeId} 
    )
    .then((doc) => res.send(doc))
    .catch((err) => res.send(err));
}