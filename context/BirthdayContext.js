import React, {useReducer} from 'react';

import BirthdayReducer from '../reducers/BirthdayReducer';

export const BirthdayContext = React.createContext();

const BirthdayContextProvider = ({children}) => {
    const [birthday, dispatchBirthday] = useReducer(BirthdayReducer, "");

    return(
        <BirthdayContext.Provider value={{birthday, dispatchBirthday}}>
            {children}
        </BirthdayContext.Provider>
    );
}

export default BirthdayContextProvider;