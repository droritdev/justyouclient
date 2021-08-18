import React, {useReducer} from 'react';

import PaymeTokenReducer from '../reducers/PaymeTokenReducer';

export const PaymeTokenContext = React.createContext();

const PaymeTokenContextProvider = ({children}) => {
    const [paymeToken, dispatchPaymeToken] = useReducer(PaymeTokenReducer, "");

    return(
        <PaymeTokenContext.Provider value={{paymeToken, dispatchPaymeToken}}>
            {children}
        </PaymeTokenContext.Provider>
    );
}

export default PaymeTokenContextProvider;