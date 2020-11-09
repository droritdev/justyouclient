import React, {useReducer} from 'react';

import MediaReducer from '../reducers/MediaReducer';

export const MediaContext = React.createContext();

const MediaContextProvider = ({children}) => {
    const [media, dispatch] = useReducer(MediaReducer, []);

    return(
        <MediaContext.Provider value={{media, dispatch}}>
            {children}
        </MediaContext.Provider>
    );
}

export default MediaContextProvider;