//Impot the order model
const orderModel = require('../models/orderModel');

//Update a specific order status
exports.updateOrderStatus = (req, res) => {
    orderModel.findByIdAndUpdate(
        {_id: req.body.orderId},
        {
            status: req.body.status,
            responseUser: req.body.responseUserID
        }
    )
    .then(() => res.send("okay"))
    .catch(err => res.status(400).json("Error: " + err));
}