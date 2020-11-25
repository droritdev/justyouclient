import React from 'react';
import { Button, Text, View } from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import SearchPage from '../searchTab/SearchPage';

const Stack = createStackNavigator();

//The trainer's stack navigator to handle screen navigations in the search section
const SearchPageStack = ({navigation}) => {
    return(
        <Stack.Navigator
            screenOptions={{headerShown: false}}
        >
            <Stack.Screen name='SearchPage' component={SearchPage}/>

        </Stack.Navigator>
    )
}

export default SearchPageStack;