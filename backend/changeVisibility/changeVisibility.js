//Import The trainer and place models
const trainerProfileModel = require('../models/trainerModels');
const placeModel = require('../models/placeModel');

//Change trainer's visibility
exports.changeVisibility = (req, res) => {
    trainerProfileModel.findByIdAndUpdate(
        {_id: req.body.id},
        {visibility: req.body.visibility}
    )
    .then(() => res.send("Okay"))
    .catch((err) => res.send(err))
}


//Change place's visibility

// exports.changeVisibility = (req, res) => {
//     placeModel.findByIdAndUpdate(
//         {_id: req.body.id},
//         {visibility: req.body.visibility}
//     )
//     .then(() => res.send("Okay"))
//     .catch((err) => res.send(err))
// }