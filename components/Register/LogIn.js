import React, {useEffect, useContext, useState} from 'react';
import {StyleSheet, View, Text, Dimensions, Image, SafeAreaView, Button, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import ArrowBackButton from '../GlobalComponents/ArrowBackButton';
import axios from 'axios';
import { Base64 } from 'js-base64';


import auth from '@react-native-firebase/auth';
// import { GoogleSignin } from '@react-native-community/google-signin';


import {EmailContext} from '../../context/EmailContext';
import {PasswordContext} from '../../context/PasswordContext';

//The log in page for exsisting users
const LogInClient = ({navigation}) => {
    const {emailAddress, dispatchEmail} = useContext(EmailContext);
    const {password, dispatchPassword} = useContext(PasswordContext);

    const [isErrorMessage, setIsErrorMessage] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [emailAddressInput, setEmailAddressInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    let encodedPass = "";
    const [isEmailValid, setIsEmailValid] = useState(false);

    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();


    //Navigates back to the SignUpClient page
    const handleArrowButton = () => {
        navigation.navigate('SignUp');
    }


    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    const config = {
        withCredentials: true,
        baseURL: 'https://justyou.iqdesk.info:443/',
        headers: {
          "Content-Type": "application/json",
        },
      };


    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
      }, []);

      if (initializing) return null;

      const checkEmailIsUsed = () => {
        axios
        .get('/clients/'+emailAddressInput.toLowerCase(),config)
        .then((doc) => {
          if(doc) {
            console.log("doc.data" , doc.data);
            if(doc.data[0].email!=null){
                setErrorMessage("The account dosen't exist");
                //TODO: for later use
                //setErrorMessage("Your email and password does not match");
                setIsErrorMessage(true);
            }
          }
        })
        .catch((err) => {
            setErrorMessage("The account dosen't exist");
            setIsErrorMessage(true);

        })
      }

    //Auth user with Firebase after validation and login button click
    //After auth is complete, navigate to welcome page
    const authUser = () => {
        auth()
        .signInWithEmailAndPassword(emailAddressInput, encodedPass)
        .then(() => {
            // dispatchEmail({
            //     type: 'SET_EMAIL_ADDRESS',
            //     emailAddress: emailAddressInput
            //   });
            //   dispatchPassword({
            //     type: 'SET_PASSWORD',
            //     password: passwordInput
            //   });
            navigation.navigate('ClientContainer');
        })
        .catch(error => {
            checkEmailIsUsed();
            // setErrorMessage("The account dosen't exist");
            // setIsErrorMessage(true);


            // Your email and password does not match
        });
    }


    //Handle when user enters his email address
    const handleOnChangePhoneEmail = (text) => {
        setEmailAddressInput(text);
        setIsErrorMessage(false);
        let mailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(mailformat.test(text)){
            setIsEmailValid(true);
        } else {
            setIsEmailValid(false);
        }
    }

    //Handle when user enters his password
    const handleOnChangePassword = (text) => {
        setPasswordInput(text);
        setIsErrorMessage(false);
    }


    //Handle when user presses the log in button to try and log in to his user
    const handleLogInButton = () => {
            encodedPass = Base64.encode(passwordInput);
          dispatchPassword({
            type: 'SET_PASSWORD',
            password: encodedPass
          });
        if(emailAddressInput === "" && encodedPass === "") {
            setErrorMessage("Both fields are required");
            setIsErrorMessage(true);
        }
        else if(emailAddressInput === "") {
            setErrorMessage("Email address is required");
            setIsErrorMessage(true);
        }

        else if(encodedPass === "") {
                setErrorMessage("Password is required");
                setIsErrorMessage(true);
        }
        else if (isEmailValid && encodedPass !== "") {
            authUser();
        }
        else if (!isEmailValid) {
            setErrorMessage("Email is not valid");
            setIsErrorMessage(true);
        }
        else {
            setIsErrorMessage(true);
        }
    }

    // GoogleSignin.configure({
    //     webClientId: '875902311914-82jqalpu2knc12hi8idkl11ob5jpg4oa.apps.googleusercontent.com',
    //   });

    // function GoogleSignIn() {
    //     return (
    //       <Button
    //         title="Google Sign-In"
    //         onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
    //       />
    //     );
    //   }

    //   async function onGoogleButtonPress() {
    //     // Get the users ID token
    //     const { idToken } = await GoogleSignin.signIn();

    //     // Create a Google credential with the token
    //     const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    //     // Sign-in the user with the credential
    //     return auth().signInWithCredential(googleCredential);
    //   }

    //Navigates back to the SignUp page
    const handleSignUpButton = () => {
        navigation.navigate('SignUp');
    }

    //Navigates to the ForgotPassword page when the user dont remember his password
    const handleForgotPasswordButton = () => {
        navigation.navigate('ForgotPassword');
    }

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={handleArrowButton}
            >
                <ArrowBackButton
                     onPress={handleArrowButton}
                />
            </TouchableOpacity>
            <View style={styles.headerContainer}>
                <Text style={styles.justYouTitle}>Just You</Text>
            </View>
            <View style={styles.inputsContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Email address'
                    placeholderTextColor='grey'
                    onChangeText={(value) => handleOnChangePhoneEmail(value)}
                    value={emailAddressInput}
                />
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    placeholder='Password'
                    placeholderTextColor='grey'
                    onChangeText={(value) => handleOnChangePassword(value)}
                    value={passwordInput}
                />
            </View>
            {!isErrorMessage ? null:
              <Text style={styles.errorText}>{errorMessage}</Text>}
            <TouchableOpacity
                onPress={handleForgotPasswordButton}
            >
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
            <View style={styles.logInButtonContainer}>
                <TouchableOpacity
                    style={styles.logInButton}
                    onPress={handleLogInButton}
                >
                    <Text style={styles.logInButtonText}>Log In</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.footerContainer}>
                <View style={styles.alreadyHaveAccountContainer}>
                    <Text style={styles.alreadyHaveAnAccountText}>Don't have an account? </Text>
                        <TouchableOpacity
                        onPress={handleSignUpButton}
                        >
                        <Text style={styles.signInText}>Sign Up</Text>
                        </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        height: Dimensions.get('window').height,
        backgroundColor: 'white'
    },
    arrowImage: {
        marginTop: Dimensions.get('window').height * .022,
        marginLeft: Dimensions.get('window').width * .0483
    },
    headerContainer: {
        alignSelf: 'center',
        alignItems: 'center'
    },
    justYouTitle: {
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .05,
    },
    partnerText: {
        color: 'deepskyblue',
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .033
    },
    inputsContainer: {
        marginTop: Dimensions.get('window').height * .055,
        flexDirection: 'column',
    },
    input: {
        borderWidth: 1,
        borderRadius: 17,
        borderColor: 'deepskyblue',
        width: Dimensions.get('window').width * .9,
        height: Dimensions.get('window').height * .075,
        alignSelf: 'center',
        fontSize: Dimensions.get('window').height * .022,
        textAlign: 'center',
        marginTop: Dimensions.get('window').height * .033
    },
    errorText: {
        marginTop: Dimensions.get('window').height * .010,
        textAlign:'center',
        color: 'red',
        fontSize: Dimensions.get('window').height * .022
    },
    forgotPassword: {
        alignSelf: 'center',
        color: 'deepskyblue',
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .018,
        marginTop: Dimensions.get('window').height * .033
    },
    logInButtonContainer: {
        alignItems: 'center',
        marginTop: Dimensions.get('window').height * .088
    },
    logInButton: {
        width: Dimensions.get('window').width * .9,
        height: Dimensions.get('window').height * .065,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'deepskyblue',
        borderRadius: 20
    },
    logInButtonText: {
        fontSize: Dimensions.get('window').height * .028,
        fontWeight: 'bold',
        color: 'white'
    },
    footerContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignSelf: 'center'
    },
    alreadyHaveAccountContainer: {
        flexDirection: 'row',
        marginTop: Dimensions.get('window').height * .022
    },
    alreadyHaveAnAccountText: {
        color: 'grey'
    },
    signInText: {
        fontWeight: 'bold',
        color: 'deepskyblue'
    }
});

export default LogInClient;
