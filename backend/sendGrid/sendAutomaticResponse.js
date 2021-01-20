//Access to /.env variables
require('dotenv').config();

//SendGrid library
const sgMail = require('@sendgrid/mail')

//Connect to SendGrid account
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//Send email by: to --> destination address, from --> sender address, subject --> message subject, text --> message content
exports.sendAutomaticResponse = (req, res) => {
    const msg = {
        to: req.body.to,
        from: req.body.from,
        templateId: 'd-4d6995388d78433a95efa20a6de6b0b7',
        dynamicTemplateData: {
            name: req.body.name,
          },
    }

    sgMail
    .send(msg)
    .then(() => {
      res.send({status: 'success'});
    })
    .catch((error) => {
      console.log(error);
    });
}
