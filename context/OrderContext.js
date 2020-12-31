import React, {useReducer} from 'react';

import OrderReducer from '../reducers/TrainerReducer';

export const OrderContext = React.createContext();

const OrderContextProvider = ({children}) => {
    const [orderObject, dispatchOrderObject] = useReducer(OrderReducer, []);
    
    return(
        <TrainerContext.Provider value={{
            orderObject, dispatchOrderObject,
        }}>
            {children}
        </TrainerContext.Provider>
    );
}

export default OrderContextProvider;