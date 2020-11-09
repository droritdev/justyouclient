//Mongoose library to create new schemas
const mongoose = require("mongoose");

//Create new mongoose schema variable
const Schema = mongoose.Schema;

// const geoSchema = new schema(
//     {
//         type: {
//             type: String,
//             default: "Point"
//         },
//         coordinates: {
//             type: [Number]
//         }
//     }
// )
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
       categories: {
           type: [String],
           required: true
       },
       about_me: {
           type: String,
           trim: true,
           default: "Personal trainer"
       },
       certifications: {
           type: String,
           default: "Personal trainer"
       },
    //    images: {
    //        type: [images]
    //    },
       maximumDistance: {
           type: Number,
           required: true
       },
       trainingSites: {
           type: [String],
           default: "Outdoor"
       },
       placeId: {
           type: String,
           default: ""
       },
       prices: {
           single: {
               singleAtTrainer: {
                   type: Number
               },
               singleAtClient: {
                   type: Number
               }
           },
           couple: {
               coupleAtTrainer: {
                   type: Number
               },
               coupleAtClient: {
                   type: Number
               }
           }
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
       commentReviews: {
           type: 
           [
               {
                   clientId: {
                       type: String,
                       trim: true
                   },
                   trainerId: {
                       type: String,
                       trim: true
                   },
                   clientComment: {
                       type: String,
                       trim: true
                   }
               }
            ]
       },
       starReviews: {
           type:
           [
               {
                    clientId: {
                       type: String,
                       trim: true
                    },
                    clientStarReview: {
                        type: Number,
                        trim: true
                    }
                }
            ]           
       },
       starCounter: {
           numberOfStars: {
               type: Number,
               default: 0
           },
           numberOfStarComments: {
               type: Number,
               default: 0
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
       profileViews: {
           type: Number,
           default: 0
       },
       connected: {
           type: Boolean,
           default: true
       },
       visibility: {
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
               index: '2dsphere'
           }
       }
    }, 
    {
        timestamps: true,
    }
);

//Create new "trainers profile" model who will contain object tyoe of "trainerProfileSchema" 
const trainerProfileModel = mongoose.model("trainers Profile", trainerProfileSchema);

module.exports = trainerProfileModel;