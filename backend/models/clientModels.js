//Mongoose library to create new schemas
const mongoose = require("mongoose");

//Create new mongoose schema variable
const Schema = mongoose.Schema;

//Create new "costumer profile" schema
const clientProfileSchema = new Schema(
    {
       name: {
           first: {
               type: String,
               required: true,
               trim: true
           },
           last: {
               type: String,
               required: true,
               trim: true
           }
       },
       birthday: {
           type: String,
           required: true,
           trim: true
       },
       email: {
           type: String,
           required: true,
           unique: true,
           trim: true
       },
       password: {
           type: String,
           required: true,
           trim: true
       },
       country: {
           type: String,
           required: true,
           trim: true
       },
    //    image: {
    //        type: String
    //    },
       phone: {
           areaCode: {
               type: String,
               required: true,
               trim: true
           },
           phoneNumber: {
               type: String,
               required: true,
               trim: true
           }
       },
       credit: {
           type: Number,
           default: 0
       },
       likes: {
           type: [Object]
       },
       location: {
           type: {
               type: String,
               enum: ['Point']    
           },
           coordinates: {
               type: [Number],
               index: "2dsphere"
           }
       }
    }, 
    {
        timestamps: true,
    }
);

//Create new "client profile" model who will contain object tyoe of "clientProfileSchema" 
const clientProfileModel = mongoose.model("Clients Profile", clientProfileSchema);

module.exports = clientProfileModel;