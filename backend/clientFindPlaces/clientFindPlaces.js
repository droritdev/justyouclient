//Import The place model
const placeModel = require('../models/placeModel');

//Places found in the search operation by the client
exports.clientFindPlaces = (req, res) => {
    placeModel.find(
        {visibility: true}
    )
    .then((doc) => res.send(doc))
    .catch((err) => res.send(err))
}