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

//*****Ignore this section*****//

//const mailgun = require("mailgun-js");
//const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

// exports.sendEmail = (req, res) => {
//     const code = [];
//     var digit1 = Math.floor(Math.random() * Math.floor(10)).toString();
//     var digit2 = Math.floor(Math.random() * Math.floor(10)).toString();
//     var digit3 = Math.floor(Math.random() * Math.floor(10)).toString();
//     var digit4 = Math.floor(Math.random() * Math.floor(10)).toString();
//     code.push(digit1 + digit2 + digit3 + digit4);
//     code.join('');

//     const data = {
//         from: req.body.from,
//         to: req.body.to,
//         subject: req.body.subject,
//         text: req.body.text + `${code}`
//     };

//     mg.messages().send(data, function (err, body) {
//         res.send(code);
//     });
// }