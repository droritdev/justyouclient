//Import the server
const server = require('../server');

//Get the messages collection ref from mongodb
const messagesCollection = server.mongoose.connection.collection('messages');

//Check if a new message was sent to the receiver and return the message
exports.watchForUpdates = (req, res) => {
    //ID of the receiver of the message
    var receiver = req.params.receiver;

    let watch = messagesCollection.watch();
    watch.on('change', function(change) { 
        if(change.operationType === 'insert') {
            if (change.fullDocument.receiver === receiver) {
                watch.close();
                res.send(change.fullDocument.message);
            }
        }
     });
}