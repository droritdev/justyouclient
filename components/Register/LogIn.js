import React, {useState} from 'react';
import {StyleSheet, View, Text, Dimensions, Image} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

//Page for the exsisting users to log back in
const LogIn = ({navigation}) => {
    const [isPasswordErrorMessage, setIsPasswordErrorMessage] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

    //Navigates back to the EmailVerification page
    const handleArrowButton = () => {
        navigation.navigate('EmailVerification');
    }

    const handleOnChangePhoneEmail = () => {

    }

    //Handle when the user presses the log in button
    const handleLogInButton = () => {
        navigation.navigate('WelcomeUser');
    }

    //Handle when the user presses the sign in button
    const handleSignUpButton = () => {
        navigation.navigate('EmailVerification');
    }

    //Sends the users to reset his password
    const handleForgotPasswordButton = () => {
        navigation.navigate('ForgotPassword');
    }

    return(
        <View style={styles.container}>
            <TouchableOpacity
            onPress={handleArrowButton}
            >
            <Image
                source={require('../../images/arrowBack.png')}
                style={styles.arrowImage}
            />
            </TouchableOpacity>
            <Text style={styles.justYouTitle}>Just You</Text>
            <View style={styles.inputsContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Phone number or Email'
                    placeholderTextColor='grey'
                    onChangeText={(value) => handleOnChangePhoneEmail(value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    placeholderTextColor='grey'
                />
                <View>
                    {isPasswordErrorMessage ?
                        <Text>Passwords not matched</Text>
                    :null}
                </View>
                <TouchableOpacity
                    onPress={handleForgotPasswordButton}
                >
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        height: '100%'
    },
    arrowImage: {
        marginTop: 60,
        marginLeft: 20
    },
    justYouTitle: {
        color: 'deepskyblue',
        fontWeight: 'bold',
        fontSize: 45,
        alignSelf: 'center'
    },
    inputsContainer: {
        marginTop: Dimensions.get('window').height * .1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 180
    },
    input: {
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'grey',
        width: Dimensions.get('window').width * .9,
        height: 60,
        alignSelf: 'center',
        fontSize: 20,
        textAlign: 'center'
    },
    forgotPassword: {
        alignSelf: 'center',
        color: 'deepskyblue',
        fontWeight: 'bold',
        fontSize: 15
    },
    logInButtonContainer: {
        alignItems: 'center',
        marginTop: 65
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
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    footerContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignSelf: 'center',
        marginBottom: 40
    },  
    alreadyHaveAccountContainer: {
        flexDirection: 'row',
        marginTop: 20
    },
    alreadyHaveAnAccountText: {
        color: 'grey'
    },
    signInText: {
        fontWeight: 'bold',
        color: 'deepskyblue'
    }
});

export default LogIn;