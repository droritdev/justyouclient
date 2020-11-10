
const BirthdayReducer = (state, action) => {
    switch(action.type) {
        case 'SET_BIRTHDAY':
            return action.birthday;
        
        default:
            return state;
    }
}

export default BirthdayReducer;