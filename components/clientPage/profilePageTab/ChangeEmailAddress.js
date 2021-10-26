import React, {useContext, useState, useEffect} from 'react';
import {Alert, Button, Text, View, SafeAreaView, Image, StyleSheet, Dimensions, ImageBackground, TextInput} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';
import AppButton from '../../GlobalComponents/AppButton';
// import {EmailContext} from '../../../../context/EmailContext';
// import {PasswordContext} from '../../../../context/trainerContextes/PasswordContext';
// import {IdContext} from '../../../../context/trainerContextes/IdContext';
import auth from '@react-native-firebase/auth';
import {ClientContext} from '../../../context/ClientContext';

const ChangeEmailAddress = ({navigation}) => {
    const [emailAddressInput, setEmailAddressInput] = useState("");
    const [codeInput, setCodeInput] = useState("");

    const [isCodeSent, setIsCodeSent] = useState('none');
    const [isEmailError, setIsEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [isCodeError, setIsCodeError] = useState(false);
    const [codeErrorMessage, setCodeErrorMessage] = useState("");
    //Client information
    const {clientObject} = useContext(ClientContext);

    const config = {
        withCredentials: true,
        baseURL: 'https://justyou.iqdesk.info:443/',
        headers: {
          "Content-Type": "application/json",
        },
    };

    const mailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const sendVerifyEmail = () => {
          axios
            .post('/send-verification-code', {
              to: emailAddressInput.toLowerCase(),
              channel: "email"
            },
            config
          )
          .then((res) => {
            if(res !== null) {
              if(res.data.status === 'pending'){
                setIsCodeSent('flex');
                Alert.alert(
                    'Code sent',
                    'Please check your email for the verification code.',
                    [
                        {text: 'OK'},
                      ],
                      { cancelable: false }
                    )
              }
              else {
                Alert.alert(
                    'System failure',
                    "Couldn't send code to this email address. Please try again.",
                    [
                        {text: 'OK'},
                      ],
                      { cancelable: false }
                    )
              }
            }
            else {
                Alert.alert(
                    'System failure',
                    "Couldn't send code to this email address. Please try again.",
                    [
                        {text: 'OK'},
                      ],
                      { cancelable: false }
                    )
            }
          }
          )
          .catch((error) => {
            alert(error)
          })
    }

    //Navigates back to the profile page
    const handleOnArrowPress = () => {
        navigation.navigate('Settings');
    }

    const handleVerify = () => {
        setIsEmailError(false);
        if(emailAddressInput === ""){
            setIsEmailError(true);
            setEmailErrorMessage("Enter an email address");
        }
        else if(!(mailformat.test(emailAddressInput))){
            setIsEmailError(true);
            setEmailErrorMessage("Enter a valid email address");
        }

        else{
            checkEmailIsUsed();
        }
    }

    const HandleOnEmailInputChange = (value) => {
        setIsEmailError(false);
        setEmailAddressInput(value);
    }

    const handleOnCodeInputChange = (value) => {
        setIsEmailError(false);
        setIsCodeError(false);
        setCodeInput(value);
    }

    const handleSubmit = () => {
        if(isCodeSent === 'flex') {
            if(codeInput === ""){
                setIsCodeError(true);
                setCodeErrorMessage("Please enter the verifcation code");
            }
            else if(!(Number(codeInput))){
                setIsCodeError(true);
                setCodeErrorMessage("Enter digits only");
            }
            else if(codeInput.length !== 5){
                setIsCodeError(true);
                setCodeErrorMessage("Code is 5 digits");
            }
            else{
                // navigation.navigate('TrainerSettings');
                axios
                .post('/verify-code', {
                  to: emailAddressInput.toLowerCase(),
                  code: codeInput
                },
                config
                )
                .then((res) => {
                    if(res !== null) {
                    if(res.data.status === 'approved'){
                        updateDB();
                    }
                    else{
                        setIsCodeError(true);
                        setCodeErrorMessage("Incorrect code, please try again.")
                    }
                    }
                    else{
                        setIsCodeError(true);
                        setCodeErrorMessage("Incorrect code, please try again.")
                    }
                }
                )
                .catch((error) => {
                    alert(error)
                })
            }
        }
        else{
            setIsEmailError(true);
            setEmailErrorMessage("Get code first");
        }
    }


    //Send GET request to mongodb using axios, to check if email is already used
    const checkEmailIsUsed = () => {
        axios
        .get('/clients/'+emailAddressInput.toLowerCase(), config)
        .then((doc) => {
            if(doc) {
                if(doc.data[0].email!=null) {
                    setEmailErrorMessage("Email address is already used");
                    setIsEmailError(true);
                }
            }
        })
        .catch((err) =>  {
            setIsEmailError(false);
            sendVerifyEmail();
        });
    }



    //Update database with the new email adddress
    const updateDB = () => {
        axios
        .post('/clients/updateClientInfo', {
            _id: clientObject._id,
            email: emailAddressInput.toLowerCase()
        },
        config
        )
        .then((res) => {
            if (res.data.type === "success") {
                updateFirebaseEmail();
            }
        })
        .catch((err) => console.log(err));

    }


    //Update the firebase email of the trainer
    const updateFirebaseEmail = () => {
        let user = auth().currentUser;

        let authCred = auth.EmailAuthProvider.credential(
            user.email, clientObject.password);


        user.reauthenticateWithCredential(authCred).then(() => {
            user.updateEmail(emailAddressInput.toLowerCase()).then(() => {
                // Update successful.

                Alert.alert(
                    'Update',
                    'Your new email address has been successfully updated.',
                    [
                        {text: 'OK', onPress: () => handleOnArrowPress()},
                    ],
                    { cancelable: false }
                )
            }).catch((error) => {
                // An error happened.
                Alert.alert(
                    'System failure',
                    "Couldn't update your new email address. Please try again.",
                    [
                        {text: 'OK'},
                      ],
                      { cancelable: false }
                    )
            });
        }).catch((error) => {
            // An error happened.
            Alert.alert(
                'System failure',
                "Couldn't update your new email address. Please try again.",
                [
                    {text: 'OK'},
                  ],
                  { cancelable: false }
                )
        });


    }


    return(
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.titlesContainer}>
                <Text style={styles.justYouHeader}>Just You</Text>
                <Text style={styles.partnerText}>Partner</Text>
            </View>
            <ArrowBackButton
                onPress={handleOnArrowPress}
            />
            <Text style={styles.changeEmailTitle}>Change email address</Text>
            <View style={styles.emailAndErrorContainer}>
                <View style={styles.emailInput}>
                    <TextInput
                        style={{fontSize: 25}}
                        textAlign='center'
                        placeholder='youremail@adress.com'
                        onChangeText={text => HandleOnEmailInputChange(text)}
                    />
                </View>
                {isEmailError ?
                    <Text style={styles.emailErrorMessage}>{emailErrorMessage}</Text>
                : null}
            </View>
            <View style={styles.verifyExplenationContainer}>
                <Text style={styles.verifyExplenationText}>We'll send you an email with a 5-digit code to verify your new email address.</Text>
              </View>
            <View style={styles.getCodeButtonContainer}>
                <TouchableOpacity
                style={styles.getCodeButton}
                onPress={() => handleVerify()}
                >
                    <Text style={styles.getcodeButtonText}>Verify</Text>
                </TouchableOpacity>
            </View>

            <View  display={isCodeSent} style={styles.greyBorder}/>

            <View display={isCodeSent}>
                <Text style={styles.verificationText}>
                    We just sent you an email with a code.
                </Text>

                <Text style={styles.verificationText}>
                    Please note that email delivery can take a minute or more.
                </Text>


                <Text style={styles.verificationTitle}>
                    Enter your verification code
                </Text>
            </View>

                <View display={isCodeSent} style={styles.codeAndErrorContainer}>
                    <View style={styles.codelInput}>
                        <TextInput
                            style={{fontSize: 25}}
                            textAlign='center'
                            placeholder='00000'
                            onChangeText={text => handleOnCodeInputChange(text)}
                        />
                    </View>
                </View>

                <View display={isCodeSent} style={{flexDirection:'row'}}>
                    <View>
                    <Text style={styles.resendCodeText}>{"Didn't recive an email?"}</Text>
                    </View>
                    <View>
                        <TouchableOpacity
                        onPress={() => sendVerifyEmail()}
                        >
                        <Text style={styles.resendButton}>{"resend"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {isCodeError ?
                    <Text style={styles.codeErrorMessage}>{codeErrorMessage}</Text>
                : null}

            <View display={isCodeSent} style={styles.submitButtonContainer}>
                <AppButton
                    title="Submit"
                    onPress={handleSubmit}
                />
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'white',
        height: Dimensions.get('window').height,
        flexDirection: 'column'
    },
    titlesContainer: {
        alignItems: 'center',
    },
    justYouHeader: {
        fontSize: Dimensions.get('window').height * .033,
        fontWeight: 'bold'
    },
    partnerText: {
        color: 'deepskyblue',
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .022
    },
    arrowBackButton: {
        alignItems: 'flex-start',
        marginLeft: Dimensions.get('window').width * .047
    },
    changeEmailTitle: {
        fontSize: Dimensions.get('window').height * .0278,
        fontWeight: 'bold',
        marginLeft: Dimensions.get('window').width * .0483,
        marginTop: Dimensions.get('window').height * .015,
    },
    emailAndErrorContainer: {
        height: Dimensions.get('window').height * .14
    },
    emailInput: {
      borderColor: 'deepskyblue',
      borderRadius: 20,
      borderWidth: 3,
      height: Dimensions.get('window').height * .07,
      marginRight: Dimensions.get('window').width * .0483,
      marginTop: Dimensions.get('window').height * .033,
      justifyContent: 'center',
      marginLeft: Dimensions.get('window').width * .0483,
    },
    emailErrorMessage: {
        color: 'red',
        textAlign: 'center',
        marginTop: Dimensions.get('window').height * .0033
    },
    codeExplination: {
        color: 'grey',
        fontSize: Dimensions.get('window').height * .017,
        width: Dimensions.get('window').width * .6,
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: Dimensions.get('window').height * .011
    },
    getCodeButtonContainer: {
        marginTop: Dimensions.get('window').height * .044
    },
    getCodeButton: {
        width: Dimensions.get('window').width * .9,
        height: Dimensions.get('window').height * .065,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'deepskyblue',
        borderRadius: 20
    },
    getcodeButtonText: {
        fontSize: Dimensions.get('window').height * .0278,
        fontWeight: 'bold',
        color: 'white'
    },
    codeAndErrorContainer: {
        height: Dimensions.get('window').height * .1
    },
    codelInput: {
        borderColor: 'deepskyblue',
        borderRadius: 20,
        borderWidth: 3,
        height: Dimensions.get('window').height * .07,
        marginRight: Dimensions.get('window').width * .0483,
        marginTop: Dimensions.get('window').height * .03,
        justifyContent: 'center',
        marginLeft: Dimensions.get('window').width * .0483
    },
    codeErrorMessage: {
        color: 'red',
        textAlign: 'center',
        marginTop: Dimensions.get('window').height * .030
    },
    codeExplination2: {
        color: 'grey',
        fontSize: Dimensions.get('window').height * .017,
        width: Dimensions.get('window').width * .7,
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: Dimensions.get('window').height * .011
    },
    approveCodeButtonContainer: {
        marginTop: Dimensions.get('window').height * .010,
    },
    approveCodeButton: {
        width: Dimensions.get('window').width * .9,
        height: Dimensions.get('window').height * .065,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'deepskyblue',
        borderRadius: 20
    },
    approveButtonText: {
        fontSize: Dimensions.get('window').height * .0278,
        fontWeight: 'bold',
        color: 'white'
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
      greyBorder: {
        marginTop: Dimensions.get('window').height * .04,
        marginBottom: Dimensions.get('window').height * .04,
        alignSelf: 'center',
        width: Dimensions.get('window').width * .85,
        borderTopWidth: 3,
        borderTopColor: 'lightgrey',
    },
    verifyExplenationContainer: {
        width: Dimensions.get('window').width * .8,
        alignSelf: 'center'
    },
    verifyExplenationText: {
        fontWeight: '500',
        color: 'grey',
        fontSize: Dimensions.get('window').height * .019,
        textAlign:'center',
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
      },
      submitButtonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
      }
});

export default ChangeEmailAddress;
