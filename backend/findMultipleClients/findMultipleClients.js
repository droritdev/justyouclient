//Import The trainer model
const clientProfileModel = require('../models/clientModels');

//Find trainers by category
exports.getMultipleClients = (req, res) => {
  let stringOfIDS = req.params.idArray;
  let idArray = stringOfIDS.split(',');

  clientProfileModel.find(
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
