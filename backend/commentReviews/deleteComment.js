//Import The trainer model
const trainerProfileModel = require('../models/trainerModels');

//Delelte an existing comment
exports.deleteComment = (req, res) => {
    trainerProfileModel.findByIdAndUpdate(
        {_id: req.body.trainerId},
        {
            $pull: {
                commentReviews: {
                    _id: req.body.commentId
                }
            }
        }
    )
    .then((doc) => res.send(doc))
    .catch((err) => res.send(err));
}