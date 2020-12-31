
const ClientReducer = (state, action) => {
    switch(action.type) {
        case 'SET_CLIENT_OBJECT':
            return action.clientObject;
        
        default:
            return state;
    }
}

export default ClientReducer;