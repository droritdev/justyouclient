//Import the place model
const placeModel = require('../models/placeModel');

//Register new place and add him to the dataBase
exports.register = (req, res) => {
    let about;
    if(req.body.about === ""){
        about = "Come training with us!";
    }
    else{
        about = req.body.about;
    }

    //Creating a new place
    const place = new placeModel(
        {
            name: req.body.name, 
            number: req.body.number, 
            email: req.body.email, 
            password: req.body.password, 
            country: req.body.country, 
            permissions: {
                location: req.body.permissions.locationPermission, 
                push: req.body.permissions.pushPermission
            }, 
            address: req.body.address, 
            categories: req.body.categories, 
            about: about, 
            prices: {
                single: req.body.prices.single, 
                couple: req.body.prices.couple
            },
            creditCard: {
                number: req.body.creditCard.number, 
                cvv: req.body.creditCard.cvv, 
                expire: {
                    month: req.body.creditCard.expire.month, 
                    year: req.body.creditCard.expire.year
                }
            }, 
            phone: {
                areaCode: req.body.phone.areaCode, 
                phoneNumber: req.body.phone.phoneNumber
            }
        }
    );    

    place
    .save()
    .then(() => res.json(place))
    .catch(err => res.status(400).json("Error: " + err));
}