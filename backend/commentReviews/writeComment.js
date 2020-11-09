//Import The trainer model
const trainerProfileModel = require('../models/trainerModels');

//Write new comment on a trainer's page
exports.writeComment = (req, res) => {
    trainerProfileModel.findByIdAndUpdate(
        {_id: req.body.trainerId},
        {
            $push: {
                commentReviews: {
                    clientId: req.body.clientId,
                    trainerId: req.body.trainerId,
                    clientComment: req.body.comment
                }
            }
        }
    )
    .then((doc) => res.send(doc))
    .catch((err) => res.send(err));
}