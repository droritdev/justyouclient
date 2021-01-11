const OrderReducer = (state, action) => {
    switch(action.type) {

        case 'SET_ORDER_OBJECT':
            return action.orderObject
        
        case 'SET_ORDER_TRAINING_SITE_ADDRESS':
            return action.orderTrainingSiteAddress

        case 'SET_ORDER_TRAINING_CATEGORY':
            return action.orderTrainingCategory

        case 'SET_ORDER_START_TIME':
            return action.orderStartTime

        case 'SET_ORDER_END_TIME':
            return action.orderEndTime  

        case 'SET_ORDER_DATE':
            return action.orderDate        



        default:
            return state;
    }
}

export default OrderReducer;