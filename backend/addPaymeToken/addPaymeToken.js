//Import the payme model
const paymeModel = require('../models/paymeModel');

//Create new payme and add it to the dataBase
exports.addPaymeToken = (req, res) => {
    console.log('in addPaymeToken')
    console.log('reqbody ', req.body)
    //Create a new payme
    const payme = new paymeModel(
        {
            clientEmail: req.body.buyer_email.toLowerCase(), 
            paymeToken: req.body.buyer_key
        }
    );    

    payme
    .save()
    .then(() => {
        console.log('add payme token success')
        return res.json(payme)
    })
    .catch(err => {
        console.log('add payme token failed ', err)
        return res.status(400).json("Error in add payme: " + err)
    });
}

