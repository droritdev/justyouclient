import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import ProfilePage from './ProfilePage';
import ComingSoon from './ComingSoon';
import ReceiptsHistory from './ReceiptsHistory';
import ConfirmedOrders from './ConfirmedOrders';
import PendingOrders from './PendingOrders';
import History from './History';
import EditProfile from './EditProfile';
import CustomerService from './CustomerService';

const Stack = createStackNavigator();

//The trainer's stack navigator to handle screen navigations in the profile section
const TrainerProfilePageStack = ({navigation}) => {
    return(
        <Stack.Navigator
            screenOptions={{headerShown: false}}
        >
            <Stack.Screen name='ProfilePage' component={ProfilePage}/>
            <Stack.Screen name='ConfirmedOrders' component={ConfirmedOrders}/>
            <Stack.Screen name='PendingOrders' component={PendingOrders}/>
            <Stack.Screen name='ComingSoon' component={ComingSoon}/>
            <Stack.Screen name='ReceiptsHistory' component={ReceiptsHistory}/>
            <Stack.Screen name='History' component={History}/>
            <Stack.Screen name='EditProfile' component={EditProfile}/>
            <Stack.Screen name='CustomerService' component={CustomerService}/>
        </Stack.Navigator>
    )
}

export default TrainerProfilePageStack;