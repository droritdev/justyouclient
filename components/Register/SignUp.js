import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, Text, TextInput, Button, Dimensions, SafeAreaView, Keyboard, TouchableWithoutFeedback} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

import AppButton from '../GlobalComponents/AppButton';
import {EmailContext} from '../../context/EmailContext';

//Here the user enters his email address to verify his account
const SignUp = ({navigation}) => {
    const {emailAddress, dispatchEmail} = useContext(EmailContext);
    const [emailIsValidate, setEmailIsValidate] = useState(true);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [emailAddressInput, setEmailAddressInput] = useState("");
    const [inputIsValid,setInputIsValid] = useState(false);

    const config = {
      withCredentials: true,
      baseURL: 'http://10.0.2.2:3000/',
    //  baseURL: 'http://localhost:3000/',
      headers: {
        "Content-Type": "application/json",
      },
    };



    //Navigate to Login page
    const handleSignIn = () => {
      setEmailErrorMessage(false);
      navigation.navigate('LogIn');
    }

    //Send the verification code to the user's email
    const sendVerifyEmail = (emailAddressToVerify) => {
      console.log('emailAddressInSignUp');
      console.log(emailAddressToVerify);
       /* axios
          .post('/send-verification-code', {
            to: emailAddressToVerify,
            channel: "email"
          },
          config
        )
        .then((res) => {
          if(res !== null) {
            if(res.data.status === 'pending'){
              alert('Pending');
              navigation.navigate('EmailVerification');
            }
            else{
              console.log(res.data)
              alert(res.data);
            }
          }
          else{
            alert("Error 2");
          }
        }
        )
        .catch((error) => {
          alert(error);
          console.log(error);
        })*/
        //navigation.navigate('EmailVerification');
        navigation.navigate('CreatePassword');

    }

    //Set the emailAddressInput to the value in the text field
    const handleInput = (text) => {
      setEmailAddressInput(text);
      setEmailErrorMessage(false);
      let mailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if(mailformat.test(text)){
        setEmailIsValidate(true);
        setInputIsValid(true);
      }
      else{
        setInputIsValid(false);
      }
    }

    //Send GET request to mongodb using axios, to check if email is already exist
    const checkEmailIsUsed = () => {
      auth().fetchSignInMethodsForEmail(emailAddressInput.toLowerCase())
      .then((signInMethods) => {
        if (signInMethods.length) {
          setEmailErrorMessage("Email address is already used");
          setEmailIsValidate(false);
        } else {
          dispatchEmail({
            type: 'SET_EMAIL_ADDRESS',
            emailAddress: emailAddressInput.toLowerCase()
          });
          sendVerifyEmail(emailAddressInput.toLowerCase());
        }
      })
      .catch((error) => { 
        console.log('error in wuth check email ', error)
      });

      // axios
      // .get('/clients/'+emailAddressInput.toLowerCase(),config)
      // .then((doc) => {
      //   if(doc) {
      //     if(doc.data[0].email!=null){
      //       setEmailErrorMessage("Email address is already used");
      //       setEmailIsValidate(false);
      //     }
      //   }
      // })
      // .catch((err) => {
      //   //email is not used
      //   dispatchEmail({
      //     type: 'SET_EMAIL_ADDRESS',
      //     emailAddress: emailAddressInput.toLowerCase()
      //   });
      //   sendVerifyEmail(emailAddressInput.toLowerCase());
      // })
    }

    //Handle the next button press to send the verify code
    const handleNext = () => {
      if(inputIsValid){
        checkEmailIsUsed();
      }
      else if(emailAddressInput === ""){
        setEmailErrorMessage("Email address is required");
        setEmailIsValidate(false);
      }
      else{
        dispatchEmail({
          type: 'SET_EMAIL_ADDRESS',
          emailAddress: ""
        });
        setEmailErrorMessage("Enter a valid email address");
        setEmailIsValidate(false);
      }
    }

    return(
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.upperContainer}>
          <Text style={styles.justYouHeader}>Just You</Text>
          <Text style={styles.signUpText}>Sign up and start searching</Text>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.textInput}>
            <TextInput
              style={{fontSize: 20}}
              textAlign='center'
              placeholder='Enter your email address'
              onChangeText={text => handleInput(text)}
              value={emailAddressInput}
            />
          </View>
          <View>
              {!emailIsValidate ?
              <Text style={styles.emailErrorText}>{emailErrorMessage}</Text>
              :null}
          </View>
        </View>
        <View style={styles.fotterContainer}>
          <View style={styles.alreadyHaveAccountContainer}>
            <Text style={styles.alreadyHaveAnAccountText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={handleSignIn}
            >
            <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
          <AppButton
            title="Next"
            onPress={() => handleNext()}
          />
        </View>
      </SafeAreaView>
      </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
      height: Dimensions.get('window').height,
      backgroundColor: 'white',
      flexDirection: 'column'
    },
    upperContainer: {
      marginLeft: Dimensions.get('window').width * .0483,
    },
    justYouHeader: {
      color: 'deepskyblue',
      fontWeight: 'bold',
      fontSize: Dimensions.get('window').height * .033,
      marginTop: Dimensions.get('window').height * .013,

    },
    signUpText: {
      fontSize: Dimensions.get('window').height * .044,
      fontWeight: 'bold',
      marginTop: Dimensions.get('window').height * .05,
    },
    inputContainer: {
    },
    inputTitle: {
      marginTop: Dimensions.get('window').height * .066,
      fontSize: Dimensions.get('window').height * .022,
      marginLeft: Dimensions.get('window').width * .06,
    },
    textInput: {
      borderColor: 'deepskyblue',
      borderRadius: 17,
      borderWidth: 2,
      height: Dimensions.get('window').height * .08,
      marginRight: Dimensions.get('window').width * .0483,
      marginTop: Dimensions.get('window').height * .145,
      justifyContent: 'center',
      marginLeft: Dimensions.get('window').width * .0483,
    },
    emailErrorText: {
        textAlign:'center',
        color: 'red',
        fontSize: Dimensions.get('window').height * .022
    },
    fotterContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
  alreadyHaveAccountContainer: {
    flexDirection: 'row',
    marginTop: Dimensions.get('window').height * .022
  },
    alreadyHaveAnAccountText: {
      color: 'grey'
    },
    signInText: {
      fontWeight: 'bold',
      color: 'deepskyblue'
    }
});

export default SignUp;
