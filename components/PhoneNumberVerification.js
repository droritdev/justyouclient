import React, {useState, useContext} from 'react';
import {StyleSheet, View, Text, TextInput, Dimensions} from 'react-native';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';

import {PhoneContext} from '../context/PhoneContext';
 
//Here the verifies his phone number with a code
const PhoneNumberVerification = ({navigation}) => {
    const {dispatchArea} = useContext(PhoneContext);
    const {dispatchNumber} = useContext(PhoneContext);
    const [areaCodeInput, setAreaCodeInput] = useState("");
    const [phoneNumberInput, setPhoneNumberInput] = useState("");
    const [fullPhoneNumber, setFullPhoneNumber] = useState("");
    const [code, setCode] = useState("");
    const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
    const [isPhoneError, setIsPhoneError] = useState(false);
    const [isNextError, setIsNextError] = useState(false);
    const [nextErrorMessage, setNextErrorMessage] = useState("");
    const [isCodeError, setIsCodeError] = useState(false);
    const [codeErrorMessage, setCodeErrorMessage] = useState("");
  
    const config = {
      withCredentials: true,
      baseURL: 'http://localhost:3000/',
      headers: {
        "Content-Type": "application/json",
      },
    };

    //Sets the areaCode object to the value
    const handleOnChangeAreaCode = (value) => {
      setIsNextError(false);
      setIsPhoneError(false);
      setIsCodeError(false);
      setAreaCodeInput(value);
    }

    //Sets the phoneNumber object to the value
    const handleOnChangePhoneNumber = (value) => {
      setIsNextError(false);
      setIsPhoneError(false);
      setIsCodeError(false);
      setPhoneNumberInput(value);
    }

    //Sets the code object to the value`
    const handleOnChangeCode = (value) => {
      setIsNextError(false);
      setIsPhoneError(false);
      setIsCodeError(false);
      setCode(value);
    }

    //Send the verify code to the user's phone if the field are valid
    const handleVerify = () => {
      let areaCodeTemp = Number(areaCodeInput);
      let phoneNumberTemp = Number(phoneNumberInput);

      if(areaCodeInput === "" || phoneNumberInput == ""){
        setPhoneErrorMessage("Both fields are required");
        setIsPhoneError(true);
        setIsNextError(true);
      }
      else if(!(Number.isInteger(areaCodeTemp)) || !(Number.isInteger(phoneNumberTemp))){
        setPhoneErrorMessage("Enter digits only")
        setIsPhoneError(true);
        setIsNextError(true);
      }
      else if(areaCodeInput.length != 3 || phoneNumberInput.length != 7){
        setPhoneErrorMessage("Enter a valid phone number")
        setIsPhoneError(true);
        setIsNextError(true);
      }
      else{
        setIsPhoneError(false);
        setIsNextError(false);
        setFullPhoneNumber("+972"+(areaCodeInput.concat(phoneNumberInput)));
        sendVerificationCode();
      }
    }

    //The function that sends the code to the user's phone
    const sendVerificationCode = () => {
        alert("Code sent");
        // alert(fullPhoneNumber)
        // axios
        //   .post('/send-verification-code', {
        //     to: fullPhoneNumber,
        //     channel: "sms"
        //   },
        //   config
        //   )
        //   .then((res) => {
        //     if(res !== null) {
        //       if(res.data.status === 'pending'){
        //         alert("pending");
        //       }
        //       else{
        //         alert("Error 1");
        //       }
        //     }
        //     else{
        //       alert("Error 2");
        //     }
        //   }
        //   )
        //   .catch((error) => {
        //     alert(error)
        //   })
    }

    //Handle the next button press - if ok, navigates to the DonePopUp page
    const handleNext = () => {
      if(areaCodeInput === "" || phoneNumberInput === ""){
        setNextErrorMessage("Fill the fields to verify your phone number");
        setIsNextError(true);
      }
      else if(code === ""){
        setNextErrorMessage("Enter your code to continue");
        setIsNextError(true);
      }
      else if(!(Number(code))){
        setIsCodeError(true);
        setCodeErrorMessage('Enter digits only');
      }
      else if(code.length !== 5){
        setIsCodeError(true);
        setCodeErrorMessage('Code is 5 digits');
      }
      else{
        dispatchArea({
          type: 'SET_AREA_CODE',
          areaCode: areaCodeInput
        });

        dispatchNumber({
          type: 'SET_PHONE_NUMBER',
          phoneNumber: phoneNumberInput
        });

        navigation.navigate('DonePopUp');
        // axios
        //   .post('/verify-code', {
        //     to: fullPhoneNumber,
        //     code: code
        //   },
        //   config
        //   )
        //   .then((res) => {
        //     if(res !== null) {
        //       if(res.data.status === 'approved'){
        //         alert("approved");
        //         dispatchArea({
        //           type: 'SET_AREA_CODE',
        //           areaCode: areaCodeInput
        //         });
        
        //         dispatchNumber({
        //           type: 'SET_PHONE_NUMBER',
        //           phoneNumber: phoneNumberInput
        //         })
        //         navigation.navigate('DonePopUp');
        //       }
        //       else{
        //         alert("Error 1");
        //       }
        //     }
        //     else{
        //       alert("Error 2");
        //     }
        //   }
        //   )
        //   .catch((error) => {
        //     alert(error)
        //   })
        }
    }
  
    return(
        <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Text style={styles.justYouHeader}>Just You</Text>
              <Text style={styles.partnerHeader}>Partner</Text>
            </View>
            <View style={styles.phoneContainer}>
              <View style={styles.phoneAndErrorContainer}>
                <Text style={styles.inputTitle}>PHONE NUMBER</Text>
                <View style={styles.phoneTextInput}>
                  <TextInput
                      style={styles.areaCodeInput}
                      textAlign='center'
                      placeholder='+001'
                      onChangeText={text => handleOnChangeAreaCode(text)}
                  />
                  <TextInput
                      style={styles.phoneNumberInput}
                      textAlign='center'
                      placeholder='00000000000'
                      onChangeText={text => handleOnChangePhoneNumber(text)}
                  />
                </View>
                {isPhoneError ?
                <Text style={styles.phoneErrorMessage}>{phoneErrorMessage}</Text>
                :null}
              </View>
              <View style={styles.verifyExplenationContainer}>
              <Text style={styles.verifyExplenationText}>Adding your phone number will strengthen your account security. We'll send you a text with a 5-digit code to verify your account.</Text>
              </View>
            </View>
            <View>
                <TouchableOpacity
                    style={styles.verifyButton}
                    onPress={handleVerify}
                >
                    <Text style={styles.verifyButtonText}>Verify</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.codeAndErrorMessage}>
              <View style={styles.codeTextInput}>
                <TextInput
                    style={{fontSize: 33}}
                    placeholder='Enter your code'
                    textAlign='center'
                    onChangeText={text => handleOnChangeCode(text)}
                />
              </View>
              {isCodeError ? 
                <Text style={styles.codeErrorMessage}>{codeErrorMessage}</Text>
              : null}
            </View>
            <View>
                <TouchableOpacity 
                  style={styles.sendAgainButton}
                  onPress={handleVerify}
                >
                  <Text style={styles.resendCodeText}>No SMS? Tap to resend</Text> 
                </TouchableOpacity>
            </View>
            <View style={styles.nextButtonContainer}>
              {isNextError ?
              <Text style={styles.nextErrorMessage}>{nextErrorMessage}</Text>
              :null}
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNext}
                >
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      height: Dimensions.get('window').height,
      flexDirection: 'column',
      //backgroundColor: 'white'
    },
    headerContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 60
    },
    justYouHeader: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 30
    },
    partnerHeader: {
      color: 'deepskyblue',
      fontWeight: 'bold',
      fontSize: 20
    },
    phoneContainer: {
      flexDirection: 'column',
      marginTop: 50,
      height: 175
    },
    phoneAndErrorContainer: {
      height: 90
    },
    inputTitle: {
      fontSize: 20,
      marginLeft: 20
    },
    phoneTextInput: {
      flexDirection: 'row',
      borderColor: 'deepskyblue',
      justifyContent: 'center',
      fontSize: 24,
      marginTop: 15
    },
    areaCodeInput: {
        borderRadius: 20,
        marginRight: 10,
        borderColor: 'deepskyblue',
        borderWidth: 3,
        height: Dimensions.get('window').height * .06,
        width: Dimensions.get('window').width * .3,
        fontSize: 25
    },
    phoneNumberInput: {
        borderRadius: 20,
        borderColor: 'deepskyblue',
        borderWidth: 3,
        height: Dimensions.get('window').height * .06,
        width: Dimensions.get('window').width * .6,
        fontSize: 25
    },
    phoneErrorMessage: {
      color: 'red',
      marginLeft: 25,
      fontSize: 17
    },
    verifyExplenationContainer: {
        width: Dimensions.get('window').width * .8,
        alignSelf: 'center',
        marginTop: 30
    },
    verifyExplenationText: {
        textAlign:'center',
        fontSize: 17,
    },
    verifyButton: {
        marginTop: 40,
        width: Dimensions.get('window').width * .9,
        height: Dimensions.get('window').height * .07,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'deepskyblue',
        borderRadius: 20
    },
    verifyButtonText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    codeAndErrorMessage: {
      height: Dimensions.get('window').height * .1544,
      width: Dimensions.get('window').width * .9, 
      alignItems: 'center',
      alignSelf: 'center'
    },
    codeTextInput: {
        borderColor: 'deepskyblue',
        borderRadius: 20,
        borderWidth: 3,
        height: Dimensions.get('window').height * .07,
        width: Dimensions.get('window').width * .9,
        marginTop: 70,
        justifyContent: 'center',
        fontSize: 24
    },
    codeErrorMessage: {
      color: 'red',
      marginTop: 5
    },
    resendCodeText: {
      color: 'deepskyblue', 
      fontSize: 20,
      fontWeight: '600',
      alignSelf: 'center'
    },
    sendAgainButton: {
      marginTop: 50,
      width: Dimensions.get('window').width * .55,
      height: Dimensions.get('window').height * .04,
      backgroundColor: 'lightgrey',
      borderRadius: 5,
      justifyContent: 'center',
      marginLeft: 20
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
    nextErrorMessage: {
        color: 'red',
        marginLeft: 25,
        marginBottom: 20
    }
});

export default PhoneNumberVerification;