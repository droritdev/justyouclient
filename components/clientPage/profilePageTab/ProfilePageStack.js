import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import ProfilePage from './ProfilePage'

const Stack = createStackNavigator();

//The trainer's stack navigator to handle screen navigations in the profile section
const TrainerProfilePageStack = ({navigation}) => {
    return(
        <Stack.Navigator
            screenOptions={{headerShown: false}}
        >
            <Stack.Screen name='ProfilePage' component={ProfilePage}/>

        </Stack.Navigator>
    )
}

export default TrainerProfilePageStack;