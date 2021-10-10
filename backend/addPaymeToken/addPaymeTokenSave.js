//Import the payme model
const paymeModel = require('../models/paymeModel');

//Create new payme and add it to the dataBase
exports.addPaymeToken = (req, res) => {
    console.log(req.body)

    let buyer_email = ''
    let buyer_key = ''
    let saleStatusMessage = ''

    let keyValuePairs = req.body.split('&')
    for (var i=0; i<keyValuePairs.length; i++) {
        let eachPair = keyValuePairs[i].split('=')
        if (eachPair[0] === buyer_email) {
            buyer_email === eachPair[1]
        }
        if (eachPair[0] === buyer_key) {
            buyer_key === eachPair[1]
        }
        if (eachPair[0] === 'sale_status' && eachPair[1] === 'completed') {
            saleStatusMessage = 'Payment details processed successfully'
        } else if (eachPair[0] === 'sale_status' && eachPair[1] !== 'completed') {
            saleStatusMessage = 'Payment details process failed'
        }
    }
    
    //Create a new payme
    const payme = new paymeModel(
        {
            clientEmail: buyer_email, 
            paymeToken: buyer_key
        }
    );    

    payme
    .save()
    .then(() => {
        //  res.json(payme)
        console.log('add payme token success ', res.json(payme))
        return saleStatusMessage
    })
    .catch(err => {
        //  res.status(400).json("Error in add payme: " + err)
        console.log('add payme token failed ', err)
        return saleStatusMessage
    });
}

