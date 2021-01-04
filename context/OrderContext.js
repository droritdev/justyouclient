import React, {useReducer} from 'react';

import OrderReducer from '../reducers/OrderReducer';

export const OrderContext = React.createContext();

const OrderContextProvider = ({children}) => {
    const [orderObject, dispatchOrderObject] = useReducer(OrderReducer, []);
    const [orderTrainingSiteAddress, dispatchOrderTrainingSiteAddress] = useReducer(OrderReducer, "");
    const [orderTrainingCategory, dispatchOrderTrainingCategory] = useReducer(OrderReducer, "");
    
    return(
        <OrderContext.Provider value={{
            orderObject, dispatchOrderObject,
            orderTrainingSiteAddress, dispatchOrderTrainingSiteAddress,
            orderTrainingCategory, dispatchOrderTrainingCategory
        }}>
            {children}
        </OrderContext.Provider>
    );
}

export default OrderContextProvider;