
const NameReducer = (state, action) => {
    switch(action.type) {
        case 'SET_FIRST_NAME':
            return action.firstName;

        case 'SET_LAST_NAME':
            return action.lastName;
            
        default:
            return state;
    }
}

export default NameReducer;