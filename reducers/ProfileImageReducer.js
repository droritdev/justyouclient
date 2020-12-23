
const ProfileImageReducer = (state, action) => {
    switch(action.type) {
        case 'SET_PROFILE_IMAGE':
            return action.profileImage;
        
        default:
            return state;
    }
}

export default ProfileImageReducer;