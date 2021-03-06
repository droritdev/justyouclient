import React, {useReducer} from 'react';

import ProfileImageReducer from '../reducers/ProfileImageReducer';

export const ProfileImageContext = React.createContext();

const ProfileImageContextProvider = ({children}) => {
    const [profileImage, dispatchProfileImage] = useReducer(ProfileImageReducer, require('../images/profileImage.png'));

    return(
        <ProfileImageContext.Provider value={{profileImage, dispatchProfileImage}}>
            {children}
        </ProfileImageContext.Provider>
    );
}

export default ProfileImageContextProvider;