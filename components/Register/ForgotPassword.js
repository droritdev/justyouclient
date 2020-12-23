import React, { useContext } from 'react'
import {StyleSheet, View, Text, Image, TextInput, Dimensions, SafeAreaView} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

//Here the user verifies his user details before navigates to the reset password page
const ForgotPassword = ({navigation}) => {

    //Navigates back to the log in page
    const handleArrowButton = () => {
        navigation.navigate('LogIn');
    }

    //navigates to the reset passwrod page
    const handleNext = () => {
        navigation.navigate('ResetPassword')
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.upperContainer}>
                <TouchableOpacity
                onPress={handleArrowButton}
                >
                <Image
                    source={require('../../images/arrowBack.png')}
                    style={styles.arrowImage}
                />
                </TouchableOpacity>
                <View style={styles.justYouHeader}>
                    <Text style={styles.justYouText}>Just You</Text>
                </View>
            </View>
            <Text style={styles.resetTitle}>Re-Set Your Password</Text>
            <View style={styles.sendVerifyContainer}>
                <TextInput
                    style={styles.phoneEmailInput}
                    placeholder='Phone number or Email'
                />
                <TouchableOpacity
                    style={styles.verifyButton}
                    //onPress={handleVerifyCode}
                >
                    <Text style={styles.verifyButtonText}>Verify</Text>
                </TouchableOpacity>
                <Text style={styles.verifyExplination}>A code will be sent to you to verify and re-set your password</Text>
            </View> 
            <View style={styles.codeContainer}>
                <Text style={styles.enterCodeText}>Enter Code</Text>
                <TextInput
                    style={styles.codeInput}
                    placeholder=""
                />
            </View>
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
        height: Dimensions.get('window').height * .225
    },
    phoneEmailInput: {
        borderWidth: 2,
        borderColor: 'deepskyblue',
        borderRadius: 10,
        width: Dimensions.get('window').width * .9,
        height: Dimensions.get('window').height * .065,
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .022
    },
    verifyButton: {
        width: Dimensions.get('window').width * .3,
        height: Dimensions.get('window').height * .05,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'deepskyblue',
        borderRadius: 10
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
        alignItems: 'center',
        marginTop: Dimensions.get('window').height * .066
      },
      enterCodeText: {
        fontSize: Dimensions.get('window').height * .0278,
        fontWeight: '300'
      },
      codeInput: {
        borderWidth: 2,
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



});

export default ForgotPassword;