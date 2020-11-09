//Import the trainer model
const clientProfileModel = require('../models/clientModels');

//Client removes a like mark from his likes list
exports.removeFromLikes = (req, res) => {
    clientProfileModel.findByIdAndUpdate(
        {_id: req.body.clientId},
        {$pull: {likes: req.body.trainerId}}
    )
    .then((doc) => res.send(doc))
    .catch((err) =>res.send(err));
}