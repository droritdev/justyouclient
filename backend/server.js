
//for get server run 
//node server.js   

//**External imports**//
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

        //**Trainer imports**//
const trainerRegister = require('./register/trainerRegister');
const changeVisibility = require('./changeVisibility/changeVisibility');
const trainerEditProfile = require('./trainerEditProfile/trainerEditProfile');

        //**Client imports**//
const clientRegister = require('./register/clientRegister');
const findTrainerByCategory = require('./findTrainersByCategory/findTrainersByCategory');
const makeOrder = require('./orders/makeOrder');
const updateClientCredit = require('./clientCredit/updateClientCredit');
const clientFindPlaces = require('./clientFindPlaces/clientFindPlaces');
const clientEditProfile = require('./clientEditProfile/clientEditProfile');
const markAsLike = require('./markAsLike/markAsLike');
const removeFromLikes = require('./removeFromLikes/removeFromLikes');
const searchMyLikes = require('./searchMyLikes/searchMyLikes');
const writeComment = require('./commentReviews/writeComment');
const showComments = require('./showComments/showComments');
const deleteComment = require('./commentReviews/deleteComment');
const markStarReview = require('./markStarReview/markStarReview');
const findAroundMe = require('./findAroundMe/findAroundMe');
const uploadimage = require('./uploadimage/uploadimage');
const findClientByEmail = require('./findClientByEmail/findClientByEmail');
const findClientByPhone = require('./findClientByPhone/findClientByPhone');

        //**Place imports**//
const placeRegister = require('./register/placeRegister');
const findTrainersOfPlace = require('./findTrainersOfPlace/findTrainers');
const addTrainerToPlace = require('./addTrainerToPlace/addTrainerToPlace');
const removeTrainerFromPlace = require('./removeTrainerFromPlace/removeTrainerFromPlace');
//const changeVisibility = require('./changeVisibility/changeVisibility');
const placeEditProfile = require('./placeEditProfile/placeEditProfile');

        //**Common imports**//
const sendEmail = require('./sendGrid/sendEmail');
const verificationSms = require('./twilio/verificationSms');
const updatePaymentMethods = require('./updatePaynemtMethods/updatePaymentMethods');
const updateEmailAddress = require('./updateEmailAddress/updateEmailAddress');
const updatePhoneNumber = require('./updatePhoneNumber/updatePhoneNumber');
const updateOrderStatus = require('./orders/updateOrderStatus');
const getOrdersByStatus = require('./orders/getOrdersByStatus');
const logIn = require('./logIn/logIn');
const signOut = require('./signOut/signOut');

        //**In-app variables**//
const port = 3000;
const app = express();

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//Connect to the data base
//Connect the server to the port
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})
    .then(result => {
        app.listen(port, () => {
            console.log(`App running on port ${port}`);  
        });
    })
    .catch(err => console.log(err));


            ////**Client & trainer & place end points**////

//db.records.find( { a: { $exists: true } } )

//End point for sending emails
app.post('/send-email', sendEmail.sendEmail);

//End point for sending verification code
app.post('/send-verification-code', verificationSms.sendVerificationCode);

//End point for verifying the verification code
app.post('/verify-code', verificationSms.verifyCode);

//End point for updating the payment methods
app.put('/settings/update-payment-methods', updatePaymentMethods.updatePaymentMethods);

//End point for updating the email address
app.put('/settings/update-email-address', updateEmailAddress.updateEmailAddress);

//End point for updating the phone number
app.put('/settings/update-phone-number', updatePhoneNumber.updatePhoneNumber);

//End point for updating an order status
app.put('/orders/update-status', updateOrderStatus.updateOrderStatus);

//End point for searching order by status (declined/pending/approved/acomplished)
app.get('/orders/search', getOrdersByStatus.getOrdersByStatus);

//End point for log in existing accounts
app.put('/log-in', logIn.logIn);

//End point for sign out existing accounts
app.put('/sign-out', signOut.signOut);


            ////**Both trainer & places end points**////
//End point for chainging visibility
app.put('/settings/visibility', changeVisibility.changeVisibility);


            ////**Trainer end points**////
//End point for confirming the registration and add a new trainer to the dataBase
app.post('/trainers/register', trainerRegister.register);

//End point for editing the trainer profile
app.put('/trainers/settings/edit-profile', trainerEditProfile.editProfile);


            ////**Client end points**////
//End point for confirming the registration and add a new trainer to the dataBase         
app.post('/clients/register', clientRegister.register);

//End point for searching trainers by category
app.get('/clients/trainers/category', findTrainerByCategory.getTrainersByCategory);

//End point for booking an order
app.post('/clients/orders/book-order', makeOrder.makeOrder);

//End point for updating the client's credit
app.put('/clients/update-credit', updateClientCredit.updateClientCredit);

//End point for searching places by the client
app.get('/clients/places', clientFindPlaces.clientFindPlaces);

//End point for editing the client profile
app.put('/clients/settings/edit-profile/:email', clientEditProfile.editProfile);

//End point for mark a trainer as like
app.put('/clients/likes/add', markAsLike.markAsLike);

//End point for remove a trainer from likes
app.put('/clients/likes/remove', removeFromLikes.removeFromLikes);

//End point for getting my likes list
app.get('/clients/likes', searchMyLikes.searchMyLikes);

//End point for writing a comment on trainers page
app.put('/clients/comments/add', writeComment.writeComment);

//End point for showing all trainer's comments
app.get('/clients/trainers/comments', showComments.showComments);

//End point for removing client's comment from trainer's page
app.put('/clients/comments/remove', deleteComment.deleteComment);

//End point for mark a star review on a trainer page
app.put('/clients/trainers/stars', markStarReview.markStarReview);

//End point for finding trainers around me by distance
app.get('/clients/aroundme/trainers', findAroundMe.findTrainers);

//End point for finding places around me by distance
app.get('/clients/aroundme/places', findAroundMe.findPlaces);

app.post('/clients/upload-image', uploadimage.uploadImage);

app.get('/clients/:email', findClientByEmail.getClientByEmail);

//for phone validation
app.get('/clients/phone/:phone', findClientByPhone.getClientByPhone);

            ////**Place end points**////
//End point for confirming the registration and add a new place to the dataBase 
app.post('/places/register', placeRegister.register);

//End point for finding trainers of place
app.get('/places/our-trainers', findTrainersOfPlace.getTrainersOfPlace);

//End point for adding a trainer to placeRegister
app.put('/places/trainers/add', addTrainerToPlace.addTrainerToPlace);

//End point for remove trainer from place list
app.put('/places/trainers/remove', removeTrainerFromPlace.removeTrainerFromPlace);

//End point for editing the place profile
app.put('/places/settings/edit-profile', placeEditProfile.editProfile);