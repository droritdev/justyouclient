import React, { useContext } from 'react'
import {StyleSheet, View, Text, Image, TextInput, Dimensions} from 'react-native';

import {NameContext} from '../context/NameContext';

const WelcomeUser = ({navigation}) => {
    const {firstName} = useContext(NameContext);

    return(
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.justYouText}>Just You</Text>
                <Text style={styles.welcomeUserText}>WELLCOME {firstName.toUpperCase()}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
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
        fontSize: 40
    }
});

export default WelcomeUser;