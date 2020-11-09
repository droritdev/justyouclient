
const clientProfileModel = require('../models/clientModels');

exports.logIn = (req, res) => {
    // const password = bcrypt.hashSync(req.body.password, 14);
    // const password2 = bcrypt.hashSync(req.body.password, 14);
    // console.log(password);
    // console.log(password2);

    let client = clientProfileModel.findOne( {email: req.body.email} );

    // clientProfileModel.findOne(
    //     {email: req.body.email, password: password},
    //     (err, doc) => {
    //         if(err){
    //             res.send(err);
    //         }
    //         else{
    //             res.send(doc);
    //         }
    //     }
    // );
}