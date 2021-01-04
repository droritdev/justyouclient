
const ClientReducer = (state, action) => {
    switch(action.type) {
        case 'SET_CLIENT_OBJECT':
            return action.clientObject;

        case 'SET_CLIENT_ID':
            return action.clientId; 
            
        case 'SET_CLIENT_EMAIL':
            return action.clientEmail; 
                
        case 'SET_CLIENT_FIRST_NAME':
            return action.clientFirstName; 
                    
        
        case 'SET_CLIENT_LAST_NAME)':
            return action.clientLastName; 
        
        default:
            return state;
    }
}

export default ClientReducer;