//Import The trainer model
const trainerProfileModel = require('../models/trainerModels');

//Write new comment on a trainer's page
exports.writeComment = (req, res) => {
    console.log(req.body.userID)
    console.log(req.body.stars)
    console.log(req.body.reviewContent)
    trainerProfileModel.findByIdAndUpdate(
        req.body._id,
        {
            $push: {

                reviews: 
                    
                        {
                            
                                userID: req.body.userID,
                                stars: req.body.stars,
                                reviewContent: req.body.reviewContent
                            
                        }
                    
              ,
            }
        }

        


    )
    .then((doc) => res.send(doc))
    .catch((err) => console.log(err));
}