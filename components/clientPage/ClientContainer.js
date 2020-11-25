import React from 'react';
import { Button, Text, View, Image, StyleSheet} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ProfilePageStack from './profileTab/ProfilePageStack';
import AroundYouPageStack from './aroundYouTab/AroundYouPageStack';
const Tab = createBottomTabNavigator();

//The tab navigation container to handle the navigation in the trainer's area
const ClientContainer = () => {
    return(
        <Tab.Navigator
            tabBarOptions={{
                style: {
                    height: 80,
                    borderTopWidth: 1.5
                },
                showLabel: false,
            }}
        >
            <Tab.Screen 
                name="ProfilePageStack" 
                component={ProfilePageStack}
                options={{
                    tabBarIcon: ({ focused,tintColor }) => (
                        !focused ? <Image
                            source={require('../../images/starIcon.png')}
                            style={[styles.startIcon, {tintColor: tintColor}]}
                          />
                          :
                          <Image
                            source={require('../../images/starIconFocused.jpg')}
                            style={[styles.startIconFocused, {tintColor: tintColor}]}
                          />
                    )
                }}
            />
            <Tab.Screen 
                name="AroundYouPageStack" 
                component={AroundYouPageStack}
                options={{
                    tabBarIcon: ({ focused,tintColor }) => (
                        !focused ? <Image
                            source={require('../../images/aroundYouIcon.png')}
                            style={[styles.aroundYouIcon, {tintColor: tintColor}]}
                          />
                          :
                          <Image
                            source={require('../../images/aroundYouFocusedIcon.png')}
                            style={[styles.aroundYouIconFocused, {tintColor: tintColor}]}
                          />
                    )
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    startIcon: {
        width: 40,
        height: 40,
        marginTop: 10
    },
    startIconFocused: {
        width: 45,
        height: 45,
        marginTop: 10
    },
    aroundYouIcon: {
        width: 40,
        height: 40,
        marginTop: 10
    },
    aroundYouIconFocused: {
        width: 40,
        height: 40,
        marginTop: 10
    }
}); 

export default ClientContainer;