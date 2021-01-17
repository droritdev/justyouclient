//Import The client model
const trainerProfileModel = require('../models/trainerModels');

//Find tainer by id
exports.findTrainerByID = (req, res) => {
    trainerProfileModel.findById(req.params.id)
    .then((doc) => res.send(doc))
    .catch((err) => res.send(err.data));
}