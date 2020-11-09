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
            first_name: {
                type: String,
                required: true,
                trim: true
            },
            last_name: {
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
            first_name: {
                type: String,
                required: true,
                trim: true
            },
            last_name: {
                type: String,
                required: true,
                trim: true
            } 
        },
        placeId: {
            type: String,
            trim: true,
            default: ""
        },
        site: {
            type: String,
            trim: true
        },
        address: {
            type: String,
            trim: true
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
            type: String,
            required: true,
            trim: true
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
        responseUser: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true,
    }
);

//Create new order model who will contain object tyoe of "orderSchema" 
const orderModel = mongoose.model("Orders", orderSchema);

module.exports = orderModel;