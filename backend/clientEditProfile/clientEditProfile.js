//Import The client model
const clientProfileModel = require('../models/clientModels');

//Edit fields in the client's profile
exports.editProfile = (req, res) => {
    clientProfileModel.findByIdAndUpdate(
        {_id: req.body.id},
        {
            country: req.body.country,
            name: {
                first: req.body.name.first,
                last: req.body.name.last
            },
            birthday: req.body.birthday,
            permissions: {
                location: req.body.permissions.locationPermission,
                push: req.body.permissions.pushPermission
            }  
        }
    )
    .then(() => res.send("Client updated"))
    .catch((err) => res.send(err))
}