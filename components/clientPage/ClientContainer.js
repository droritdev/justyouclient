import React, {Component, useEffect} from 'react';
import {Image, StyleSheet, BackHandler} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import StarPageStack from './starTab/StarPageStack';
import AroundYouPageStack from './aroundYouTab/AroundYouPageStack';
import SearchPageStack from './searchTab/SearchPageStack';
import ProfilePageStack from './profilePageTab/ProfilePageStack';

const Tab = createBottomTabNavigator();

//The tab navigation container to handle the navigation in the client's area
const ClientContainer = () => {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true)
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', () => true)
  }, [])
  
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: {
          height: 60,
          borderTopWidth: 1.5,
        },
        showLabel: false,
      }}>
      <Tab.Screen
        name="StarPageStack"
        component={StarPageStack}
        options={{
          tabBarIcon: ({focused, tintColor}) =>
            !focused ? (
              <Image
                source={require('../../images/starIcon.png')}
                style={[styles.startIcon, {tintColor: tintColor}]}
              />
            ) : (
              <Image
                source={require('../../images/starIconFocused.jpg')}
                style={[styles.startIconFocused, {tintColor: tintColor}]}
              />
            ),
        }}
      />
      <Tab.Screen
        name="AroundYouPageStack"
        component={AroundYouPageStack}
        options={{
          tabBarIcon: ({focused, tintColor}) =>
            !focused ? (
              <Image
                source={require('../../images/aroundYouIcon.png')}
                style={[styles.aroundYouIcon, {tintColor: tintColor}]}
              />
            ) : (
              <Image
                source={require('../../images/aroundYouFocusedIcon.png')}
                style={[styles.aroundYouIconFocused, {tintColor: tintColor}]}
              />
            ),
        }}
      />
      <Tab.Screen
        name="SearchPageStack"
        component={SearchPageStack}
        options={{
          tabBarIcon: ({focused, tintColor}) =>
            !focused ? (
              <Image
                source={require('../../images/searchIcon.png')}
                style={[styles.searchIcon, {tintColor: tintColor}]}
              />
            ) : (
              <Image
                source={require('../../images/searchIconFocused.png')}
                style={[styles.searchIconFocused, {tintColor: tintColor}]}
              />
            ),
        }}
      />
      <Tab.Screen
        name="ProfilePageStack"
        component={ProfilePageStack}
        options={{
          tabBarIcon: ({focused, tintColor}) =>
            !focused ? (
              <Image
                source={require('../../images/profilePageIcon.png')}
                style={[styles.profileIcon, {tintColor: tintColor}]}
              />
            ) : (
              <Image
                source={require('../../images/profilePageIconFocused.png')}
                style={[styles.profileFocusedIcon, {tintColor: tintColor}]}
              />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  startIcon: {
    width: 25,
    height: 25
  },
  startIconFocused: {
    width: 30,
    height: 30
  },
  aroundYouIcon: {
    width: 25,
    height: 25
  },
  aroundYouIconFocused: {
    width: 30,
    height: 30
  },
  searchIcon: {
    width: 25,
    height: 25
  },
  searchIconFocused: {
    width: 30,
    height: 30
  },
  profileIcon: {
    width: 25,
    height: 25
  },
  profileFocusedIcon: {
    width: 30,
    height: 30
  },
});

export default ClientContainer;
