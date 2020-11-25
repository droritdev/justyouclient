import React from 'react';
import { Button, Text, View } from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import StarPage from '../starTab/StarPage';

const Stack = createStackNavigator();

//The trainer's stack navigator to handle screen navigations in the profile section
const TrainerProfilePageStack = ({navigation}) => {
    return(
        <Stack.Navigator
            screenOptions={{headerShown: false}}
        >
            <Stack.Screen name='StarPage' component={StarPage}/>

        </Stack.Navigator>
    )
}

export default TrainerProfilePageStack;