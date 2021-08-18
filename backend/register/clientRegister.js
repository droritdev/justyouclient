//Import the client model
const clientProfileModel = require('../models/clientModels');
const uploadImage = require('../uploadImage/uploadImage');

//Register new client and add him to the dataBase
exports.register = (req, res) => {

    //Creating a new trainer
    const clientProfile = new clientProfileModel(
        {
            name: {
                first: req.body.name.first, 
                last: req.body.name.last
            }, 
            birthday: req.body.birthday, 
            email: req.body.email, 
            password: req.body.password, 
            country: req.body.country, 
            image: req.body.image,
            phone: {
                areaCode: req.body.phone.areaCode, 
                phoneNumber: req.body.phone.phoneNumber
            },
            location: {
                type: req.body.location.type,
                coordinates: req.body.location.coordinates
            },
            paymeToken: req.body.paymeToken
        }
    );
    //Add the new trainer to the data base
    clientProfile
        .save()
        .then(() => res.json(clientProfile))
        .catch(err => res.status(400).json("Error: " + err));
}