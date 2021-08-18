
const PaymeTokenReducer = (state, action) => {
    switch(action.type) {
        case 'SET_PAYMETOKEN':
            return action.paymeToken;
        
        default:
            return state;
    }
}

export default PaymeTokenReducer;