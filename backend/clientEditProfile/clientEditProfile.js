//Import The client model
const clientProfileModel = require('../models/clientModels');

//Edit fields in the client's profile
exports.editProfile = (req, res) => {
    clientProfileModel.findOneAndUpdate(
        {email: req.params.email},
        {
            name: {
                first: req.body.name.first,
                last: req.body.name.last
            },
            birthday: req.body.birthday,
            image: req.body.image, 
        }
    )
    .then((doc) => res.send(doc))
    .catch((err) => res.send(err))
}