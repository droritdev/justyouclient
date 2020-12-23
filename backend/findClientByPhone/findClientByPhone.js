//Import The client model
const clientProfileModel = require('../models/clientModels');

//Find clients by category
exports.getClientByPhone = (req, res) => {
    
    clientProfileModel.find( 
        { phone: {
            areaCode: req.params.phone.slice(0, 3),
            phoneNumber: req.params.phone.slice(3)
        } },
    )
    
    .then((doc) => res.send(doc))
    .catch((err) => res.send(err.data));
}

