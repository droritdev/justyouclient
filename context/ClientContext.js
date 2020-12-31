import React, {useReducer} from 'react';

import ClientReducer from '../reducers/ClientReducer';

export const ClientContext = React.createContext();

const ClientContextProvider = ({children}) => {
    const [clientObject, dispatchClientObject] = useReducer(ClientReducer, []);

    return(
    <ClientContext.Provider value={{
        clientObject, dispatchClientObject
    }}>
        {children}
    </ClientContext.Provider>
);
}

export default ClientContextProvider;
