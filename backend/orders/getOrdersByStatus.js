//Impot the order model
const orderModel = require('../models/orderModel');

//Get trainer oreders by a specific status (approoved/pending/accomplished)
exports.getOrdersByStatus = (req, res) => {
    orderModel.find(
        {
            trainerId: req.body.trainerId, 
            status: req.body.status
        }, 
        (err, doc) => {
            if(err){
                res.send(err);
            }
            else{
                res.send(doc);
            }
        }
    );
}

            //**Client function**//
//Get client oreders by a specific status (approoved/pending/accomplished)

// exports.getOrdersByStatus = (req, res) => {
//     orderModel.find(
//         {
//             clientId: req.body.clientId, 
//             status: req.body.status
//         }, 
//         (err, doc) => {
//             if(err){
//                 res.send(err);
//             }
//             else{
//                 res.send(doc);
//             }
//         }
//     );
// }

            //**Place function**//
//Get place oreders by a specific status (approoved/pending/accomplished)

// exports.getOrdersByStatus = (req, res) => {
//     orderModel.find(
//         {
//             placeId: req.body.placeId, 
//             status: req.body.status
//         }, 
//         (err, doc) => {
//             if(err){
//                 res.send(err);
//             }
//             else{
//                 res.send(doc);
//             }
//         }
//     );
// }