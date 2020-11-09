import React, {useReducer} from 'react';

import CountryReducer from '../reducers/CountryReducer';

export const CountryContext = React.createContext();

const CountryContextProvider = ({children}) => {
    const [country, dispatch] = useReducer(CountryReducer, "");

    return(
        <CountryContext.Provider value={{country, dispatch}}>
            {children}
        </CountryContext.Provider>
    );
}

export default CountryContextProvider;