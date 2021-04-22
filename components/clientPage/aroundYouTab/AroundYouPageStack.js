import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import AroundYouPage from '../aroundYouTab/AroundYouPage';

const Stack = createStackNavigator();

//The trainer's stack navigator to handle screen navigations in the around you section
const AroundYouPageStack = ({navigation}) => {
    return(
        <Stack.Navigator
            screenOptions={{headerShown: false}}
        >
            <Stack.Screen name='AroundYouPage' component={AroundYouPage}/>

        </Stack.Navigator>
    )
}

export default AroundYouPageStack;
