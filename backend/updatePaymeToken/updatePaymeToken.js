//Import payme model
const paymeModel = require('../models/paymeModel');

//Update payme token
exports.updatePaymeToken = (req, res) => {
    paymeModel.findOneAndUpdate(
        {clientEmail: req.body.buyer_email.toLowerCase()},
        {paymeToken: req.body.buyer_key},
        {new:true}
    )
    .then((doc) => console.log('Payme token update succeeded ', doc))
    .catch(err => console.log(err));
}
