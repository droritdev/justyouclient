//Import trainer/client profile model
const trainerProfileModel = require('../models/trainerModels');
const clientProfileModel = require('../models/clientModels');
const placeModel = require('../models/placeModel');

//Finding a trainer/costumer by unique id and update his phone number
exports.updatePhoneNumber = (req, res) => {
    trainerProfileModel.findByIdAndUpdate(
        {_id: req.body.id},
        {
            phone: 
            {
                areaCode: req.body.phone.areaCode, 
                phoneNumber: req.body.phone.phoneNumber
            }
        }
    )
    .then(() => res.json("okay"))
    .catch(err => res.status(400).json("Error: " + err));


            //**Client version**//
    // clientProfileModel.findByIdAndUpdate(
    //     {_id: id},
    //     {
    //         phone: 
    //         {
    //             areaCode: req.body.phone.areaCode, 
    //             phoneNumber: req.body.phone.phoneNumber
    //         }
    //     }
    // )
    // .then(() => res.json("okay"))
    // .catch(err => res.status(400).json("Error: " + err));


            //**Place version**//
    // placeModel.findByIdAndUpdate(
    //     {_id: id},
    //     {
    //         phone: 
    //         {
    //             areaCode: req.body.phone.areaCode, 
    //             phoneNumber: req.body.phone.phoneNumber
    //         }
    //     }
    // )
    // .then(() => res.json("okay"))
    // .catch(err => res.status(400).json("Error: " + err));
}