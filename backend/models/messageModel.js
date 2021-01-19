//Mongoose library to create new schemas
const mongoose = require("mongoose");

//Create new mongoose schema variable
const Schema = mongoose.Schema;

//Create new chat schema
const messageSchema = new Schema(
    {
        receiver: {
            type: String,
            required: true,
            trim: true
        },
        sender: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: Object,
            required: true,
        },     
    },
    {
        timestamps: true,
    }
);

//Create new chat model who will contain object tyoe of "chatSchema" 
const messageModel = mongoose.model("messages", messageSchema);

module.exports = messageModel;