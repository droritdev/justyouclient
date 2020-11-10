import React from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';

//Page 1 of the app, welcoming the user
const WelcomePopUp = ({navigation}) => {

    //Aoutomaticlly navigates to the next page in 4 seconds (4 * 1000 milli secons = 4000)
    setTimeout(() => navigation.navigate('GetStarted'), 4000);

    return(
        <View style={styles.welcomePage1}>
            <Text style={styles.justYoutitle}>Just You</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    welcomePage1: {
      backgroundColor: 'dodgerblue',
      height: Dimensions.get('window').height,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    justYoutitle: {
        fontSize: 90,
        color: 'white',
        fontWeight: 'bold'
    }
});

export default WelcomePopUp;