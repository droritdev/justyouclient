
const MediaReducer = (state, action) => {
    switch(action.type) {
        case 'ADD_IMAGE': 
            return {
                ...state,
                media: [...state, action.imageSource]
            }

        case 'ADD_VIDEO':
            return action.lastName;
            
        default:
            return state;
    }
}

export default MediaReducer;