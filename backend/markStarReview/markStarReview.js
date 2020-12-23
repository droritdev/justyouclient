//Import The trainer model
const trainerProfileModel = require('../models/trainerModels');

//Mark a trainer with star
exports.markStarReview = (req, res) => {
    trainerProfileModel.findByIdAndUpdate(
        {_id: req.body.trainerId},
        {
            $push: {
                starReviews: {
                    clientId: req.body.clientId,
                    clientStarReview: req.body.stars
                }
            },
            $inc: { 
                "starCounter.numberOfStars": req.body.stars, 
                "starCounter.numberOfStarComments": 1
            }
        }
    )
    .then((doc) => res.send(doc.starCounter))
    .catch((err) => res.send(err));
}