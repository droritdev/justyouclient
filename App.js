import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import WelcomePopUp from './components/Register/WelcomePopUp';
import GetStarted from './components/Register/GetStarted';
import SignUp from './components/Register/SignUp';
import LogIn from './components/Register/LogIn';
import ForgotPassword from './components/Register/ForgotPassword';
import ResetPassword from './components/Register/ResetPassword';
import EmailVerification from './components/Register/EmailVerification';
import CreatePassword from './components/Register/CreatePassword';
import ProfileDetailsPage1 from './components/Register/ProfileDetailsPage1';
import ProfileDetailsPage2 from './components/Register/ProfileDetailsPage2';
import PaymentsAndPolicy from './components/Register/PaymentsAndPolicy';
import RegisteringAccountPopUp from './components/Register/RegisteringAccountPopUp';
import DetailsSuccessfully from './components/Register/DetailsSuccessfully';
import PhoneNumberVerification from './components/Register/PhoneNumberVerification';
import DonePopUp from './components/Register/DonePopUp';
import WelcomeUser from './components/Register/WelcomeUser';
import GlobalStore from './context/GlobalStore';

//The main stack navigator to navigate between screens in the app
const Stack = createStackNavigator();

const App = () => {

  return (
    <GlobalStore>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName='WelcomePopUp'
          screenOptions={{headerShown: false}}
        >
          <Stack.Screen name='WelcomePopUp' component={WelcomePopUp} />
          <Stack.Screen name='GetStarted' component={GetStarted} />
          <Stack.Screen name='SignUp' component={SignUp} />
          <Stack.Screen name='EmailVerification' component={EmailVerification} />
          <Stack.Screen name='CreatePassword' component={CreatePassword} />
          <Stack.Screen name='ProfileDetailsPage1' component={ProfileDetailsPage1} />
          <Stack.Screen name='ProfileDetailsPage2' component={ProfileDetailsPage2} />
          <Stack.Screen name='RegisteringAccountPopUp' component={RegisteringAccountPopUp} />
          <Stack.Screen name='DetailsSuccessfully' component={DetailsSuccessfully} />
          <Stack.Screen name='PhoneNumberVerification' component={PhoneNumberVerification} />
          <Stack.Screen name='PaymentsAndPolicy' component={PaymentsAndPolicy} />
          <Stack.Screen name='DonePopUp' component={DonePopUp} />
          <Stack.Screen name='WelcomeUser' component={WelcomeUser} />
          <Stack.Screen name='LogIn' component={LogIn} />
          <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
          <Stack.Screen name='ResetPassword' component={ResetPassword} />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalStore>
  )
}

export default App;