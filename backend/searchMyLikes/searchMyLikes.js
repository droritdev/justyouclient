//Import the client Model
const clientProfileModel = require('../models/clientModels');

//Client search for his likes list
exports.searchMyLikes = (req, res) => {
    clientProfileModel.findById(
        {_id: req.body.clientId}
    )
    .then((doc) => res.send(doc.likes))
    .catch((err) =>res.send(err));
}