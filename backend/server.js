
//for get server run
//node server.js

//**External imports**//
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const nunjucks = require('nunjucks')
const Nexmo = require('nexmo')







module.exports.mongoose = mongoose;


//paypal payment

// const paypalPayment = require('./paypalPayment/paypalPayment');


//get users
const getAllTrainers = require('./getAllTrainers/getAllTrainers')
const getAllClients = require('./getAllClients/getAllClients')



// chat messages
const findMessageByIDS = require('./messages/findMessageByIDS');
const newMessage = require('./messages/newMessage');
const watchForUpdates = require('./messages/watchForUpdates');


        //**Trainer imports**//
const trainerRegister = require('./register/trainerRegister');
const changeVisibility = require('./changeVisibility/changeVisibility');
const trainerEditProfile = require('./trainerEditProfile/trainerEditProfile');
//const getAllTrainers = require('./getAllTrainers/getAllTrainers');
const findTrainerByPopularity = require('./findTrainerByPopularity/findTrainerByPopularity');
const findTrainerByEmail = require('./findTrainerByEmail/findTrainerByEmail');
const findTrainerByID = require('./findTrainerByID/findTrainerByID');
const findMultipleTrainers = require('./findMultipleTrainers/findMultipleTrainers');



        //**Client imports**//
const clientRegister = require('./register/clientRegister');
const findMultipleClients = require('./findMultipleClients/findMultipleClients');

const findTrainerByCategory = require('./findTrainersByCategory/findTrainersByCategory');
//**Orders
const makeOrder = require('./orders/makeOrder');
const getOrdersByClientID = require('./orders/getOrdersByClientID');

const updateClientInfo = require('./updateClientInfo/updateClientInfo');
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

const addPaymeToken = require('./addPaymeToken/addPaymeToken');
const findPaymeTokenByEmail = require('./findPaymeTokenByEmail/findPaymeTokenByEmail');

        //**Place imports**//
const placeRegister = require('./register/placeRegister');
const findTrainersOfPlace = require('./findTrainersOfPlace/findTrainers');
const addTrainerToPlace = require('./addTrainerToPlace/addTrainerToPlace');
const removeTrainerFromPlace = require('./removeTrainerFromPlace/removeTrainerFromPlace');
//const changeVisibility = require('./changeVisibility/changeVisibility');
const placeEditProfile = require('./placeEditProfile/placeEditProfile');

        //**Common imports**//
//const verificationSms = require('./twilio/verificationSms');
const updatePaymentMethods = require('./updatePaynemtMethods/updatePaymentMethods');
const updateEmailAddress = require('./updateEmailAddress/updateEmailAddress');
const updatePhoneNumber = require('./updatePhoneNumber/updatePhoneNumber');
const updateOrderStatus = require('./orders/updateOrderStatus');
const getOrdersByStatus = require('./orders/getOrdersByStatus');
const logIn = require('./logIn/logIn');
const signOut = require('./signOut/signOut');

        //for sendGrid email//
const sendEmail = require('./sendGrid/sendEmail');
const sendAutomaticResponse = require('./sendGrid/sendAutomaticResponse');

        //**In-app variables**//
const port = 8081;
const app = express();

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


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

app.get('/getAllTrainers', getAllTrainers.allTrainers)
app.get('/getAllClients', getAllClients.allClients)

//End point for sending email to support
app.post('/send-email', sendEmail.sendEmail);

//End point for sending automatic response
app.post('/send-automatic-response', sendAutomaticResponse.sendAutomaticResponse);

//End point for sending verification code
//app.post('/send-verification-code', verificationSms.sendVerificationCode);

//End point for verifying the verification code
//app.post('/verify-code', verificationSms.verifyCode);

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

//End point for adding payme token
app.post('/addPaymeToken', addPaymeToken.addPaymeToken);

app.get('/getPaymeToken/:email', findPaymeTokenByEmail.getPaymeTokenByEmail);


            ////**Both trainer & places end points**////
//End point for chainging visibility
app.put('/settings/visibility', changeVisibility.changeVisibility);



            ////**Trainer end points**////
//End point for confirming the registration and add a new trainer to the dataBase
app.post('/trainers/register', trainerRegister.register);

//End point for editing the trainer profile
app.put('/trainers/settings/edit-profile', trainerEditProfile.editProfile);

app.get('/trainers/getAllTrainers', getAllTrainers.allTrainers);
app.get('/trainers/email/:email', findTrainerByEmail.getTrainerByEmail);
app.get('/trainers/id/:id', findTrainerByID.findTrainerByID);
app.get('/trainers/findMultipleTrainers/:idArray', findMultipleTrainers.getMultipleTrainers);

// app.get('clients', getAllTrainers.allTrainers);


            ////**Client end points**////
//End point for confirming the registration and add a new trainer to the dataBase
app.post('/clients/register', clientRegister.register);

//End point for searching trainers by category
app.get('/clients/trainers/category', findTrainerByCategory.getTrainersByCategory);

//End point for booking an order
app.post('/clients/orders/book-order', makeOrder.makeOrder);

//End point for get orders by Client ID
app.get('/orders/by-client-id/:id', getOrdersByClientID.getOrdersByClientID);

//End point getting clients array by id
app.get('/clients/findMultipleClients/:idArray', findMultipleClients.getMultipleClients);




//End point to update client info
app.post('/clients/updateClientInfo', updateClientInfo.updateClientInfo);

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
app.get('/clients/likes/:clientId', searchMyLikes.searchMyLikes);

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


//chat messages
//End point to get chat message by clientID and trainerID (receiver and sender)
app.get('/messages/findMessageByIDS/:ids', findMessageByIDS.getMesssageByIDS);

//End point to create new chat message
app.post('/messages/newMessage', newMessage.createMessage);

app.get('/messages/watchForUpdates/:receiver', watchForUpdates.watchForUpdates);


const paypal = require('paypal-rest-sdk');
const engines = require("consolidate");
const { response } = require('express');

//for paypal views set:
app.engine("ejs", engines.ejs);
app.set("views", "./paypalViews");
app.set("view engine", "ejs");





/*
SAND BOX CONFIG
*/
paypal.configure({
    'mode': 'sandbox',
    'client_id': 'AWWnlKwlkexa-FcYLtU-lXbbG7TcjDnO1fZBvjMCahAOhUvmQ8pN8i3BPJpi3L1VRR8XRUM-4SdfYZJR',
    'client_secret': 'EDsuT2KTJE-WValxvJzw5-a9syJfofILTJ8UV_FrfS_UKY4aAni0H6vrhuBC0nF7xb1v8T-YMl5DQ_39'
});



/*
LIVE CONFIG
*/
// paypal.configure({
//         'mode': 'live',
//         'client_id': 'AQxRq2oM-GEJ9N9VANffTk70Jl5ceGNlUXjbqaKOB0atMdgKLCeQQgi0fDSv1OmfnLLa1c5FNS2tgnPF',
//         'client_secret': 'EOUgugmZl8_O6bYTrnUQpN1G_FQXgYRMUs3FJTp0C7ZvDg7NmV5D0KQmSrMlxYlTCvrdCiFFimXfOAMp'
//       });



let paymentAmount = [];

app.get('/paypal', (req, res) => {

    //Receive the choosen informatiom in the order page from the query
    let price = req.query.price;
    let category = req.query.category;
    let trainingType = req.query.trainingType;

    //Create payment json to pass to the paypal payment function
    let create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/paypal/paymentSuccess",
            "cancel_url": "http://localhost:3000/paypal/paymentCancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "JustYou - Personal Training",
                    "sku": "1",
                    "price": price,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": price
            },
            "payee":{
                    "email" : "sb-du47x34662085@business.example.com"
            },

            "description": trainingType + ' - ' + category
        }]
    };


    //Create a payment, and redirect user to the payment form of paypal
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            //Insert the payment amount into an array,
            //In the index of this specific transcation id
            paymentAmount[payment.id] = payment.transactions[0].amount.total;

            //Redirect to paypal login/payment
            res.redirect(payment.links[1].href);
        }
    });
});



//Order was created, and user has approved to pay
//Now we execute the payment
app.get('/paypal/paymentSuccess' ,(req, res) => {

    //Get the payerID from query
    let PayerID = req.query.PayerID;

    //Get the paymentID from query
    let paymentId = req.query.paymentId;

    //Create a json in order to pass it to paypal's execute payment function
    let execute_payment_json = {
            "payer_id": PayerID,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": paymentAmount[paymentId]
                }
            }]
        };

        //Execute the payment
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
            //logs for developer use
            //     console.log("Get Payment Response");
            //     console.log(JSON.stringify(payment));

            //Show 'succes' page from our paypalviews
            //The page currently has a button to redirect the client to the app
            //(TODO: design the page and pass information back)
                res.render('success');
            }
        });
})



//Oreder was cancelled
//Show 'cancel' page from our paypalviews
app.get('/paypal/paymentCancel' ,(req, res) =>{
    res.render('cancel')
    })




 // generate secrete key    
const nexmo = new Nexmo({ 
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET
  })

 
  app.post('/sendCode', (req, res) => {
    // A user registers with a mobile phone number
    let phoneNumber = req.body.number;
    console.log(phoneNumber);
    nexmo.verify.request({
        number: phoneNumber, //+ מספר טלפון עם קידומת המדינה בלי 
        brand: 'Just You',
        workflow_id: 6, // שולח (רק) הודעה עם קוד של 4 ספרות
        pin_expiry: 120, // תוקף הקוד בשניות
        next_event_wait: 120 // פרק זמן בין שליחת קוד לשליחת קוד חדש
    }, (err, result) => {
      if(err) {
        res.sendStatus(500);
      } 
      else 
      {
          //res.json(result)
          res.json(result.request_id)
          console.log("code sent successfuly"); // Success! Now, have your user enter the PIN
      } 
    });
  });


  app.post('/verifyCode', (req, res) => {
    let code = req.body.code;
    let request_id = req.body.request_id;
  
    nexmo.verify.check({request_id: request_id, code: code}, (err, result) => {
        if(result){
            res.send('authenticated')
           
         }
        else {
            // handle the error
            res.send('failed')

        } 
        
            // if(result && result.status == '0') { // Success!
            //   res.status(200)
            //   res.render({message: 'Account verified!'});
            //   console.log('account verified')
            // } else {
            //   // handle the error - e.g. wrong PIN
            //   console.log('wrong code')
            // }

    });
  });

