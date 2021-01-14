import React, {useReducer} from 'react';

import TrainerReducer from '../reducers/TrainerReducer';

export const TrainerContext = React.createContext();

const TrainerContextProvider = ({children}) => {
    const [trainerObject, dispatchTrainerObject] = useReducer(TrainerReducer, []);
    const [trainerMediaPictures, dispatchTrainerMediaPictures] = useReducer(TrainerReducer, []);
    const [trainerMediaVideos, dispatchTrianerMediaVideos] = useReducer(TrainerReducer, []);
    const [prices, dispatchPrices] = useReducer(TrainerReducer,[]);
    const [singlePrice, dispatchSingleAtTrainer] = useReducer(TrainerReducer, "");
    const [singlePriceOutdoor, dispatchSingleOutdoor] = useReducer(TrainerReducer, "");
    const [couplePriceAtTrainer, dispatchCoupleAtTrainer] = useReducer(TrainerReducer, "");
    const [couplePriceOutdoor, dispatchCoupleOutdoor] = useReducer(TrainerReducer, "");
    // const [trainerNumberOfStars, dispatchTrainerNumberOfStars] = useReducer(TrainerReducer, "");
    const [trainerNumberOfStarComments, dispatchTrainerNumberOfStarComments] = useReducer(TrainerReducer, "");
    const [trainerFinalStarRating, dispatchFinalStarRating,] = useReducer(TrainerReducer, "");
    const [trainerTrainingSite1, dispatchTrainerTrainingSite1] = useReducer(TrainerReducer, "");
    const [trainerTrainingSite2, dispatchTrainerTrainingSite2] = useReducer(TrainerReducer, "");
    const [trainerCoordinates1, dispatchTrainerCoordinates1] = useReducer(TrainerReducer, []);
    const [trainerCoordinates2, dispatchTrainerCoordinates2] = useReducer(TrainerReducer, []);
    const [trainerAboutMe, dispatchTrainerAboutMe] = useReducer(TrainerReducer, "");
    const [trainerCertifications, dispatchTrainerCertifications] = useReducer(TrainerReducer, "Write your certifications...");
    const [trainerFirstName, dispatchTrainerFirst] = useReducer(TrainerReducer, "");
    const [trainerlastName, dispatchTrainerLast] = useReducer(TrainerReducer, "");
    const [trainerBirthday, dispatchTrainerBirthday] = useReducer(TrainerReducer, "");
    const [trainerEmailAddress, dispatchTrainerEmail] = useReducer(TrainerReducer, "");
    const [trainerCountry, dispatchTrainerCountry] = useReducer(TrainerReducer, "");
    const [trainerCategories, dispatchTrainerCategories] = useReducer(TrainerReducer, []);
    const [trainerMaximumDistnace, dispatchTrainerMaximumDistance] = useReducer(TrainerReducer, 1);
    const [trainerAreaCode, dispatchTrainerArea] = useReducer(TrainerReducer, "");
    const [trainerPhoneNumber, dispatchTrainerNumber] = useReducer(TrainerReducer, "");


    return(
        <TrainerContext.Provider value={{
            trainerObject, dispatchTrainerObject,
            trainerMediaPictures, dispatchTrainerMediaPictures,            
            trainerMediaVideos, dispatchTrianerMediaVideos,
            prices, dispatchPrices,
            singlePrice, dispatchSingleAtTrainer,
            singlePriceOutdoor, dispatchSingleOutdoor,
            couplePriceAtTrainer, dispatchCoupleAtTrainer,
            couplePriceOutdoor, dispatchCoupleOutdoor,           
            // trainerNumberOfStars, dispatchTrainerNumberOfStars,           
            trainerNumberOfStarComments, dispatchTrainerNumberOfStarComments,            
            trainerFinalStarRating, dispatchFinalStarRating,            
            trainerTrainingSite1, dispatchTrainerTrainingSite1,         
            trainerTrainingSite2, dispatchTrainerTrainingSite2,
            trainerCoordinates1, dispatchTrainerCoordinates1,
            trainerCoordinates2, dispatchTrainerCoordinates2,
            trainerAboutMe, dispatchTrainerAboutMe,
            trainerCertifications, dispatchTrainerCertifications,
            trainerFirstName, dispatchTrainerFirst,
            trainerlastName, dispatchTrainerLast,
            trainerBirthday, dispatchTrainerBirthday,
            trainerEmailAddress, dispatchTrainerEmail,
            trainerCountry, dispatchTrainerCountry,
            trainerCategories, dispatchTrainerCategories,
            trainerMaximumDistnace, dispatchTrainerMaximumDistance,
            trainerAreaCode, dispatchTrainerArea,
            trainerPhoneNumber, dispatchTrainerNumber
        }}>
            {children}
        </TrainerContext.Provider>
    );
}

export default TrainerContextProvider;