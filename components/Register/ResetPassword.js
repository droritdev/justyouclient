import React, {useContext, useState} from 'react';
import {StyleSheet, View, Text, TextInput, Button, Dimensions} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import {PasswordContext} from '../../context/PasswordContext';

//Page to set the new client's password
const ResetPasswordClient = ({navigation}) => {
    const {dispatchPassword} = useContext(PasswordContext);
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [isPasswordsNotMatch, setIsPasswordsNotMatch] = useState(false)
    const [passwordErrorText, setPasswordErrorText] = useState("");
    const [input, setInput] = useState("");
    
    //Handle the password input when changed
    const handleOnPasswordChangeText = (text) => {
      setIsPasswordsNotMatch(false);
      setPasswordErrorText("");
      setInput(text);
    }

    //Handle the confirmed password input when changed
    const handleOnConfirmedPasswordChangeText = (text) => {
      setIsPasswordsNotMatch(false);
      setPasswordErrorText("");
      setConfirmedPassword(text);
    }

    //Handle when next button is pressed
    const handleNext = () => {
      if(input.length > 0 && confirmedPassword.length > 0){
        if(confirmedPassword !== input){
          setPasswordErrorText("Passwords does not match")
          setIsPasswordsNotMatch(true);
        }
        else{
          dispatchPassword({
            type: 'SET_PASSWORD',
            password: input
          });
          setIsPasswordsNotMatch(false);
          setPasswordErrorText("");
          navigation.navigate('LogIn')
        }
      }
      else{
        setPasswordErrorText("Both fields required")
        setIsPasswordsNotMatch(true);
      }
    }
  
    return(
      <View style={styles.container}>
        <Text style={styles.justYouHeader}>Just You</Text>
        <Text style={styles.createPasswordText}>CREATE PASSWORD</Text>
        <View style={styles.passwordInput}>
          <TextInput
            secureTextEntry={true}
            style={{fontSize: 20}}
            textAlign='center'
            placeholder='PASSWORD'
            onChangeText={text => handleOnPasswordChangeText(text)}
          />
        </View>
        <View style={styles.confirmedPasswordInput}>
          <TextInput
            secureTextEntry={true}
            style={{fontSize: 20}}
            textAlign='center'
            placeholder='CONFIRM PASSWORD'
            onChangeText={
              text => handleOnConfirmedPasswordChangeText(text)}
          />
        </View>
        {isPasswordsNotMatch ?
        <Text style={styles.passwordsErrorText}>{passwordErrorText}</Text>
        :null}
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      height: '100%',
      flexDirection: 'column',
      alignItems: 'center'
    },
    justYouHeader: {
      marginTop: 50,
      fontSize: 30,
      fontWeight: 'bold'
    },
    clientText: {
      marginTop: 5,
      color: 'deepskyblue',
      fontWeight: 'bold',
      fontSize: 20
    },
    createPasswordText: {
      marginTop: 80,
      fontSize: 35,
      fontWeight: 'bold'
    },
    passwordInput: {
      borderColor: 'lightgrey',
      borderRadius: 10,
      borderWidth: 3,
      height: 80,
      width: '70%',
      marginTop: 80,
      justifyContent: 'center'
    },
    confirmedPasswordInput: {
      borderColor: 'lightgrey',
      borderRadius: 10,
      borderWidth: 3,
      height: 80,
      width: '70%',
      marginTop: '15%',
      justifyContent: 'center'
    },
    passwordsErrorText: {
        textAlign:'center',
        color: 'red',
        fontSize: 20
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

  export default ResetPasswordClient;