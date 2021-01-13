//Impot the order model
const orderModel = require('../models/orderModel');

//{client.firstName:"Lotem", "status":"pending"}
//Get all orders with param client ID
exports.getOrdersByClientID = (req, res) => {
    orderModel.find(
        {
            "client.id" : req.params.id,
        }
    )
    .then((doc) => res.send(doc))
    .catch((err) => res.send(err.data));
}