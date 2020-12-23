import React, {useReducer} from 'react';

import PhoneReducer from '../reducers/PhoneReducer';

export const PhoneContext = React.createContext();

const PhoneContextProvider = ({children}) => {
    const [areaCode, dispatchArea] = useReducer(PhoneReducer, "");
    const [phoneNumber, dispatchNumber] = useReducer(PhoneReducer, "");

    return(
        <PhoneContext.Provider value={{areaCode, phoneNumber, dispatchArea, dispatchNumber}}>
            {children}
        </PhoneContext.Provider>
    );
}

export default PhoneContextProvider;