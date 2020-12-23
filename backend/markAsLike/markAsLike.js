//Import The client model
const clientProfileModel = require('../models/clientModels');

//Mark a trainer with like
exports.markAsLike = (req, res) => {
    clientProfileModel.findByIdAndUpdate(
        {_id: req.body.clientId},
        {$push: {likes: req.body.trainerId}}
    )
    .then((doc) => res.send(doc))
    .catch((err) =>res.send(err));
}