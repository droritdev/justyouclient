import React, {useContext, useState} from 'react';
import {StyleSheet, View, Text, TextInput, Button, Dimensions, SafeAreaView, Alert} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios'
import { Base64 } from 'js-base64';

import {PasswordContext} from '../../context/PasswordContext';

//Page to set the new client's password
const ResetPasswordClient = ({route, navigation}) => {
    const {dispatchPassword} = useContext(PasswordContext);
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [isPasswordsNotMatch, setIsPasswordsNotMatch] = useState(false)
    const [passwordErrorText, setPasswordErrorText] = useState("");
    const [input, setInput] = useState("");

    const config = {
      withCredentials: true,
      baseURL: 'https://justyou.iqdesk.info:443/',
      headers: {
        "Content-Type": "application/json",
      },
    };
    
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

    const saveNewPassword = () => {
      axios
      .get('/clients/phone/'+route.params.areaCode+route.params.phoneNumber, config)
      .then((doc) => {
        if (doc.data[0].phone.areaCode === route.params.areaCode && doc.data[0].phone.phoneNumber === route.params.phoneNumber) {
          // update clientinfo with new password
          let encodedPass = Base64.encode(input)
          dispatchPassword({
            type: 'SET_PASSWORD',
            password: encodedPass
          });
          setIsPasswordsNotMatch(false);
          setPasswordErrorText("");

          axios
          .post('/clients/updateClientInfo', {
              _id: doc.data[0]._id,
              password: encodedPass
          },
          config
          )
          .then((res) => {
              if (res.data.type === "success") {
                  Alert.alert('Password has been updated')
                  navigation.navigate('LogIn')
              }
          })
          .catch((err) => console.log(err));

        }
      })
      .catch((err) =>  {
        Alert.alert('This phone is not registered')
        console.log('error in saveNewPassword ', err)
      });
    }

    //Handle when next button is pressed
    const handleNext = () => {
      if(input.length > 0 && confirmedPassword.length > 0){
        if(confirmedPassword !== input){
          setPasswordErrorText("Passwords does not match")
          setIsPasswordsNotMatch(true);
        }
        else{
          saveNewPassword()
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
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
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
      marginTop: Dimensions.get('window').height * .022,
      fontSize: Dimensions.get('window').height * .033,
      fontWeight: 'bold'
    },
    clientText: {
      marginTop: Dimensions.get('window').height * .0055,
      color: 'deepskyblue',
      fontWeight: 'bold',
      fontSize: Dimensions.get('window').height * .022
    },
    createPasswordText: {
      marginTop: Dimensions.get('window').height * .088,
      fontSize: Dimensions.get('window').height * .038,
      fontWeight: 'bold'
    },
    passwordInput: {
      borderColor: 'deepskyblue',
      borderRadius: 10,
      borderWidth: 3,
      height: Dimensions.get('window').height * .088,
      width: Dimensions.get('window').width * .7,
      marginTop: Dimensions.get('window').height * .088,
      justifyContent: 'center'
    },
    confirmedPasswordInput: {
      borderColor: 'deepskyblue',
      borderRadius: 10,
      borderWidth: 3,
      height: Dimensions.get('window').height * .088,
      width: Dimensions.get('window').width * .7,
      marginTop: Dimensions.get('window').height * .07,
      justifyContent: 'center'
    },
    passwordsErrorText: {
        textAlign:'center',
        color: 'red',
        fontSize: Dimensions.get('window').height * .022
    },
    nextButtonContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginBottom: 50
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
  });

  export default ResetPasswordClient;