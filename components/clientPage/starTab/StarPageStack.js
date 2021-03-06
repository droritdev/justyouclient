import React from 'react';
//import {Button, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import StarPage from './StarPage';
import TrainerOrderPage from './TrainerOrderPage';
import WhyUs from './WhyUs';
import QuestionsAndAnswers from './QuestionsAndAnswers';
import ComingSoon from './ComingSoon';
import CustomerService from './CustomerService';
import ChooseDateAndTimePage from './ChooseDateAndTimePage';
import TrainersByCategories from './TrainersByCategories';
import TrainerReviews from './TrainerReviews';

const Stack = createStackNavigator();

//The client's stack navigator to handle screen navigations in the star section
const TrainerProfilePageStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="StarPage" component={StarPage} />
      <Stack.Screen name="TrainerOrderPage" component={TrainerOrderPage} />
      <Stack.Screen name="WhyUs" component={WhyUs} />
      <Stack.Screen
        name="QuestionsAndAnswers"
        component={QuestionsAndAnswers}
      />
      <Stack.Screen name="ComingSoon" component={ComingSoon} />
      <Stack.Screen name="CustomerService" component={CustomerService} />
      <Stack.Screen
        name="ChooseDateAndTimePage"
        component={ChooseDateAndTimePage}
      />
      <Stack.Screen
        name="TrainersByCategories"
        component={TrainersByCategories}
      />
      <Stack.Screen name="TrainerReviews" component={TrainerReviews} />
    </Stack.Navigator>
  );
};

export default TrainerProfilePageStack;
