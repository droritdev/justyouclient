
const CountryReducer = (state, action) => {
    switch(action.type) {
        case 'SET_COUNTRY':
            return action.country;
        
        default:
            return state;
    }
}

export default CountryReducer;