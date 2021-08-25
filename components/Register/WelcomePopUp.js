import React,{  useContext,useState, useEffect } from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import {EmailContext} from '../../context/EmailContext';


//Page 1 of the app, welcoming the user
const WelcomePopUp = ({navigation}) => {

    const {dispatchClientObject} = useContext(EmailContext);


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
      console.log('WelcomePopUp');
        const subscriber = auth().onAuthStateChanged((user) => {
            global.covidAlert = true;

            if (user) {
              /*axios
                .get('/clients/'
                  + user.email.toLocaleLowerCase(),
                  config,
                )
                .then((doc) => {
                  if (doc) {
                    console.log(doc.data[0]);
                    dispatchClientObject({
                      type: 'SET_CLIENT_OBJECT',
                      clientObject: doc.data[0],
                    });
                  }
                })
                .catch((err) => console.log(err));*/
                setTimeout(() => navigation.navigate('ClientContainer'), 1000);
              //  navigation.navigate('ClientContainer');
            } else {
                setTimeout(() => navigation.navigate('GetStarted'), 1000);
              //  navigation.navigate('GetStarted');
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
      //backgroundColor: 'white',
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
