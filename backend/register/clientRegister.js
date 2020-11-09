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
            permissions: {
                location: req.body.permissions.locationPermission, 
                push: req.body.permissions.pushPermission
            }, 
            //image: image,
            creditCard: {
                number: req.body.creditCard.creditNumber, 
                cvv: req.body.creditCard.creditCvv, 
                expire: {
                    month: req.body.creditCard.expire.creditExpireMonth, 
                    year: req.body.creditCard.expire.creditExpireYear
                }
            }, 
            phone: {
                areaCode: req.body.phone.phoneAreaCode, 
                phoneNumber: req.body.phone.phoneNumber
            },
            location: {
                type: req.body.location.type,
                coordinates: req.body.location.coordinates
            }
        }
    );
    //Add the new trainer to the data base
    clientProfile
        .save()
        .then(() => res.json(clientProfile))
        .catch(err => res.status(400).json("Error: " + err));
}