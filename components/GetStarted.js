import React from 'react';
import {StyleSheet, View, Text, Image, Button, TouchableOpacity, Dimensions} from 'react-native';

//Get started page - by press the button the user navigates to the SignUp page
const GetStartedClient = ({navigation}) => {

    //User nevigates to SignUp page after pressing the get started button
    const handleGetStartedButton = () => {
      navigation.navigate('SignUp')
    }

    return(
      <View style={styles.welcomePage2}>
        <View style={styles.welcomeContainer}>
            <Image source = {require('../images/welcomepic.png')} />
            <Text style={styles.welcomeToText}>Welcome to</Text>
            <Text style={styles.justYouText}>Just You</Text>
            <Text style={styles.excitedText}>We are exited to meet you!</Text>
        </View>
        <View style={styles.getStartedContainer}>
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={handleGetStartedButton} //navigates to the SignUp
            >
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
    welcomePage2: {
      height: Dimensions.get('window').height,
      flexDirection: 'column'
    },
    welcomeContainer: {
      flexDirection: 'column',
      height: '95%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    welcomeToText: {
      marginTop: 10,
      fontSize: 30,
      fontWeight: 'bold',
    },
    justYouText: {
      fontSize: 60,
      fontWeight: 'bold',
      color: 'deepskyblue',
      marginTop: 10
    },
    excitedText: {
      fontSize: 25,
      marginTop: 20
    },
    getStartedContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      marginBottom: 40,
      alignItems: 'center'
    },
    getStartedButton: {
      width: Dimensions.get('window').width * .9,
      height: Dimensions.get('window').height * .065,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: 'deepskyblue',
      borderRadius: 20
    },
    getStartedText: {
      fontSize: 25,
      fontWeight: 'bold',
      color: 'white'
    }
  });

  export default GetStartedClient;