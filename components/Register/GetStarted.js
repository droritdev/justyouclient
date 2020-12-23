import React from 'react';
import {StyleSheet, View, Text, Image, Button, TouchableOpacity, Dimensions, SafeAreaView} from 'react-native';

import NextButton from '../GlobalComponents/NextButton';

//Get started page - by press the button the user navigates to the SignUp page
const GetStartedClient = ({navigation}) => {

    //User nevigates to SignUp page after pressing the get started button
    const handleGetStartedButton = () => {
      navigation.navigate('SignUp')
    }

    return(
      <SafeAreaView style={styles.welcomePage2}>
        <View style={styles.welcomeContainer}>
            <Image source = {require('../../images/welcomepic.png')} />
            <Text style={styles.welcomeToText}>Welcome to</Text>
            <Text style={styles.justYouText}>Just You</Text>
            <Text style={styles.excitedText}>We are excited to meet you!</Text>
        </View>
        <View style={styles.getStartedContainer}>
          <NextButton
            title="Get Started"
            onPress={handleGetStartedButton}
          />
        </View>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    welcomePage2: {
      height: Dimensions.get('window').height,
      backgroundColor: 'white',
      flexDirection: 'column'
    },
    welcomeContainer: {
      flexDirection: 'column',
      height: '95%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    welcomeToText: {
      marginTop: Dimensions.get('window').height * .011,
      fontSize: Dimensions.get('window').height * .033,
      fontWeight: 'bold',
    },
    justYouText: {
      fontSize: Dimensions.get('window').height * .066,
      fontWeight: 'bold',
      color: 'deepskyblue',
      marginTop: Dimensions.get('window').height * .011
    },
    excitedText: {
      fontSize: Dimensions.get('window').height * .0278,
      marginTop: Dimensions.get('window').height * .022
    },
    getStartedContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center'
    }
  });

  export default GetStartedClient;