import React from 'react'
import {StyleSheet, View, Text, Image, TextInput, Dimensions} from 'react-native';

//Pop Up page to inform the client that his account is being registering
const RegisteringAccountPopUp = ({navigation}) => {

    //Navigates automaticly to the DetailsSuccessfully page after 2.5 seconds (2.5 * 1000 mili seconds = 2500 mili secons = 2.5 seconds)
    setTimeout(() => navigation.navigate('DetailsSuccessfully'), 2500);

    return(
        <View style={styles.container}>
            <Text style={styles.registeringText}>Registering account...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    registeringText: {
        fontWeight: 'bold',
        fontSize: 30
    }
});

export default RegisteringAccountPopUp;