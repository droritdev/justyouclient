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
                style={styles.Image}
            />
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
        fontSize: 40,
        textAlign: 'center',
        marginBottom: 30
    },
    Image: {
        height: Dimensions.get('window').height * .25,
        width : Dimensions.get('window').height * .25
    }
});

export default DetailsSuccessfully;