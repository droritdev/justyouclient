import React, {useContext, useState} from 'react';
import {StyleSheet, View, Text, TextInput, Button, Dimensions, KeyboardAvoidingView, Platform, SafeAreaView} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import AppButton from '../GlobalComponents/AppButton';
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
          setPasswordErrorText("Valid password is at least 6 characters")
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
      <SafeAreaView style={styles.container}>
        <Text style={styles.justYouHeader}>Just You</Text>
        <View style={styles.passwordContainer}>
          <Text style={styles.createPasswordText}>Create Password</Text>
          <View style={styles.passwordInput}>
            <TextInput
              value={passwordInput}
              secureTextEntry={true}
              style={{fontSize: 20}}
              textAlign='center'
              placeholder='Password'
              onChangeText={text => handleOnChangePassword(text)}
            />
          </View>
          <View style={styles.confirmedPasswordInput}>
            <TextInput
              value={confirmedPassword}
              secureTextEntry={true}
              style={{fontSize: 20}}
              textAlign='center'
              placeholder='Confirm Password'
              onChangeText={
                text => handleOnChangeConfirmedPassword(text)}
            />
          </View>
        </View>
        {isPasswordsNotMatch ?
        <Text style={styles.passwordsErrorText}>{passwordErrorText}</Text>
        :null}
        <View style={styles.nextButtonContainer}>
          <AppButton
            title="Next"
            onPress={handleNext}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      height: Dimensions.get('window').height,
      flexDirection: 'column',
      backgroundColor: 'white',
      alignItems: 'center'
    },
    justYouHeader: {
      marginTop: Dimensions.get('window').height * 0.022,
      fontSize: Dimensions.get('window').height * 0.033,
      fontWeight: 'bold',
      color: 'deepskyblue'
    },
    passwordContainer: {
      width: Dimensions.get('window').width,
      alignItems: 'center',
      marginTop: Dimensions.get('window').height * .125
    },
    createPasswordText: {
      fontSize: Dimensions.get('window').height * 0.039,
      fontWeight: 'bold'
    },
    passwordInput: {
      borderColor: 'deepskyblue',
      borderRadius: 17,
      borderWidth: 2,
      height: Dimensions.get('window').height * 0.08,
      width: Dimensions.get('window').width * .7,
      marginTop: Dimensions.get('window').height * 0.088,
      justifyContent: 'center'
    },
    confirmedPasswordInput: {
      borderColor: 'deepskyblue',
      borderRadius: 17,
      borderWidth: 2,
      height: Dimensions.get('window').height * 0.08,
      width: Dimensions.get('window').width * .7,
      marginTop: Dimensions.get('window').height * 0.039,
      justifyContent: 'center'
    },
    passwordsErrorText: {
        textAlign:'center',
        color: 'red',
        fontSize: Dimensions.get('window').height * 0.022
    },
    nextButtonContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center'
    }
  });

  export default CreatePassword;