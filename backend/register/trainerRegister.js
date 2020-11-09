//Import the trainer model
const trainerProfileModel = require('../models/trainerModels');

//Register new trainer and add him to the dataBase
exports.register = (req, res) => {
    let about = "about"; 
    if(req.body.about === ""){
        about = "Personal trainer";
    }
    else{
        about = req.body.about;
    }
    
    let certifications = "cert";
    if(req.body.certifications === ""){
        certifications = "Personal trainer";
    }
    else{
        certifications = req.body.certifications;
    }
    
    //Creating a new trainer
    const trainerProfile = new trainerProfileModel(
        {
            name: {
                first: req.body.name.first, 
                last: req.body.name.last
            }, 
            birthday: req.body.birthday, 
            email:req.body.email, 
            password:req.body.password, 
            country:req.body.country, 
            permissions: {
                location: req.body.permissions.locationPermission, 
                push: req.body.permissions.pushPermission
            }, 
            categories: req.body.categories, 
            about_me: about, 
            certifications: certifications, 
            maximumDistance: req.body.maximumDistance, 
            trainingSites: req.body.trainingSites, 
            prices: { 
                single: {
                    singleAtTrainer: req.body.prices.single.singleAtTrainer, 
                    singleAtClient: req.body.prices.single.singleAtClient
                }, 
                couple: {
                    coupleAtTrainer: req.body.prices.couple.coupleAtTrainer, 
                    coupleAtClient: req.body.prices.couple.coupleAtClient
                } 
            }, 
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
    trainerProfile
        .save()
        .then(() => res.json(trainerProfile))
        .catch(err => res.status(400).json("Error: " + err));
}