//Import The client model
const clientProfileModel = require('../models/clientModels');

//Update the client's credit (after share&earn operation)
exports.updateClientCredit = (req, res) => {
    const id = req.body.id;
    const creditToUpdate = req.body.creditToUpdate;

    clientProfileModel.findByIdAndUpdate(
        {_id: id},
        {credit: creditToUpdate}
    )
    .then(() => res.send("Credit updated"))
    .catch(err => res.status(400).json("Error: " + err));
}