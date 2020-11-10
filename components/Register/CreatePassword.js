import React, {useContext, useState} from 'react';
import {StyleSheet, View, Text, TextInput, Button, Dimensions} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import {PasswordContext} from '../../context/PasswordContext';

//Here the user creates his password
const CreatePassword = ({navigation}) => {
    const {password, dispatchPassword} = useContext(PasswordContext);
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [isPasswordsNotMatch, setIsPasswordsNotMatch] = useState(false)
    const [passwordErrorText, setPasswordErrorText] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    
    //Sets the password object to the value in the text field
    const handleOnChangePassword = (text) => {
      setIsPasswordsNotMatch(false);
      setPasswordErrorText("");
      setPasswordInput(text);
    }
    //Sets the confirmmedPassword object to the value in the text field
    const handleOnChangeConfirmedPassword = (text) => {
      setIsPasswordsNotMatch(false);
      setPasswordErrorText("");
      setConfirmedPassword(text);
    }

    //Handle the next button press
    const handleNext = () => {
      if(passwordInput.length > 0 && confirmedPassword.length > 0){
        if(confirmedPassword !== passwordInput){
          setPasswordErrorText("Passwords does not match")
          setIsPasswordsNotMatch(true);
        }
        else if(passwordInput.length < 6){
          setPasswordErrorText("Valid password is at least 6 charecters")
          setIsPasswordsNotMatch(true);
        }
        else{
          dispatchPassword({
            type: 'SET_PASSWORD',
            password: passwordInput
          });
          setPasswordInput("");
          setConfirmedPassword("");
          setIsPasswordsNotMatch(false);
          setPasswordErrorText("");
          navigation.navigate('ProfileDetailsPage1')
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
        <View style={styles.passwordContainer}>
          <Text style={styles.createPasswordText}>CREATE PASSWORD</Text>
          <View style={styles.passwordInput}>
            <TextInput
              value={passwordInput}
              secureTextEntry={true}
              style={{fontSize: 20}}
              textAlign='center'
              placeholder='PASSWORD'
              onChangeText={text => handleOnChangePassword(text)}
            />
          </View>
          <View style={styles.confirmedPasswordInput}>
            <TextInput
              value={confirmedPassword}
              secureTextEntry={true}
              style={{fontSize: 20}}
              textAlign='center'
              placeholder='CONFIRM PASSWORD'
              onChangeText={
                text => handleOnChangeConfirmedPassword(text)}
            />
          </View>
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
      height: Dimensions.get('window').height,
      flexDirection: 'column',
      alignItems: 'center'
    },
    justYouHeader: {
      marginTop: 70,
      fontSize: 30,
      fontWeight: 'bold'
    },
    passwordContainer: {
      width: Dimensions.get('window').width,
      alignItems: 'center',
      marginTop: '30%'
    },
    createPasswordText: {
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

  export default CreatePassword;