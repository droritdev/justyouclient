import React, {useEffect, useState, useContext} from 'react';
import {StyleSheet, View, Text, TextInput, Dimensions, SafeAreaView, Keyboard, TouchableWithoutFeedback} from 'react-native';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useStateWithCallbackLazy } from 'use-state-with-callback';

import AppButton from '../GlobalComponents/AppButton';
import {PhoneContext} from '../../context/PhoneContext';
import {CountryContext} from '../../context/CountryContext';


//Here the verifies his phone number with a code
const PhoneNumberVerification = ({navigation}) => {
    const {country ,dispatchCountry} = useContext(CountryContext);
    const {dispatchArea} = useContext(PhoneContext);
    const {dispatchNumber} = useContext(PhoneContext);
    const [areaCodeInput, setAreaCodeInput] = useState("");
    const [phoneNumberInput, setPhoneNumberInput] = useState("");
    const [fullPhoneNumber, setFullPhoneNumber] = useStateWithCallbackLazy("");
    const [code, setCode] = useState("");
    const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
    const [isPhoneError, setIsPhoneError] = useState(false);
    const [isNextError, setIsNextError] = useState(false);
    const [nextErrorMessage, setNextErrorMessage] = useState("");
    const [isCodeError, setIsCodeError] = useState(false);
    const [codeErrorMessage, setCodeErrorMessage] = useState("");
    const [inputIsValid,setInputIsValid] = useState(false);
    const [isCodeSent,setIsCodeSent] = useState("none");

    const [requestId, setRequestId] = useState()


    //run when page create
    // useEffect (() => {
    //   getAreaCode();
    // }, []);

    //Get area code by country picked
    const getAreaCode = () => {
      switch(country){
        case "United States":
          setAreaCodeInput("001");
      }
    }

    const config = {
      withCredentials: true,
      baseURL: 'http://justyou.iqdesk.info:8081/',
      headers: {
        "Content-Type": "application/json",
      },
    };

        //Send GET request to mongodb using axios, to check if phone is already exist
        //Send GET request to mongodb using axios, to check if phone is already used
          const checkPhoneIsUsed = () => {
            axios
            .get('/clients/phone/'+areaCodeInput+phoneNumberInput, config)
            .then((doc) => {
              console.log('in then of find client phone');
              if (doc.data[0].phone.areaCode === areaCodeInput && doc.data[0].phone.phoneNumber === phoneNumberInput) {
                setPhoneErrorMessage("Phone is already used");
                setIsPhoneError(true);
              }
            })
            .catch((err) =>  {
              setIsPhoneError(false);
              setIsNextError(false);
              setFullPhoneNumber("97" + areaCodeInput + phoneNumberInput, (currentPhoneNumber) => {
                console.log('currentPhoneNumber ',currentPhoneNumber);
                sendVerificationCode(currentPhoneNumber);
              });
            });
          }

    //Sets the areaCode object to the value
    const handleOnChangeAreaCode = (value) => {
      if(value.length > 3){
        value = value.slice(0,3);
      }
      setIsNextError(false);
      setIsPhoneError(false);
      setIsCodeError(false);
      setAreaCodeInput(value);
    }

    //Sets the phoneNumber object to the value
    const handleOnChangePhoneNumber = (value) => {
      if(value.length > 7){
        value = value.slice(0,7);
      }
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
      if(value.length === 4){
        Keyboard.dismiss()
      }
    }

    //Send the verify code to the user's phone if the field are valid
    const handleVerify = () => {

      Keyboard.dismiss()

      let areaCodeTemp = Number(areaCodeInput);
      let phoneNumberTemp = Number(phoneNumberInput);

      if(areaCodeInput === "" && phoneNumberInput === ""){
        setPhoneErrorMessage("Both fields are required");
        setIsPhoneError(true);
        setIsNextError(true);
      }
      else if(areaCodeInput === "" ){
        setPhoneErrorMessage("Area code is required");
        setIsPhoneError(true);
        setIsNextError(true);
      }
      else if(phoneNumberInput === "" ){
        setPhoneErrorMessage("Phone number is required");
        setIsPhoneError(true);
        setIsNextError(true);
      }
      else if(!(Number.isInteger(areaCodeTemp)) || !(Number.isInteger(phoneNumberTemp))){
        setPhoneErrorMessage("Enter digits only")
        setIsPhoneError(true);
        setIsNextError(true);
      }
      else if(areaCodeInput.length !== 3 || phoneNumberInput.length !== 7){
        setPhoneErrorMessage("Enter a valid phone number")
        setIsPhoneError(true);
        setIsNextError(true);
      }

      else{
         checkPhoneIsUsed();

      }
    }

    //The function that sends the code to the user's phone
    const sendVerificationCode = (currentPhoneNumber) => {
           setIsCodeSent('flex');
        axios
          .post('/sendCode', {
            number: currentPhoneNumber
          },
          config
          )
          .then((res) => {
            if(res !== null) {
              console.log('res not null resdata ', res.data)
              setRequestId(res.data)
              console.log('requestId after filled ', requestId)
            }
            else{
              console.log('success but res null ', error)
              alert("success but res null");
            }
          })
          .catch((error) => {
            console.log('catch error sendCode ', error.request)
            alert(error)
          })
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
      else if(code.length !== 4){
        setIsCodeError(true);
        setCodeErrorMessage('Code is 4 digits');
      }
      else{
        // dispatchArea({
        //   type: 'SET_AREA_CODE',
        //   areaCode: areaCodeInput
        // });

        // dispatchNumber({
        //   type: 'SET_PHONE_NUMBER',
        //   phoneNumber: phoneNumberInput
        // });

        // navigation.navigate('DonePopUp');
        console.log('requestId before verifyCode ', requestId)
        axios
          .post('/verifyCode', {
            request_id: requestId,
            code: code
          },
          config
          )
          .then((res) => {
            if(res !== null) {
              console.log('res not null resdata ', res.data)
              if(res.data === 'authenticated'){
                console.log('authenticated')
                // alert("authenticated");
                dispatchArea({
                  type: 'SET_AREA_CODE',
                  areaCode: areaCodeInput
                });

                dispatchNumber({
                  type: 'SET_PHONE_NUMBER',
                  phoneNumber: phoneNumberInput
                })
                navigation.navigate('DonePopUp');
              }
              else{
                console.log('failed')
                alert("failed");
              }
            }
            else{
              console.log('success but res null')
              alert("success but res null");
            }
          })
          .catch((error) => {
            console.log('catch error ', error)
            alert(error)
          })
        }
    }

    return(
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
              <Text style={styles.justYouHeader}>Just You</Text>
            </View>
            <View style={styles.phoneContainer}>
              <View style={styles.phoneAndErrorContainer}>
                <Text style={styles.inputTitle}>Phone number</Text>
                <View style={styles.phoneTextInput}>
                  <TextInput
                      style={styles.areaCodeInput}
                      textAlign='center'
                      placeholder='Area Code'
                      value = {areaCodeInput}
                      keyboardType='numeric'
                      onChangeText={value => handleOnChangeAreaCode(value)}>
                        {}</TextInput>

                  <TextInput
                      style={styles.phoneNumberInput}
                      textAlign='center'
                      placeholder='Phone Number'
                      value = {phoneNumberInput}
                      keyboardType='numeric'
                      onChangeText={value => handleOnChangePhoneNumber(value)}
                  />
                </View>
                {isPhoneError ?
                <Text style={styles.phoneErrorMessage}>{phoneErrorMessage}</Text>
                :null}
              </View>
              <View style={styles.verifyExplenationContainer}>
              <Text style={styles.verifyExplenationText}>Adding your phone number will strengthen your account security. We'll send you a text with a 4-digit code to verify your account.</Text>
              </View>
            </View>
            <View style={styles.verifyButton}>
                <AppButton
                    title="Send code to verify phone"
                    onPress={() => handleVerify()}
                />
            </View>
            <View style={styles.codeAndErrorMessage}
                  display= {isCodeSent}
                  >
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
            <View
                 display= {isCodeSent}
                >
                <TouchableOpacity
                  style={styles.sendAgainButton}
                  onPress={() => handleVerify()}
                >
                  <Text style={styles.resendCodeText}>No SMS? Tap to resend</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.nextButtonContainer}
                  display= {isCodeSent}
                  >

              {isNextError ?
              <Text style={styles.nextErrorMessage}>{nextErrorMessage}</Text>
              :null}
              <AppButton
                title="Verify phone number"
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
      flexDirection: 'column',
      backgroundColor: 'white'
    },
    headerContainer: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    justYouHeader: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: Dimensions.get('window').height * .033
    },
    phoneContainer: {
      flexDirection: 'column',
      marginTop: Dimensions.get('window').height * .055,
      height: Dimensions.get('window').height * .195
    },
    phoneAndErrorContainer: {
      height: Dimensions.get('window').height * .1
    },
    inputTitle: {
      fontWeight: 'bold',
      fontSize: Dimensions.get('window').height * .025,
      marginLeft: Dimensions.get('window').width * .0483
    },
    phoneTextInput: {
      flexDirection: 'row',
      borderColor: 'deepskyblue',
      justifyContent: 'center',
      fontSize: Dimensions.get('window').height * .025,
      marginTop: Dimensions.get('window').height * .018
    },
    areaCodeInput: {
        borderRadius: 17,
        marginRight: Dimensions.get('window').width * .0241,
        borderColor: 'deepskyblue',
        borderWidth: 2,
        height: Dimensions.get('window').height * .07,
        width: Dimensions.get('window').width * .3,
        fontSize: Dimensions.get('window').height * .0278
    },
    phoneNumberInput: {
        borderRadius: 17,
        borderColor: 'deepskyblue',
        borderWidth: 2,
        height: Dimensions.get('window').height * .07,
        width: Dimensions.get('window').width * .6,
        fontSize: Dimensions.get('window').height * .0278
    },
    phoneErrorMessage: {
      color: 'red',
      marginLeft: Dimensions.get('window').width * .049,
      fontSize: Dimensions.get('window').height * .018
    },
    verifyExplenationContainer: {
        width: Dimensions.get('window').width * .8,
        alignSelf: 'center',
        marginTop: Dimensions.get('window').height * .05
    },
    verifyExplenationText: {
        textAlign:'center',
        fontSize: Dimensions.get('window').height * .019,
    },
    verifyButton: {
        marginTop: Dimensions.get('window').height * .044
    },
    verifyButtonText: {
        fontSize: Dimensions.get('window').height * .0278,
        fontWeight: 'bold',
        color: 'white'
    },
    codeAndErrorMessage: {
      // display : 'none',
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
        marginTop: Dimensions.get('window').height * .077,
        justifyContent: 'center',
        fontSize: Dimensions.get('window').height * .0278
    },
    codeErrorMessage: {
      color: 'red',
      marginTop: Dimensions.get('window').height * .0055
    },
    resendCodeText: {
      color: 'deepskyblue',
      fontSize: Dimensions.get('window').height * .022,
      fontWeight: '600',
      alignSelf: 'center'
    },
    sendAgainButton: {
      marginTop: Dimensions.get('window').height * .055,
      width: Dimensions.get('window').width * .55,
      height: Dimensions.get('window').height * .04,
      backgroundColor: 'lightgrey',
      borderRadius: 5,
      justifyContent: 'center',
      marginLeft: Dimensions.get('window').width * .0483
    },
    nextButtonContainer: {
      flex: 1,
      justifyContent: 'flex-end',
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
      fontSize: Dimensions.get('window').height * .0278,
      fontWeight: 'bold',
      color: 'white'
    },
    nextErrorMessage: {
        color: 'red',
        marginLeft: Dimensions.get('window').width * .049,
        marginBottom: Dimensions.get('window').height * .022
    }
});

export default PhoneNumberVerification;
