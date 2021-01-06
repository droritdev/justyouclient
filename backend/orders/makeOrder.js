//Impot the order model
const orderModel = require('../models/orderModel');

//Book new order
exports.makeOrder = (req, res) => {
    

    //Create new order in the data base
    console.log(req.body);
    const order = new orderModel(
        {
            client: {
                id: req.body.client.id, 
                firstName: req.body.client.firstName, 
                lastName: req.body.client.lastName,
                profilePic: req.body.client.profilePic

            },
            trainer: {
                id: req.body.trainer.id, 
                firstName: req.body.trainer.firstName, 
                lastName: req.body.trainer.lastName,
                profilePic: req.body.trainer.profilePic

            },
            type: req.body.type, 
            category: req.body.category, 
            trainingDate: {
                startTime: req.body.trainingDate.startTime,
                endTime: req.body.trainingDate.endTime
            },
            cost: req.body.cost,
            status: req.body.status,
            location: {
                address: req.body.location.address,
                latitude:req.body.location.latitude,
                longitude:req.body.location.longitude
            },
             
        }
    );

    //save the order to the data base
    order
        .save()
        .then(() => res.json(order))
        .catch(err => res.status(400).json("Error: " + err));
}