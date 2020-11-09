//Import the place model
const placeModel = require('../models/placeModel');

//Update a place's profile fields
exports.editProfile = (req, res) => {
    placeModel.findByIdAndUpdate(
        {_id: req.body.id},
        {
            name: req.body.name,
            number: req.body.number,
            address: req.body.address,
            categories: req.body.categories,
            about: req.body.about,
            //images
            prices: {
                single: req.body.prices.single,
                couple: req.body.prices.couple
            }
        }
    )
    .then(() => res.send("Place updated"))
    .catch((err) => res.send(err))
}