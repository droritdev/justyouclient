//Import The trainer model
const trainerProfileModel = require('../models/trainerModels');

//Find trainers by category
exports.getMultipleTrainers = (req, res) => {
    var stringOfIDS = req.params.idArray;
    var idArray = stringOfIDS.split(',');

    trainerProfileModel.find(
        {
            '_id':
            {
                $in: idArray
            }
        }
    )
    .then((doc) => res.send(doc))
    .catch((err) => res.send(err.data));
}