import React from 'react'
import {StyleSheet, View, Text, Image, TextInput, Dimensions} from 'react-native';

const RegisteringAccountPopUp = ({navigation}) => {

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
        alignItems: 'center'
    },
    registeringText: {
        fontWeight: 'bold',
        fontSize: 30
    }
});

export default RegisteringAccountPopUp;