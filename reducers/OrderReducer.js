const TrainerReducer = (state, action) => {
    switch(action.type) {

        case 'SET_ORDER_OBJECT':
            return action.orderObejct

    

         



        default:
            return state;
    }
}

export default TrainerReducer;