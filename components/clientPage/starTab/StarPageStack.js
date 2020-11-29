import React from 'react';
import { Button, Text, View } from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import StarPage from './StarPage';
import WhyUs from './WhyUs';
import QuestionsAndAnswers from './QuestionsAndAnswers';
import ComingSoon from './ComingSoon';
import CustomerService from './CustomerService';

const Stack = createStackNavigator();

//The trainer's stack navigator to handle screen navigations in the profile section
const TrainerProfilePageStack = ({navigation}) => {
    return(
        <Stack.Navigator
            screenOptions={{headerShown: false}}
        >
            <Stack.Screen name='StarPage' component={StarPage}/>
            <Stack.Screen name='WhyUs' component={WhyUs}/>
            <Stack.Screen name='QuestionsAndAnswers' component={QuestionsAndAnswers}/>

            <Stack.Screen name='ComingSoon' component={ComingSoon}/>
            <Stack.Screen name='CustomerService' component={CustomerService}/>

        </Stack.Navigator>
    )
}

export default TrainerProfilePageStack;