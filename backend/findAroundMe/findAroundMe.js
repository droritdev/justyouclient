//Import The trainer and place models
const trainerProfileModel = require('../models/trainerModels');
const placeModel = require('../models/placeModel');

//Find trainers around me by distance and category
exports.findTrainers = (req, res) => {
    trainerProfileModel.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point", 
                    coordinates: [req.body.location.coordinates[0], req.body.location.coordinates[1]]
                },
                distanceField: "dist.calculated",
                maxDistance: req.body.maxDistance,
                query: {
                    categories: {$in: [req.body.category]}
                }
            },
        },
    ])
    .then((doc) => res.send(doc))
    .catch((err) => res.send(err));
}

//Find places around me by distance and category
exports.findPlaces = (req, res) => {
    placeModel.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point", 
                    coordinates: [req.body.location.coordinates[0], req.body.location.coordinates[1]]
                },
                distanceField: "dist.calculated",
                maxDistance: req.body.maxDistance,
                query: {
                    visibility: true,
                }
            },
        },
    ])
    .then((doc) => res.send(doc))
    .catch((err) => res.send(err));
}