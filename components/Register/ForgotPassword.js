import React, { useContext } from 'react'
import {StyleSheet, View, Text, Image, TextInput, Dimensions} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ForgotPassword = ({navigation}) => {

    const handleArrowButton = () => {
        navigation.navigate('LogIn');
    }

    const handleNext = () => {
        navigation.navigate('ResetPassword')
    }

    return(
        <View style={styles.container}>
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
                    <Text style={styles.partnerText}>Partner</Text>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        height: '100%'
    },
    upperContainer: {
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        marginTop: 60

    },
    arrowImage: {
        marginLeft: 15
    },
    justYouHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width * .65
    },
    justYouText: {
        fontWeight: 'bold',
        fontSize: 25
    },
    partnerText: {
        fontWeight: 'bold',
        color: 'deepskyblue'
    },
    resetTitle: {
        alignSelf: 'center',
        marginTop: 30,
        fontWeight: 'bold',
        fontSize: 30
    },
    sendVerifyContainer: {
        marginTop: 60,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: Dimensions.get('window').height * .225
    },
    phoneEmailInput: {
        borderWidth: 2,
        borderColor: 'grey',
        borderRadius: 10,
        width: Dimensions.get('window').width * .9,
        height: Dimensions.get('window').height * .065,
        textAlign: 'center',
        fontSize: 20
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
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
      },
      verifyExplination: {
          fontSize: 20,
          fontWeight: '300',
          textAlign: 'center',
          width: Dimensions.get('window').width * .65,
      },
      codeContainer: {
        alignItems: 'center',
        marginTop: 60
      },
      enterCodeText: {
        fontSize: 25,
        fontWeight: '300'
      },
      codeInput: {
        borderWidth: 2,
        borderColor: 'grey',
        borderRadius: 10,
        width: Dimensions.get('window').width * .9,
        height: Dimensions.get('window').height * .065,
        textAlign: 'center',
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

export default ForgotPassword;