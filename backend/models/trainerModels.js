//Mongoose library to create new schemas
const mongoose = require("mongoose");
//Create new mongoose schema variable
const Schema = mongoose.Schema;

//Create new "trainer profile" schema
const trainerProfileSchema = new Schema(
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
       reviews: {
            type:
            [
                {
                    review : {
                        userID: {
                            type: String,
                            trim: true
                        },
                        userImage: {
                            type: String,
                            trim: true
                        },
                        userFirstName: {
                            type: String,
                            trim: true
                        },
                        userLastName: {
                            type: String,
                            trim: true
                        },
                        stars: {
                            type: Number
                        },
                        reviewContent: {
                            type: String,
                            trim: true
                        }
                    }
                }
            ]
       },
       calendar: {
            type: 
            [
                {
                    usersInvolved :{
                            trainerID: {
                                type: String,
                                trim: true
                            },
                            clinetID: {
                                type: String,
                                trim: true
                            }
                        },
                    event:{
                        start: {
                            type: String,
                            trim: true
                        },
                        end:{
                            type: String,
                            trim: true
                        },
                        title:{
                            type: String,
                            trim: true
                        },
                        summary:{
                            type: String,
                            trim: true
                        },
                        color:{
                            type: String,
                            trim: true
                        }
                    }
                }
            ]
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
       categories: {
           type: Object,
           required: true
       },
       about_me: {
           type: String,
           trim: true,
           default: "Personal trainer"
       },
       certifications: {
           type: String,
           trim: true,
           default: "Personal trainer"
       },
       media: {
            images: {
                type: [String]
            },
            videos: {
                type: [String]
            }
       },
       maximumDistance: {
           type: Number,
           required: true
       },
       prices: {
           single: {
               singleAtTrainer: {
                   type: String
               },
               singleOutdoor: {
                   type: String
               }
           },
           couple: {
               coupleAtTrainer: {
                   type: String
               },
               coupleOutdoor: {
                   type: String
               }
           }
       },
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
       location: {
            trainingSite1: {
                address: {
                    type: String
                },
                coordinates: {
                    type: [Number]
                }
            },
            trainingSite2: {
                address: {
                    type: String
                },
                coordinates: {
                    type: [Number]
                }
            }
        },
    }, 
    {
        timestamps: true,
    }
);

//Create new "trainers profile" model who will contain object tyoe of "trainerProfileSchema" 
const trainerProfileModel = mongoose.model("trainers Profile", trainerProfileSchema);

module.exports = trainerProfileModel;