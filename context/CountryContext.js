import React, {useReducer} from 'react';

import CountryReducer from '../reducers/CountryReducer';

export const CountryContext = React.createContext();

const CountryContextProvider = ({children}) => {
    const [country, dispatchCountry] = useReducer(CountryReducer, "");

    return(
        <CountryContext.Provider value={{country, dispatchCountry}}>
            {children}
        </CountryContext.Provider>
    );
}

export default CountryContextProvider;