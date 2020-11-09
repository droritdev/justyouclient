import React from 'react'
import {StyleSheet, View, Text, Image, TextInput, Dimensions} from 'react-native';

const DonePopUp = ({navigation}) => {

    setTimeout(() => navigation.navigate('WelcomeUser'), 2000);

    return(
        <View style={styles.container}>
            <Image 
                source={require('../images/successfullyIcon.png')}
            />
            <Text style={styles.registeringText}>Done</Text>
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
        marginTop: 25
    }
});

export default DonePopUp;