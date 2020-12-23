import React, {useReducer} from 'react';

import PasswordReducer from '../reducers/PasswordReducer';

export const PasswordContext = React.createContext();

const PasswordContextProvider = ({children}) => {
    const [password, dispatchPassword] = useReducer(PasswordReducer, "");

    return(
        <PasswordContext.Provider value={{password, dispatchPassword}}>
            {children}
        </PasswordContext.Provider>
    );
}

export default PasswordContextProvider;