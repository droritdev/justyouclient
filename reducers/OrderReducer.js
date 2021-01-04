const OrderReducer = (state, action) => {
    switch(action.type) {

        case 'SET_ORDER_OBJECT':
            return action.orderObject
        
        case 'SET_ORDER_TRAINING_SITE_ADDRESS':
            return action.orderTrainingSiteAddress

        case 'SET_ORDER_TRAINING_CATEGORY':
            return action.orderTrainingCategory

         



        default:
            return state;
    }
}

export default OrderReducer;