//Import trainer' place and client models
const trainerProfileModel = require('../models/trainerModels');
const placeModel = require('../models/placeModel');
const clientProfileModel = require('../models/clientModels');

//Sign out the user
exports.signOut = (req, res) => {
    trainerProfileModel.findByIdAndUpdate(
        {_id: req.body.id},
        {connected: req.body.connected}
    )
    .then(() => res.send("Okay"))
    .catch((err) => res.send(err))
}

// exports.signOut = (req, res) => {
//     clientProfileModel.findByIdAndUpdate(
//         {_id: req.body.id},
//         {connected: req.body.connected}
//     )
//     .then(() => res.send("Okay"))
//     .catch((err) => res.send(err))
// }

// exports.signOut = (req, res) => {
//     placeModel.findByIdAndUpdate(
//         {_id: req.body.id},
//         {connected: req.body.connected}
//     )
//     .then(() => res.send("Okay"))
//     .catch((err) => res.send(err))
// }