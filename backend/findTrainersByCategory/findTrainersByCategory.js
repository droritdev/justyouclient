//Import The trainer model
const trainerProfileModel = require('../models/trainerModels');

//Find trainers by category
exports.getTrainersByCategory = (req, res) => {
    trainerProfileModel.find(
        {
            categories: {$in: [req.body.category]},
            visibility: true,
        },
    )
    .then((doc) => res.send(doc))
    .catch((err) => res.send(err));
}