//Import the trainer model
const trainerProfileModel = require('../models/trainerModels');

//Show all trainer's comments
exports.allTrainers = (req, res) => {
    trainerProfileModel.find({
        // country: req.param.country
    }
        // { starCounter: {
        //     numberOfStars: req.params.stars,
        //     numberOfStarsComments: req.params.stars
        // } },
            )
    .then((doc) => console.log(doc));
    // .catch((err) => res.send(err));
}