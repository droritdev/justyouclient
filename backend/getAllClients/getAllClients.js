//Import the clients model
const clientProfileModel = require('../models/clientModels');

//Show all trainer's comments
exports.allClients = (req, res) => {
    clientProfileModel.find({})
    .then((doc) => res.send(doc))
    .catch((err) => res.send(err))
}