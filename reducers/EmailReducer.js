
const EmailReducer = (state, action) => {
    switch(action.type) {
        case 'SET_EMAIL_ADDRESS':
            return action.emailAddress;
        
        default:
            return state;
    }
}

export default EmailReducer;