//Import the trainer model
const trainerProfileModel = require('../models/trainerModels');

//Place removes a trainer from his trainers list
exports.removeTrainerFromPlace = (req, res) => {
    trainerProfileModel.findByIdAndUpdate(
        {
            _id: req.body.id,
            placeId: req.body.placeId
        },
        {placeId: ""}
    )
    .then(() => res.send("Trainer removed from the place"))
    .catch((err) => res.send(err))
}