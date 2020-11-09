import React, {useReducer} from 'react';

import EmailReducer from '../reducers/EmailReducer';

export const EmailContext = React.createContext();

const EmailContextProvider = ({children}) => {
    const [emailAddress, dispatchEmail] = useReducer(EmailReducer, "");

    return(
        <EmailContext.Provider value={{emailAddress, dispatchEmail}}>
            {children}
        </EmailContext.Provider>
    );
}

export default EmailContextProvider;