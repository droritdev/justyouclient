//Import the trainer model
const trainerProfileModel = require('../models/trainerModels');

//Show all trainer's comments
exports.allTrainers = (req, res) => {
    trainerProfileModel.find({})
    .then((doc) => res.send(doc))
    .catch((err) => res.send(err))
}