
const PhoneReducer = (state, action) => {
    switch(action.type) {
        case 'SET_AREA_CODE':
            return action.areaCode;

        case 'SET_PHONE_NUMBER':
            return action.phoneNumber;
            
        default:
            return state;
    }
}

export default PhoneReducer;