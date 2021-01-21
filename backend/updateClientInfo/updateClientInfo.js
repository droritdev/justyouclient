//Import trainer/client profile model
const clientProfileModel = require('../models/clientModels');

//Update trainer info
exports.updateClientInfo = (req, res) => {
    clientProfileModel.findByIdAndUpdate(
        req.body._id,
        {$set:req.body},{new:true}
    )
    .then(() => res.json({type: "success"}))
    .catch(err => console.log(err.data));
}
