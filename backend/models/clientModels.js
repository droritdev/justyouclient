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
       permissions: {
           location: {
               type: Boolean,
               required: true,
           },
           push: {
               type: Boolean,
               required: true
           }
       },
       image: {
           type: String
       },
       creditCard: {
           number: {
               type: Number,
               required: true,
               trim: true
           },
           cvv: {
               type: Number,
               required: true,
               trim: true
           },
           expire: {
               month: {
                   type: Number,
                   required: true
               },
               year: {
                   type: Number,
                   required: true
               }
           }
       },
       phone: {
           areaCode: {
               type: Number,
               required: true,
               trim: true
           },
           phoneNumber: {
               type: Number,
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
       connected: {
           type: Boolean,
           default: true
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