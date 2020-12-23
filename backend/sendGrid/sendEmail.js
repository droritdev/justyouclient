//Access to /.env variables
require('dotenv').config();

//SendGrid library
const sgMail = require('@sendgrid/mail')

//Connect to SendGrid account
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//Send email by: to --> destination address, from --> sender address, subject --> message subject, text --> message content
exports.sendEmail = (req, res) => {
    const msg = {
        to: req.body.to,
        from: req.body.from,
        subject: req.body.subject,
        text: req.body.text
    }
    sgMail
    .send(msg)
    .then(() => {
      res.send('Email sent');
    })
    .catch((error) => {
      res.send(error);
    });
}