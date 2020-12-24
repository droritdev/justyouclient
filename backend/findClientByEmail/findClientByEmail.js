//Import The client model
const clientProfileModel = require('../models/clientModels');

//Find clients by category
exports.getClientByEmail = (req, res) => {
    
    clientProfileModel.find( 
        { email: req.params.email },
    )
    //res.send(doc))
    .then((doc) => res.send(doc))
    .catch((err) => res.send(err.data));
}

