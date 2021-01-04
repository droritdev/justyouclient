//Import The trainer model
const trainerProfileModel = require('../models/trainerModels');

//Find trainer by category
exports.getTrainerByEmail = (req, res) => {
    
    trainerProfileModel.find( 
        { email: req.params.email },
    )
    //res.send(doc))
    .then((doc) => res.send(doc))
    .catch((err) => res.send(err.data));
}

