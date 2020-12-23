//Mongoose library to create new schemas
const mongoose = require("mongoose");

//Create new mongoose schema variable
const Schema = mongoose.Schema;

const placeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        number: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true
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
        address: {
            type: String,
            required: true,
            trim: true
        },
        categories: {
            type: [String]
        },
        about: {
            type: String,
            trim: true,
            default: "Come training with us!"
        },
        // images: {

        // },
        prices: {
            single: {
                type: Number
            },
            couple: {
                type: Number
            }
        },
        trainers: {
            type: 
            [
                {
                    trainerId: {
                        type: String
                    }
                }
            ]
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
        incomes: {
            type:
            [
                {
                     orderId: {
                         type: String 
                     }
                }
            ]
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

//Create new place model who will contain object tyoe of "trainerProfileSchema" 
const placeModel = mongoose.model("Places", placeSchema);

module.exports = placeModel;