//Import trainer/client profile model
const trainerProfileModel = require('../models/trainerModels');
const clientProfileModel = require('../models/clientModels');
const placeModel = require('../models/placeModel');

//Finding a trainer/client and update his email address
exports.updateEmailAddress = (req, res) => {
    trainerProfileModel.findByIdAndUpdate(
        {_id: req.body.id},
        {email: req.body.email}
    )
    .then(() => res.json("okay"))
    .catch(err => res.status(400).json("Error: " + err));

        //**Client version**//
    // clientProfileModel.findByIdAndUpdate(
    //     {_id: req.body.id},
    //     {email: req.body.email}
    // )
    // .then(() => res.json("okay"))
    // .catch(err => res.status(400).json("Error: " + err));

        //**Place version**//
    // placeModel.findByIdAndUpdate(
    //     {_id: req.body.id},
    //     {email: req.body.email}
    // )
    // .then(() => res.json("okay"))
    // .catch(err => res.status(400).json("Error: " + err));
}