//Access to /.env variables
require('dotenv').config();

//Twilio library + Connect to Twilio account
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

//Sending the verification code to the user by: to --> phone number/email address, channel --> sms/email
exports.sendVerificationCode = (req, res) => {
    console.log("omer");
    client
        .verify
        .services(process.env.TWILIO_SERVICE_SID)
        .verifications
        .create({
            to: req.body.to,
            channel: req.body.channel
        })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((error) => {
            console.log(error);
        })
}

//Cheking the verification code by: to --> phone number/email address, channel --> sms/email 
exports.verifyCode = (req, res) => {
    client
        .verify
        .services(process.env.TWILIO_SERVICE_SID)
        .verificationChecks
        .create({
            to: req.body.to,
            code: req.body.code
        })
        .then((data) => {
            res.status(200).send(data);
        });
}