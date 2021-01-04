//Mongoose library to create new schemas
const mongoose = require("mongoose");

//Create new mongoose schema variable
const Schema = mongoose.Schema;

//Create new order schema
const orderSchema = new Schema(
    {
        client: {
                id: {
                    type: String,
                    required: true,
                    trim: true
                },
                firstName: {
                    type: String,
                    required: true,
                    trim: true
                },
                lastName: {
                    type: String,
                    required: true,
                    trim: true
                },
                profilePic: {
                    type: String,
                    required: true,
                    trim: true
                }
                 
        },
        trainer: {
                id: {
                    type: String,
                    required: true,
                    trim: true
                },
                firstName: {
                    type: String,
                    required: true,
                    trim: true
                },
                lastName: {
                    type: String,
                    required: true,
                    trim: true
                },
                profilePic: {
                    type: String,
                    required: true,
                    trim: true
                } 
        },
        type: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        trainingDate: {
            startTime: {
                type: String,
                required: true,
                trim: true
            },
            endTime: {
                type: String,
                required: true,
                trim: true
            },
        },
        cost: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            trim: true,
            default: "Pending"
        },  
        // responseUser: {
        //     type: String,
        //     trim: true,
        //     default: ""
        // },
        location: {
            address: {
                type: String,
                trim: true
            },
            latitude: {
                type: Number,
                required: true,
            },
            longitude: {
                type: Number,
                required: true,
            } 
        }
    },
    {
        timestamps: true,
    }
);

//Create new order model who will contain object tyoe of "orderSchema" 
const orderModel = mongoose.model("Orders", orderSchema);

module.exports = orderModel;