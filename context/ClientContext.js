import React, {useReducer} from 'react';

import ClientReducer from '../reducers/ClientReducer';

export const ClientContext = React.createContext();

const ClientContextProvider = ({children}) => {
    const [clientObject, dispatchClientObject] = useReducer(ClientReducer, []);
    const [clientId, dispatClientId] = useReducer(ClientReducer, "");
    const [clientEmail, dispatClientEmail] = useReducer(ClientReducer, "");
    const [clientFirstName, dispatFirstName] = useReducer(ClientReducer, "");
    const [clientLastName, dispatLastName] = useReducer(ClientReducer, "");

    return(
    <ClientContext.Provider value={{
        clientObject, dispatchClientObject,
        clientId, dispatClientId,
        clientEmail, dispatClientEmail,
        clientFirstName, dispatFirstName,
        clientLastName, dispatLastName

    }}>
        {children}
    </ClientContext.Provider>
);
}

export default ClientContextProvider;
