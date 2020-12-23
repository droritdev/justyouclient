//Import the trainer model
const trainerProfileModel = require('../models/trainerModels');

//Show all trainer's comments
exports.showComments = (req, res) => {
    trainerProfileModel.findById(
        {_id: req.body.trainerId}
    )
    .then((doc) => res.send(doc.commentReviews))
    .catch((err) => res.send(err));
}