import React from 'react';
import {StyleSheet, View, Text, Image, Button, TouchableOpacity, Dimensions, SafeAreaView} from 'react-native';

import AppButton from '../GlobalComponents/AppButton';

//Get started page - by press the button the user navigates to the SignUp page
const GetStartedClient = ({navigation}) => {

    //User nevigates to SignUp page after pressing the get started button
    const handleGetStartedButton = () => {
      navigation.navigate('SignUp')
    }

    return(
      <SafeAreaView style={styles.welcomePage2}>
        <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeToText}>Welcome to</Text>
            <View style={styles.justyouView}>
              <Text style={styles.justYouText}>Just You</Text>
            </View>
            <Text style={styles.excitedText}>We are excited to meet you!</Text>
        </View>
        <View style={styles.getStartedContainer}>
          <AppButton
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
      fontSize: Dimensions.get('window').height * .04,
      fontWeight: 'bold'
    },
    justYouText: {
      fontSize: Dimensions.get('window').height * .1,
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
      alignItems: 'center',
      marginBottom: 50
    },
    justyouView: {
      marginTop: 20,
      marginBottom: 20
    }
  });

  export default GetStartedClient;