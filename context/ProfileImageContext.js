import React, {useReducer} from 'react';

import ProfileImageReducer from '../reducers/ProfileImageReducer';

export const ProfileImageContext = React.createContext();

const ProfileImageContextProvider = ({children}) => {
    const [imageSource, dispatch] = useReducer(ProfileImageReducer, "");

    return(
        <ProfileImageContext.Provider value={{imageSource, dispatch}}>
            {children}
        </ProfileImageContext.Provider>
    );
}

export default ProfileImageContextProvider;