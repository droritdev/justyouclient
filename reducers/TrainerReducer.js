const TrainerReducer = (state, action) => {
    switch(action.type) {

        case 'SET_TRAINER_OBJECT':
            return action.trainerObject

        case 'SET_MEDIA_PICTURES':
            return action.trainerMediaPictures;
    
        case 'SET_MEDIA_VIDEOS':
            return action.trainerMediaVideos;

        case 'SET_PRICES':
            return action.prices;    
            
        case 'SET_SINGLE_AT_TRAINER':
            return action.singleAtTrainer;
    
        case 'SET_SINGLE_OUTDOOR':
            return action.singleOutdoor;
    
        case 'SET_COUPLE_AT_TRAINER':
            return action.coupleAtTrainer;
    
        case 'SET_COUPLE_OUTDOOR':
            return action.coupleOutdoor; 

        case 'SET_NUMBER_OF_STARS':
            return action.trainerNumberOfStars;

        case 'SET_NUMBER_OF_STARS_COMMENTS':
            return action.trainerNumberOfStarComments;

        case 'SET_TRAINING_SITE_1':
            return action.trainerTrainingSite1;

        case 'SET_TRAINING_SITE_2':
            return action.trainerTrainingSite2;

        case 'SET_COORDINATES_1':
            return action.trainerCoordinates1;

        case 'SET_COORDINATES_2':
            return action.trainerCoordinates2; 

        case 'SET_ABOUT_ME':
            return action.trainerAboutMe;  

        case 'SET_CERTIFICATIONS':
            return action.trainerCertifications;

        case 'SET_FIRST_NAME':
            return action.trainerFirstName;

        case 'SET_LAST_NAME':
            return action.trainerlastName;

        case 'SET_BIRTHDAY':
            return action.trainerBirthday; 

        case 'SET_EMAIL_ADDRESS':
            return action.trainerEmailAddress;   

        case 'SET_COUNTRY':
            return action.trainerCountry;   
            
        case 'SET_CATEGORIES':
            return action.trainerCategories;    
        
        case 'SET_MAXIMUM_DISTANCE':
            return action.trainerMaximumDistnace;
        
        case 'SET_AREA_CODE':
            return action.trainerAreaCode;
    
        case 'SET_PHONE_NUMBER':
            return action.trainerPhoneNumber;    



        default:
            return state;
    }
}

export default TrainerReducer;