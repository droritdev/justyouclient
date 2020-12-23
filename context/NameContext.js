import React, {useReducer} from 'react';

import NameReducer from '../reducers/NameReducer';

export const NameContext = React.createContext();

const NameContextProvider = ({children}) => {
    const [firstName, dispatchFirst] = useReducer(NameReducer, "");
    const [lastName, dispatchLast] = useReducer(NameReducer, "");

    return(
        <NameContext.Provider value={{firstName, lastName, dispatchFirst, dispatchLast}}>
            {children}
        </NameContext.Provider>
    );
}

export default NameContextProvider;