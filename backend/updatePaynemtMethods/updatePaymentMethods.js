//Import trainer/client profile model
const trainerProfileModel = require('../models/trainerModels');
const clientProfileModel = require('../models/clientModels');
const placeModel = require('../models/placeModel');

//Finding a trainer/client and update his payment methods
exports.updatePaymentMethods = (req, res) => {
    trainerProfileModel.findByIdAndUpdate(
        {_id: req.body.id},
        {
            creditCard: 
            {
                number: req.body.creditCard.creditNumber, 
                cvv: req.body.creditCard.creditCvv, 
                expire: 
                {
                    month: req.body.creditCard.expire.creditExpireMonth, 
                    year: req.body.creditCard.expire.creditExpireYear
                }
            }
        }
    )
    .then(() => res.json("okay"))
    .catch(err => res.status(400).json("Error: " + err));


            //**Client version**//
    // clientProfileModel.findByIdAndUpdate(
    //     {_id: id},
    //     {
    //         creditCard: 
    //         {
    //             number: req.body.creditCard.creditNumber, 
    //             cvv: req.body.creditCard.creditCvv, 
    //             expire: 
    //             {
    //                 month: req.body.creditCard.expire.creditExpireMonth, 
    //                 year: req.body.creditCard.expire.creditExpireYear
    //             }
    //         }
    //     }
    // )
    // .then(() => res.json("okay"))
    // .catch(err => res.status(400).json("Error: " + err));


                //**Place version**//
    // placeModel.findByIdAndUpdate(
    //     {_id: id},
    //     {
    //         creditCard: 
    //         {
    //             number: req.body.creditCard.creditNumber, 
    //             cvv: req.body.creditCard.creditCvv, 
    //             expire: 
    //             {
    //                 month: req.body.creditCard.expire.creditExpireMonth, 
    //                 year: req.body.creditCard.expire.creditExpireYear
    //             }
    //         }
    //     }
    // )
    // .then(() => res.json("okay"))
    // .catch(err => res.status(400).json("Error: " + err));
}