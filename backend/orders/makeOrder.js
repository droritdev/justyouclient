//Impot the order model
const orderModel = require('../models/orderModel');

//Book new order
exports.makeOrder = (req, res) => {
    let placeId;
    if(req.body.placeId){
        placeId = req.body.placeId;
    }

    //Create new order in the data base
    const order = new orderModel(
        {
            client: {
                id: req.body.client.id, 
                first_name: req.body.client.firstName, 
                last_name: req.body.client.lastName
            }, 
            trainer: {
                id: req.body.trainer.id, 
                first_name: req.body.trainer.firstName, 
                last_name: req.body.trainer.lastName
            }, 
            placeId: placeId, 
            site: req.body.site, 
            address: req.body.address, 
            type: req.body.type, 
            category: req.body.category, 
            trainingDate: req.body.trainingDate, 
            cost: req.body.cost
        }
    );

    //save the order to the data base
    order
        .save()
        .then(() => res.json(order))
        .catch(err => res.status(400).json("Error: " + err));
}