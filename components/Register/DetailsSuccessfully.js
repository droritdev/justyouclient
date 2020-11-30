import React from 'react'
import {StyleSheet, View, Text, Image, TextInput, Dimensions} from 'react-native';

//Navigates automaticly to the PhoneNumberVerification page after 2 seconds
const DetailsSuccessfully = ({navigation}) => {

    setTimeout(() => navigation.navigate('PhoneNumberVerification'), 2000);

    return(
        <View style={styles.container}>
            <Text style={styles.registeringText}>THE DETAILS SUCCESSFULLY ENTERD!</Text>
            <Image 
                source={require('../../images/successfullyIcon.png')}
            />
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
        fontSize: 40,
        textAlign: 'center',
        marginBottom: 30
    }
});

export default DetailsSuccessfully;