const trainerProfileModel = require('../models/trainerModels');

exports.editProfile = (req,res) => {
    trainerProfileModel.findByIdAndUpdate(
        {_id: req.body.id},
        {
            name: {
                first: req.body.name.first,
                last: req.body.name.last
            },
            birthday: req.body.birthday,
            categories: req.body.categories,
            maximumDistance: req.body.maximumDistance,
            trainingSites: req.body.trainingSites,
            about_me: req.body.about,
            certifications: req.body.certifications,
            //images
            prices: {
                single: {
                    singleAtTrainer: req.body.prices.single.singleAtTrainer,
                    singleAtClient: req.body.prices.single.singleAtClient
                },
                couple: {
                    coupleAtTrainer: req.body.prices.couple.coupleAtTrainer,
                    coupleAtClient: req.body.prices.couple.coupleAtClient
                }
            }
        }
    )
    .then(() => res.send("Trainer updated"))
    .catch((err) => res.send(err))
}