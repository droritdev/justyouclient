import React, {useState, useContext, useEffect} from 'react';
import {StyleSheet, View, Text, Image, TextInput, Dimensions} from 'react-native';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';

import {EmailContext} from '../context/EmailContext';

//Here the user enters the verification code he recived to his mail address
const EmailVerification = ({navigation}) => {
    const {emailAddress, dispatchEmail} = useContext(EmailContext);
    const [code, setCode] = useState("");
    const [codeErrorMessage, setCodeErrorMessage] = useState("");
    const [isErrorCodeMessage, setIsErrorCodeMessage] = useState(false);

    const config = {
      withCredentials: true,
      baseURL: 'http://localhost:3000/',
      headers: {
        "Content-Type": "application/json",
      },
    };

    //Navigate back to the SignUp page
    const handleArrowButton = () => {
      dispatchEmail({
        type: 'SET_EMAIL_ADDRESS',
        emailAddress: ""
      })
      navigation.navigate('SignUp');
    }

    //Set the code to the value in the text field
    const handleOnInputChange = (text) => {
      setIsErrorCodeMessage(false);
      setCode(text);
      if(Number(text) && text.length === 5){
        setIsErrorCodeMessage(false);
      }
    }

    //Re-send the verification code
    const sendVerifyEmail = () => {
      alert('Email sent');
        // axios
        //   .post('/send-verification-code', {
        //     to: emailAddress,
        //     channel: "email"
        //   },
        //   config
        // )
        // .then((res) => {
        //   if(res !== null) {
        //     if(res.data.status === 'pending'){
        //       alert('pending')
        //     }
        //     else{
        //       alert(res.data);
        //     }
        //   }
        //   else{
        //     alert("Error 2");
        //   }
        // }
        // )
        // .catch((error) => {
        //   alert(error)
        // })
    }

    //Handle the next button press
    const handleNext = () => {
      if(code === ""){
        setCodeErrorMessage("You didnt enter the code");
        setIsErrorCodeMessage(true);
      }
      else if(!(Number(code))){
        setCodeErrorMessage("Enter digits only");
        setIsErrorCodeMessage(true);
      }
      else if(code.length < 5){
        setCodeErrorMessage("Code is 5 digits");
        setIsErrorCodeMessage(true);
      }
      else{
        setIsErrorCodeMessage(false);
        navigation.navigate('CreatePassword');
        // axios
        //   .post('/verify-code', {
        //     to: emailAddress,
        //     code: code
        //   },
        //   config
        // )
        // .then((res) => {
        //   if(res !== null) {
        //     if(res.data.status === 'approved'){
        //       setIsErrorCodeMessage(false);
        //       setCodeErrorMessage("");
        //       navigation.navigate('CreatePasswordPartner');
        //     }
        //     else{
        //       setCodeErrorMessage("Wrong Code - try again")
        //     }
        //   }
        //   else{
        //     alert("Error2")
        //   }
        // }
        // )
        // .catch((error) => {
        //   alert(error)
        // })
      }
    }

    //Handle the Re-send button press
    const handleResendEmail = () => {
      sendVerifyEmail();
    }

    return(
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handleArrowButton}
        >
          <Image
            source={require('../images/arrowBack.png')}
            style={styles.arrowImage}
          />
        </TouchableOpacity>
        <Text style={styles.verifyEmailTitle}>Verify email</Text>
        <Text style={styles.verifyEmailText}>We've sent a code to {<Text style={{color: 'deepskyblue'}}>{emailAddress}</Text>}. To continue, enter your code here bellow.</Text>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder='Enter your code'
            textAlign='center'
            onChangeText={text => handleOnInputChange(text)}
          />
          {isErrorCodeMessage ?
            <Text style={styles.codeErrorText}>{codeErrorMessage}</Text>
          :null}
        </View>
        <View style={styles.fotterContainer}>
            <Text style={styles.didntGetEmailText}>Didn't get an email? Please make sure we have your email address right, or maybe it went to spam</Text>
            <TouchableOpacity 
              style={styles.sendAgainButton}
              onPress={handleResendEmail}
            >
              <Text style={styles.sendAgainButtonText}>Resend email</Text> 
            </TouchableOpacity>
        </View>
        <View style={styles.nextButtonContainer}>
            <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
            >
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
        </View>
     </View>
    )
  }
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      height: '100%'
    },
    arrowImage: {
        marginTop: 70,
        marginLeft: 20
    },
    verifyEmailTitle: {
        fontWeight: 'bold',
        fontSize: 40,
        marginTop: Dimensions.get('window').height * .05,
        marginLeft: 20
    },
    verifyEmailText: {
        width: Dimensions.get('window').width * .875,
        fontWeight: 'bold',
        fontSize: 25,
        marginTop: 30,
        marginLeft: 20
    },
    textInputContainer: {
      height: Dimensions.get('window').height * .25
    },
    textInput: {
        borderColor: 'deepskyblue',
        borderRadius: 20,
        borderWidth: 3,
        height: Dimensions.get('window').height * .08,
        marginRight: 20,
        marginTop: 60,
        justifyContent: 'center',
        fontSize: 24,
        marginLeft: 20,
        fontSize: 33
    },
    codeErrorText: {
      textAlign:'center',
      color: 'red',
      fontSize: 20,
      marginTop: 5
    },
    fotterContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-end',
      marginLeft: 20,

    },
    didntGetEmailText: {
      width: Dimensions.get('window').width * .9,
      fontWeight: 'bold',
      fontSize: 25
    },
    sendAgainButton: {
      marginTop: 20,
      width: Dimensions.get('window').width * .35,
      height: Dimensions.get('window').height * .035,
      backgroundColor: 'lightgrey',
      borderRadius: 5,
      justifyContent: 'center'
    },
    sendAgainButtonText: {
      color: 'deepskyblue', 
      fontSize: 20,
      fontWeight: '600',
      alignSelf: 'center'
    },
    nextButtonContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      marginBottom: 40,
      alignItems: 'center'
    },
    nextButton: {
      width: Dimensions.get('window').width * .9,
      height: Dimensions.get('window').height * .065,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: 'deepskyblue',
      borderRadius: 20
    },
    nextButtonText: {
      fontSize: 25,
      fontWeight: 'bold',
      color: 'white'
    },
  });

  export default EmailVerification;