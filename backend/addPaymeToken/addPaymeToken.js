//Import the payme model
const paymeModel = require('../models/paymeModel');

//Create new payme and add it to the dataBase
exports.addPaymeToken = (req, res) => {
    
    //Create a new payme
    const payme = new paymeModel(
        {
            clientEmail: req.body.buyer_email, 
            paymeToken: req.body.buyer_key
        }
    );    

    payme
    .save()
    .then(() => {
        console.log('add payme token success ', res.json(payme))
        res.json(payme)
    })
    .catch(err => {
        console.log('add payme token failed ', err)
        res.status(400).json("Error in add payme: " + err)
    });
}

