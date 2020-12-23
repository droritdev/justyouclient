//Import The trainer model
const clientProfileModel = require('../models/clientModels');

//Find trainers by category
exports.getClientByEmail = (req, res) => {
    
    clientProfileModel.find( 
        { email: req.params.email },
    )
    //res.send(doc))
    .then((doc) => res.send(doc))
    .catch((err) => res.send(err.data));
}

