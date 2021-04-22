import React, { useContext } from 'react'
import {StyleSheet, View, Text, Image, TextInput, Dimensions} from 'react-native';

import {NameContext} from '../../context/NameContext';

const WelcomeUser = ({navigation}) => {
    const {firstName} = useContext(NameContext);

    //Navigates automaticlly to the profile page after 2 seconds
    setTimeout(() => navigation.navigate('ClientContainer'), 1500);
    // navigation.navigate('ClientContainer')
    return(
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.justYouText}>Just You</Text>
                <Text style={styles.welcomeUserText}>WELCOME{"\n"+firstName.toUpperCase()}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainer: {
        justifyContent: 'space-between',
        height: Dimensions.get('window').height * .15,
        alignItems: 'center'
    },
    justYouText: {
        fontWeight: 'bold',
        color: 'deepskyblue',
        fontSize: 80
    },
    welcomeUserText: {
        marginTop: 20,
        fontWeight: 'bold',
        color: 'steelblue',
        fontSize: 40,
        textAlign: 'center'
    }
});

export default WelcomeUser;
