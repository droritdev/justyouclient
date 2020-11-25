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
            <Text style={styles.excitedText}>We are exited to meet you!</Text>
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
      alignItems: 'center'
    }
  });

  export default GetStartedClient;