import React, {useContext, useState, useEffect} from 'react';
import { Button, Text, View, SafeAreaView, Image, StyleSheet, Dimensions, ImageBackground, TextInput} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import FlipToggle from 'react-native-flip-toggle-button';
import axios from 'axios';

//The question and answers page
const ChangePhoneNumber = ({navigation}) => {

    const [areaCodeInput, setAreaCodeInput] = useState("");
    const [phoneNumberInput, setPhoneNumberInput] = useState("");
    const [fullPhoneNumber,setFullPhoneNumber] = useState("");
    const [codeInput, setCodeInput] = useState("");
    const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
    const [codeErrorMessage, setCodeErrorMessage] = useState("");
    const [doneErrorMessage, setDoneErrorMessage] = useState("");
    const [isCodeError, setIsCodeError] = useState(false);
    const [isPhoneError, setIsPhoneError] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isDoneError, setIsDoneError] = useState(false);

    //Navigates back to the Settings page
    const handleOnArrowPress = () => {
        navigation.navigate('Settings');
    }

    const sendVerifyCode = () => {
        setIsPhoneError(false);
        setIsCodeError(false);
        setIsDoneError(false);
        setIsCodeSent(true);
        alert("Code Sent");
        // axios
        //   .post('/send-verification-code', {
        //     to: fullPhoneNumber,
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

    const verifyCode = () => {
        navigation.navigate('Settings');
        // axios
        //   .post('/verify-code', {
        //     to: fullPhoneNumber,
        //     code: codeInput
        //   },
        //   config
        // )
        // .then((res) => {
        //   if(res !== null) {
        //     if(res.data.status === 'approved'){
        //       setIsErrorCodeMessage(false);
        //       setCodeErrorMessage("");
        //       navigation.navigate('Settings');
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

    const handleOnChangeAreaCode = (text) => {
        setIsPhoneError(false);
        setIsCodeError(false);
        setIsDoneError(false);
        setAreaCodeInput(text);
    }

    const handleOnChangePhoneNumber = (text) => {
        setIsPhoneError(false);
        setIsCodeError(false);
        setIsDoneError(false);
        setPhoneNumberInput(text);
    }

    const handleOnVerifyPressed = () => {
        if(areaCodeInput === "" || phoneNumberInput === ""){
            setIsPhoneError(true);
            setPhoneErrorMessage("Fill the fields");
        }
        else if(!(Number(areaCodeInput)) || !(Number(phoneNumberInput))){
            setIsPhoneError(true);
            setPhoneErrorMessage("Enter digits only");
        }
        else{
            setFullPhoneNumber("+972"+(areaCodeInput.concat(phoneNumberInput)));
            sendVerifyCode();
        }
    }

    const handleOnCodeInputChange = (value) => {
        setIsPhoneError(false);
        setIsCodeError(false);
        setIsDoneError(false);
        setCodeInput(value);
    }

    const handleOnDonePressed = () => {
        setIsPhoneError(false);
        setIsCodeError(false);
        if(!isCodeSent){
            setIsDoneError(true);
            setDoneErrorMessage("First verify your phone number");
        }
        else if(codeInput === ""){
            setIsDoneError(true);
            setDoneErrorMessage("Enter your code");
        }
        else if(!(Number(codeInput))){
            setIsDoneError(true);
            setDoneErrorMessage("Enter digits only");
        }
        else if(codeInput.length != 5){
            setIsDoneError(true);
            setDoneErrorMessage("Code is 5 digits");
        }
        else{
            verifyCode();
        }
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.titlesContainer}>
                <Text style={styles.justYouHeader}>Just You</Text>
            </View>
            <TouchableOpacity
                    style={styles.arrowBackButton} 
                    onPress={() => handleOnArrowPress()}
                >
                <Image
                    source={require('../../../images/blackArrow.png')}
                />
            </TouchableOpacity>
            <Text style={styles.changePhoneTitle}>Change phone number</Text>
            <View style={styles.phoneAndError}>
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
            <View style={styles.verifyButtonContainer}>
                <TouchableOpacity
                    style={styles.verifyButton}
                    onPress={() => handleOnVerifyPressed()}
                >
                    <Text style={styles.verifyButtonText}>Verify</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.codelInput}>
                <TextInput
                    style={{fontSize: 25}}
                    textAlign='center'
                    placeholder='Enter your code'
                    onChangeText={text => handleOnCodeInputChange(text)}
                    value={codeInput}
                />
            </View>
            <View>
                <TouchableOpacity 
                style={styles.sendAgainButton}
                onPress={() => handleOnVerifyPressed()}
                >
                    <Text style={styles.resendCodeText}>No SMS? Tap to resend</Text> 
                </TouchableOpacity>
            </View>
            <View style={styles.doneButtonContainer}>
                {isDoneError ? 
                    <Text style={styles.doneErrorMessage}>{doneErrorMessage}</Text>
                : null}
                <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => handleOnDonePressed()}
                >
                    <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}   

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    titlesContainer: {
        alignItems: 'center',
    },
    justYouHeader: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    partnerText: {
        color: 'deepskyblue',
        fontWeight: 'bold',
        fontSize: 20
    },
    arrowBackButton: {
        alignItems: 'flex-start',
        marginLeft: 15
    },
    changePhoneTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: Dimensions.get('window').height * .05,
    },
    phoneAndError: {
        height: Dimensions.get('window').height * .09,
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
        marginLeft: 25
    },
    verifyExplenationContainer: {
        width: Dimensions.get('window').width * .8,
        alignSelf: 'center',
        marginTop: 10
    },
    verifyExplenationText: {
        textAlign:'center',
        fontSize: 17,
        color: 'grey'
    },
    verifyButtonContainer: {
        marginTop: 30
    },
    verifyButton: {
        width: Dimensions.get('window').width * .9,
        height: Dimensions.get('window').height * .065,
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
    codelInput: {
        borderColor: 'deepskyblue',
        borderRadius: 20,
        borderWidth: 3,
        height: Dimensions.get('window').height * .06,
        marginRight: 20,
        marginTop: 80,
        justifyContent: 'center',
        marginLeft: 20
    },
    sendAgainButton: {
        marginTop: 30,
        width: Dimensions.get('window').width * .55,
        height: Dimensions.get('window').height * .04,
        backgroundColor: 'lightgrey',
        borderRadius: 5,
        justifyContent: 'center',
        marginLeft: 20
    },
    resendCodeText: {
        color: 'deepskyblue', 
        fontSize: 20,
        fontWeight: '600',
        alignSelf: 'center'
    },
    doneButtonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 100
    },
    doneErrorMessage: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10
    },
    doneButton: {
        width: Dimensions.get('window').width * .9,
        height: Dimensions.get('window').height * .065,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'deepskyblue',
        borderRadius: 20
    },
    doneButtonText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
});

export default ChangePhoneNumber;