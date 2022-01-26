import React, { useState } from 'react'
import {StyleSheet, View, Text, Image, TextInput, Dimensions, SafeAreaView, Keyboard, Alert} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ArrowBackButton from '../GlobalComponents/ArrowBackButton';
import { Base64 } from 'js-base64';
import axios from 'axios'

//Here the user verifies his user details before navigates to the reset password page
const ForgotPassword = ({navigation}) => {
    const [areaCodeInput, setAreaCodeInput] = useState("");
    const [phoneNumberInput, setPhoneNumberInput] = useState("");
    const [requestId, setRequestId] = useState()
    const [code, setCode] = useState("");
    const [emailInput, setEmailInput] = useState('')

    const config = {
      withCredentials: true,
      baseURL: 'https://justyou.iqdesk.info:443/',
      headers: {
        "Content-Type": "application/json",
      },
  };
  

    const handleOnChangeAreaCode = (value) => {
        if (value.length > 3) {
          value = value.slice(0, 3);
        }
        setAreaCodeInput(value);
    }
  
    const handleOnChangePhoneNumber = (value) => {
        if (value.length > 7) {
        value = value.slice(0, 7);
        }
        setPhoneNumberInput(value);
    }

    const handleVerify = () => {
        Keyboard.dismiss()
  
        let areaCodeTemp = Number(areaCodeInput);
        let phoneNumberTemp = Number(phoneNumberInput);
        
        var fullPhone = '97'+areaCodeInput+phoneNumberInput; // change 97 -> 1
        sendVerificationCode(fullPhone);
      }

      const sendVerificationCode = (number) => {
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
                console.log('success but res null ', res.data)
                alert("success but res null");
              }
            })
            .catch((error) => {
              console.log('catch error sendCode ', error)
              alert(error)
            })
      }

      const handleOnChangeCode = (value) => {
        setCode(value);
        if(value.length === 4){
          Keyboard.dismiss()
        }
      }

      const handleOnChangeEmail = (value) => {
        setEmailInput(value);
      }


    //Navigates back to the log in page
    const handleArrowButton = () => {
        navigation.navigate('LogIn');
    }

    const sendPasswordEmail = () => {
      //Alert.alert('in sendPasswordEmail ' + areaCodeInput + phoneNumberInput)
      axios
      .get('/clients/'+emailInput.toLowerCase(), config)
      .then((doc) => {
        //Alert.alert('in sendPasswordEmail then ' + doc.data[0].phone.areaCode)
        if (doc.data[0].email.toLowerCase() === emailInput.toLowerCase()) {
          // update clientinfo with new password
          //Alert.alert('in sendPasswordEmail if ' + doc.data[0].phone.areaCode)
          let decodedPass = Base64.decode(doc.data[0].password)
          axios
          .post('/send-email', {
              to: emailInput,
              from: 'info@justyou.info',
              subject: 'Password Information',
              text: 'Your JustYou password is ' + decodedPass,
          },
          config
          )
          .then((res) => {
              navigation.navigate('LogIn')
              if (res.data.status === 'success') {
              }
          })
          .catch((err) => {
              Alert.alert('Could not send email. Try again later.')
          })
        }
      })
      .catch((err) =>  {
        Alert.alert('This email is not registered')
        console.log('error in sendPasswordEmail ', err)
      });
    }

    //navigates to the reset passwrod page
    const handleNext = () => {
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
                // navigation.navigate('ResetPassword', {
                //   areaCode: areaCodeInput,
                //   phoneNumber: phoneNumberInput
                // });
                sendPasswordEmail()
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

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.upperContainer}>
                <ArrowBackButton
                    onPress={handleArrowButton}
                />
                <View style={styles.justYouHeader}>
                    <Text style={styles.justYouText}>Just You</Text>
                </View>
            </View>
            <Text style={styles.resetTitle}>Re-Set Your Password</Text>
            <View style={styles.sendVerifyContainer}>
                {/* <TextInput
                    style={styles.phoneEmailInput}
                    placeholder='Phone number or Email'
                /> */}
              {/*  <View style={styles.phoneTextInput}>
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
                <TouchableOpacity
                    style={styles.verifyButton}
                    onPress={() => handleVerify()}
                >
                    <Text style={styles.verifyButtonText}>Send Code</Text>
              </TouchableOpacity> */}
                <Text style={styles.verifyExplination}>Enter your email. Your password will be sent to your email.</Text>
            </View> 
            <View style={styles.codeContainer}>
                <TextInput
                    style={styles.codeInput}
                    placeholder="email"
                    value={emailInput}
                    onChangeText={text => handleOnChangeEmail(text)}
                />
            </View>
            <View style={styles.nextButtonContainer}>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={sendPasswordEmail}
                >
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: 'white',
        height: Dimensions.get('window').height
    },
    upperContainer: {
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        marginTop: Dimensions.get('window').height * .022

    },
    arrowImage: {
        marginLeft: Dimensions.get('window').width * .039
    },
    justYouHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width * .65
    },
    justYouText: {
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .0278
    },
    resetTitle: {
        alignSelf: 'center',
        marginTop: Dimensions.get('window').height * .033,
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .033
    },
    sendVerifyContainer: {
        marginTop: Dimensions.get('window').height * .066,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: Dimensions.get('window').height * .075,
    },
    phoneEmailInput: {
        borderWidth: 1,
        borderColor: 'deepskyblue',
        borderRadius: 10,
        width: Dimensions.get('window').width * .9,
        height: Dimensions.get('window').height * .065,
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .022
    },
    verifyButton: {
        width: Dimensions.get('window').width * .4,
        height: Dimensions.get('window').height * .05,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'deepskyblue',
        borderRadius: 10,
        paddingHorizontal: 10
      },
      verifyButtonText: {
        fontSize: Dimensions.get('window').height * .0278,
        fontWeight: 'bold',
        color: 'white'
      },
      verifyExplination: {
          fontSize: Dimensions.get('window').height * .02,
          fontWeight: '300',
          textAlign: 'center',
          width: Dimensions.get('window').width * .65,
      },
      codeContainer: {
        alignItems: 'center'
        //marginTop: Dimensions.get('window').height * .066
      },
      enterCodeText: {
        fontSize: Dimensions.get('window').height * .0278,
        fontWeight: '300'
      },
      codeInput: {
        borderWidth: 1,
        borderColor: 'deepskyblue',
        borderRadius: 10,
        width: Dimensions.get('window').width * .9,
        height: Dimensions.get('window').height * .065,
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .022
      },
      nextButtonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 100
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
          borderWidth: 1,
          height: Dimensions.get('window').height * .06,
          width: Dimensions.get('window').width * .3,
          fontSize: Dimensions.get('window').height * .025
      },
      phoneNumberInput: {
          borderRadius: 20,
          borderColor: 'deepskyblue',
          borderWidth: 1,
          height: Dimensions.get('window').height * .06,
          width: Dimensions.get('window').width * .6,
          fontSize: Dimensions.get('window').height * .025
      }


});

export default ForgotPassword;