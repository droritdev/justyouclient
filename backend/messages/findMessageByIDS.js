//Import The chat model
const messageModel = require('../models/messageModel');

//Find chat by clientID and trainerID
exports.getMesssageByIDS = (req, res) => {
    var idsString = req.params.ids;
    var idsArray = idsString.split('@');
    messageModel.find(
        { 
            sender: idsArray[0].trim(),
            receiver: idsArray[1].trim()
        }
    )
    .then((doc) => res.send(doc))
    .catch((err) => res.send(err.data));
}