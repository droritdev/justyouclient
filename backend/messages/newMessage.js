//Import the message model
const messageModel = require('../models/messageModel');

//Create new message and add him to the dataBase
exports.createMessage = (req, res) => { 
    //Creating a new chat
    const newMessage = new messageModel(
        {
            receiver: req.body.receiver, 
            sender: req.body.sender, 
            message: req.body.message
        }
    );

    //Add the new chat to the data base
    newMessage
        .save()
        .then(() => res.json({status: "success"}))
        .catch(err => console.log(err.data));
}