//Mongoose library to create new schema
const mongoose = require("mongoose");

//Create new mongoose schema variable
const Schema = mongoose.Schema;

//Create new payme schema
const paymeSchema = new Schema(
    {
        clientEmail: {
            type: String,
            required: true,
            trim: true
        },
        paymeToken: {
            type: String,
            required: true,
            trim: true
        }
    }
);

//Create new payme model that will contain object type of "paymeSchema" 
const paymeModel = mongoose.model("paymeTokens", paymeSchema);

module.exports = paymeModel;

