import React, {useReducer} from 'react';

import ClientReducer from '../reducers/ClientReducer';

export const ClientContext = React.createContext();

const ClientContextProvider = ({children}) => {
    const [clientObject, dispatchClientObject] = useReducer(ClientReducer, []);
    const [clientId, dispatchClientId] = useReducer(ClientReducer, "");
    const [clientEmail, dispatchClientEmail] = useReducer(ClientReducer, "");
    const [clientFirstName, dispatchFirstName] = useReducer(ClientReducer, "");
    const [clientLastName, dispatchLastName] = useReducer(ClientReducer, "");
    const [clientBirthday, dispatchBirthday] = useReducer(ClientReducer, "");

    return(
    <ClientContext.Provider value={{
        clientObject, dispatchClientObject,
        clientId, dispatchClientId,
        clientEmail, dispatchClientEmail,
        clientFirstName, dispatchFirstName,
        clientLastName, dispatchLastName,
        clientBirthday, dispatchBirthday

    }}>
        {children}
    </ClientContext.Provider>
);
}

export default ClientContextProvider;
