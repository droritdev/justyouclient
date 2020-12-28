import React,{  useContext,useState, useEffect } from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import {EmailContext} from '../../context/EmailContext';


//Page 1 of the app, welcoming the user
const WelcomePopUp = ({navigation}) => {

    const {dispatchEmail} = useContext(EmailContext);


    const config = {
        withCredentials: true,
        baseURL: 'http//localhost:3000/',
        headers: {"Content-Type": "application/json"
        },
    }

    //Check if the user is already logged in
    //If logged -> navigate tohome page
    //If not -> navigate to get started

    useEffect(() => {

        const subscriber = auth().onAuthStateChanged((user) => {
           
            if (user) {
            //      dispatchEmail({
            //     type: 'SET_EMAIL_ADDRESS',
            //     emailAddress: user.email.toLowerCase()
            //   });
                console.log('welcomePopUp: ', user.email.toLocaleLowerCase());
                navigation.navigate('ClientContainer');
            } else {
                navigation.navigate('GetStarted');
            }
         });
         return subscriber;
        } ,[]);
    


    //Automaticlly navigates to the next page in 4 seconds (4 * 1000 milli secons = 4000)
    // setTimeout(() => checkIfUserLogged(), 4000);
    // checkIfUserLogged();
    return(
        <View style={styles.welcomePage1}>
            <Text style={styles.justYoutitle}>Just You</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    welcomePage1: {
      backgroundColor: 'dodgerblue',
      height: Dimensions.get('window').height,
      backgroundColor: 'white',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    justYoutitle: {
        fontSize: Dimensions.get('window').height * .099,
        color: 'white',
        fontWeight: 'bold'
    }
});

export default WelcomePopUp;