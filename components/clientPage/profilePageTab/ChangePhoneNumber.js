import React, {useState, useContext} from 'react';
import {StyleSheet, Alert, View, Text, TextInput, Dimensions, SafeAreaView, Keyboard} from 'react-native';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';

import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';
import AppButton from '../../GlobalComponents/AppButton';

import {ClientContext} from '../../../context/ClientContext';

//Here the user enters his full phone number (area code and phone number) and verifies it with a code sent to his phone
const ChangePhoneNumber = ({navigation}) => {
    const [areaCodeInput, setAreaCodeInput] = useState("");
    const [phoneNumberInput, setPhoneNumberInput] = useState("");
    const [fullPhoneNumber, setFullPhoneNumber] = useState("");
    const [isCodeSent,setIsCodeSent] = useState("none");
    const [code, setCode] = useState("");
    const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
    const [isPhoneError, setIsPhoneError] = useState(false);
    const [isNextError, setIsNextError] = useState(false);
    const [nextErrorMessage, setNextErrorMessage] = useState("");

    const [requestId, setRequestId] = useState()

    //Client information
    const {clientObject} = useContext(ClientContext);

    const config = {
      withCredentials: true,
      baseURL: 'http://justyou.iqdesk.info:8081/',
      headers: {
        "Content-Type": "application/json",
      },
    };

    //Navigates back to the settings page
    const handleArrowButton = () => {
        navigation.navigate('Settings');
    }

  //Send GET request to mongodb using axios, to check if phone is already used
  const checkPhoneIsUsed = () => {
    axios
    .get('/clients/phone/'+areaCodeInput+phoneNumberInput, config)
    .then((doc) => {
      if (doc.data[0].phone.areaCode === areaCodeInput && doc.data[0].phone.phoneNumber === phoneNumberInput) {
        setPhoneErrorMessage("Phone is already used");
        setIsPhoneError(true);
      }
    })
    .catch((err) =>  {
      setIsPhoneError(false);
      setIsNextError(false);
      let fullPhone = '97' + areaCodeInput + phoneNumberInput;
      sendVerificationCode(fullPhone);
    });
  }

    //Sets the areaCode object to the value
    const handleOnChangeAreaCode = (value) => {
      if (value.length > 3) {
        value = value.slice(0, 3);
      }
      setIsNextError(false);
      setIsPhoneError(false);
      setAreaCodeInput(value);
    }

    //Sets the phoneNumber object to the value
    const handleOnChangePhoneNumber = (value) => {
      if (value.length > 7) {
        value = value.slice(0, 7);
      }
      setIsNextError(false);
      setIsPhoneError(false);
      setPhoneNumberInput(value);
    }

    //Sets the code object to the value
    const handleOnChangeCode = (value) => {
      setIsNextError(false);
      setIsPhoneError(false);
      setCode(value);
      if(value.length === 4){
        Keyboard.dismiss()
      }
    }

    //When pressed, the button checks if the number is valid and calls the sendVerificationCode function
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
        setPhoneErrorMessage("Phone Number is required");
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

    //The function that sends the verification code to the user
    const sendVerificationCode = (number) => {
      if(isPhoneError){
        setNextErrorMessage("You must set all valid fields to continue");
        setIsNextError(true);
      }
      else{
        setFullPhoneNumber(number);
        setIsCodeSent('flex');
        axios
          .post('/sendCode', {
            number: number
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
              // alert("success but res null");
            }
          })
          .catch((error) => {
            console.log('catch error sendCode ', error.request)
            // alert(error)
          })
        }
    }

    //When preesed, the app checks if the code (when entered) is equal to the code was sent to the user - if so, navigates to the DonePopIp page
    const handleSubmit = () => {
      if(areaCodeInput === "" || phoneNumberInput === ""){
        setNextErrorMessage("Fill the fields to verify your phone number");
        setIsNextError(true);
      }
      else if(code === ""){
        setNextErrorMessage("Enter your code to continue");
        setIsNextError(true);
      }
      else if(code.length !== 4){
        setNextErrorMessage("Code should be 4 digits");
        setIsNextError(true);
      }
      else{
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
                updateDB()
              }
              else{
                console.log('failed')
                setNextErrorMessage('Phone number was not verified. Please try again.')
              }
            }
            else{
              console.log('success but res null')
              setNextErrorMessage('Phone number was not verified. Please try again.')
            }
          })
          .catch((error) => {
            console.log('catch error ', error)
          })
        }
    }


  //Update database with the new phone number
    const updateDB = () => {
        axios
        .post('/clients/updateClientInfo', {
            _id: clientObject._id,
            phone:
            {
                areaCode: fullPhoneNumber.slice(1, 4),
                phoneNumber: fullPhoneNumber.slice(4)
            }
        },
        config
        )
        .then((res) => {
            if (res.data.type === "success") {
                Alert.alert(
                    'Update',
                    'Your new phone number has been successfully updated.',
                    [
                        {text: 'OK', onPress: () => handleArrowButton()},
                      ],
                      { cancelable: false }
                )

            }
        })
        .catch((err) => console.log(err));
    }


    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
              <Text style={styles.justYouHeader}>Just You</Text>
            </View>
            <ArrowBackButton
                onPress={handleArrowButton}
            />
            <View style={styles.phoneContainer}>
              <Text style={styles.inputTitle}>Change phone number</Text>
              <View style={styles.phoneTextInput}>
              <TextInput
                      style={styles.areaCodeInput}
                      textAlign='center'
                      placeholder='Area Code'
                      keyboardType='numeric'
                      value = {areaCodeInput}
                      onChangeText={value => handleOnChangeAreaCode(value)}>
              </TextInput>
                <TextInput
                    style={styles.phoneNumberInput}
                    textAlign='center'
                    keyboardType='numeric'
                    placeholder='Phone Number'
                    value = {phoneNumberInput}
                    onChangeText={value => handleOnChangePhoneNumber(value)}
                />
              </View>
              {isPhoneError ?
                <Text style={styles.phoneErrorMessage}>{phoneErrorMessage}</Text>
              :null}
              <View style={styles.verifyExplenationContainer}>
                <Text style={styles.verifyExplenationText}>We'll send you a text with a 4-digit code to verify your new phone number.</Text>
              </View>
            </View>
            <View>
                <TouchableOpacity
                    style={styles.verifyButton}
                    onPress={() => handleVerify()}
                >
                    <Text style={styles.verifyButtonText}>Send code to verify phone</Text>
                </TouchableOpacity>
            </View>

            <View  display={isCodeSent} style={styles.greyBorder}/>

            <View display={isCodeSent}>
                <Text style={styles.verificationText}>
                    We just sent you an SMS with a code.
                </Text>

                <Text style={styles.verificationText}>
                    Please note that SMS delivery can take a minute or more.
                </Text>


                <Text style={styles.verificationTitle}>
                    Enter your verification code
                </Text>
            </View>

            <View display={isCodeSent} style={styles.codeTextInput}>
              <TextInput
                  style={{fontSize: 33}}
                  textAlign='center'
                  onChangeText={text => handleOnChangeCode(text)}
              />
            </View>


            <View display={isCodeSent} style={{flexDirection:'row'}}>
                <View>
                <Text style={styles.resendCodeText}>{"Didn't receive an SMS?"}</Text>
                </View>
                <View>
                    <TouchableOpacity
                    onPress={() => sendVerificationCode('+'+areaCodeInput+phoneNumberInput)}
                    >
                    <Text style={styles.resendButton}>{"resend"}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View display={isCodeSent} style={styles.nextButtonContainer}>
              {isNextError ?
              <Text style={styles.nextErrorMessage}>{nextErrorMessage}</Text>
              :null}
              <AppButton
                title="Verify phone number"
                onPress={handleSubmit}
              />
            </View>
        </SafeAreaView>
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
  partnerHeader: {
    color: 'deepskyblue',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height * .022
  },
  phoneContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: Dimensions.get('window').height * .19,
    marginTop: Dimensions.get('window').height * .044
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
    fontSize: Dimensions.get('window').height * .025
  },
  areaCodeInput: {
      borderRadius: 20,
      marginRight: Dimensions.get('window').width * .0241,
      borderColor: 'deepskyblue',
      borderWidth: 3,
      height: Dimensions.get('window').height * .06,
      width: Dimensions.get('window').width * .3,
      fontSize: Dimensions.get('window').height * .025
  },
  phoneNumberInput: {
      borderRadius: 20,
      borderColor: 'deepskyblue',
      borderWidth: 3,
      height: Dimensions.get('window').height * .06,
      width: Dimensions.get('window').width * .6,
      fontSize: Dimensions.get('window').height * .025
  },
  phoneErrorMessage: {
      color: 'red',
      marginLeft: Dimensions.get('window').width * .0483
  },
  verifyExplenationContainer: {
      width: Dimensions.get('window').width * .8,
      alignSelf: 'center'
  },
  verifyExplenationText: {
      color: 'grey',
      textAlign:'center',
      fontSize: Dimensions.get('window').height * .0189,
  },
  verifyButton: {
      marginTop: Dimensions.get('window').height * .044,
      width: Dimensions.get('window').width * .9,
      height: Dimensions.get('window').height * .065,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: 'deepskyblue',
      borderRadius: 20
  },
  verifyButtonText: {
      fontSize: Dimensions.get('window').height * .0278,
      fontWeight: 'bold',
      color: 'white'
  },
  codeTextInput: {
      borderColor: 'deepskyblue',
      borderRadius: 20,
      borderWidth: 3,
      height: Dimensions.get('window').height * .07,
      width: Dimensions.get('window').width * .9,
      marginTop: Dimensions.get('window').height * .015,
      justifyContent: 'center',
      fontSize: Dimensions.get('window').height * .025,
      alignSelf: 'center'
  },
  sendAgainButton: {
    width: Dimensions.get('window').width * .3,
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
      marginLeft: Dimensions.get('window').width * .0483,
      marginBottom: Dimensions.get('window').height * .022
  },
  greyBorder: {
    marginTop: Dimensions.get('window').height * .04,
    marginBottom: Dimensions.get('window').height * .04,
    alignSelf: 'center',
    width: Dimensions.get('window').width * .85,
    borderTopWidth: 3,
    borderTopColor: 'lightgrey',
},
verificationText: {
    fontWeight: '500',
    color: 'grey',
    fontSize: Dimensions.get('window').height * .019,
    alignSelf: 'center',
    width: Dimensions.get('window').width * .8,
  },
  verificationTitle: {
    marginTop: Dimensions.get('window').height * .02,
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height * .022,
    alignSelf: 'center',
  },
  resendContainer: {
      flexDirection: 'row',
  },
  resendCodeText: {
    marginTop: Dimensions.get('window').height * .01,
    marginLeft: Dimensions.get('window').width * .0483,
    fontSize: Dimensions.get('window').height * .022,
    fontWeight: '500',
  },
  resendButton: {
    color: 'deepskyblue',
    marginTop: Dimensions.get('window').height * .01,
    marginLeft: Dimensions.get('window').width * .01,
    fontSize: Dimensions.get('window').height * .022,
    fontWeight: '600',
  }
});

export default ChangePhoneNumber;
