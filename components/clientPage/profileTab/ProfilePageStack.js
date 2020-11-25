import React from 'react';
import { Button, Text, View } from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import ProfilePage from '../profileTab/ProfilePage';

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