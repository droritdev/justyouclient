import React, {useState, useContext, useEffect} from 'react';
import {StyleSheet, View, Text, Image, Dimensions, SafeAreaView} from 'react-native';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FlipToggle from 'react-native-flip-toggle-button';
import {Dropdown} from 'react-native-material-dropdown'

import FlipToggleButton from '../GlobalComponents/FlipToggleButton';
import ArrowBackButton from '../GlobalComponents/ArrowBackButton';
import PickCountry from '../GlobalComponents/PickCountry';
import NextButton from '../GlobalComponents/NextButton';
import {CountryContext} from '../../context/CountryContext';
import {PasswordContext} from '../../context/PasswordContext';

//Here the user picks his country and grante the push and location pemissions
const ProfileDetailsPage1 = ({navigation}) => {
    const {dispatchPassword} = useContext(PasswordContext);
    const {dispatchCountry} = useContext(CountryContext);
    const [isLocationPermission, setIsLocationPermission] = useState(true);
    const [isPushPermission, setIsPushPermission] = useState(true);
    const [isPermissionsNotConfirmed, setIsPermissionsNotConfirmed] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState("Pick a country");
    const [selectedCountryName, setSelectedCountryName] = useState("");
    const [isCountryErrorMessage, setIsCountryErrorMessage] = useState(false);
    const [countryErrorMessage,setCountryErrorMessage] = useState("");
    const [isCountrySelected, setIsCountrySelected] = useState(false);
    const [visible, setVisible] = useState(false);

    //Navigates back to the create password page and Re-set the password in the passwordContext
    const handleArrowButton = () => {
      dispatchPassword({
        type: 'SET_PASSWORD',
        password: ""
      })
      navigation.navigate('CreatePassword');
    }

    //Sets the selected country array to the value
    const handleOnChangeCountry = (value) => {
      setIsCountrySelected(true);
      setIsCountryErrorMessage(false);
      setIsPermissionsNotConfirmed(false);
      setCountryErrorMessage("");
      setSelectedCountry(value);
      setSelectedCountryName(value);
    }

    const handleOnWorldIconPress = () => {
      setVisible(true);
    }

    const handleOnModalClose = () => {
      setVisible(false);
    }

    //Sets the location permission to the value
    const handleLocationToggleChange = (newState) => {
      setIsLocationPermission(newState);
      if(isPushPermission && newState){
        setIsPermissionsNotConfirmed(false);
      }
    }

    //Sets the push permission to the value
    const handlePermissionToggleChange = (newState) => {
      setIsPushPermission(newState);
      if(isLocationPermission && newState){
        setIsPermissionsNotConfirmed(false);
      }
    }
    
    //Handle the next button press - if ok, navigates to ProfileDetailsPage2
    const handleNext = () => {
      if(!isCountrySelected){
        setCountryErrorMessage("Pick a country");
        setIsCountryErrorMessage(true);
      }
      else if(!isLocationPermission || !isPushPermission){
        setIsPermissionsNotConfirmed(true);
      }
      else{
        setIsPermissionsNotConfirmed(false);
        dispatchCountry({
          type: 'SET_COUNTRY',
          country: selectedCountryName
        });
        navigation.navigate('ProfileDetailsPage2');
      }
    }
  
    return(
      <SafeAreaView style={styles.container}>
        <ArrowBackButton
          onPress={handleArrowButton}
        />
        <View style={styles.upperContainer}>
          <Text style={styles.profileDetailesText}>Profile Details</Text>
          <Text style={styles.fillTheFieldsText}>Please fill out all fields:</Text>
        </View>
        <View style={styles.countryContainer}>
          <Text style={styles.countryTitle}>Country</Text>
          <View styles={styles.countryPicker}>
            <PickCountry
              initValue={selectedCountry}
              onChange={(option) => handleOnChangeCountry(option.label)}
              visible={visible}
              onModalClose={() => handleOnModalClose()}
              onPress={() => handleOnWorldIconPress()}

            />
            {isCountryErrorMessage ? 
              <Text style={styles.countryErrorText}>Pick a country</Text>
            : null}
          </View>
        </View>
        <View style={styles.permissionsContainer}>
          <Text style={styles.permissionsText}>Permissions</Text>
          <View style={styles.permissionsSection}>
            <Text 
              style={{fontWeight: 'bold', fontSize: 20}}
            >Location</Text>
            <FlipToggleButton
              value={isLocationPermission}
              onToggle={(newState) => handleLocationToggleChange(newState)}
            />
          </View>
          <Text style={{color: 'grey'}}>By sharing your location you'll see which instructors and sport clubs are next to you
          </Text>
          <View style={styles.permissionsSection}>
            <Text 
              style={{fontWeight: 'bold', fontSize: 20}}
            >Allow push notifications</Text>
            <FlipToggleButton
              value={isPushPermission}
              onToggle={(newState) => handlePermissionToggleChange(newState)}
            />
          </View>
          <Text style={{color: 'grey'}}>
            We'll let you know how your order is doing
          </Text>
        </View>
        {isPermissionsNotConfirmed ?
        <Text style={styles.permissionsErrorText}>Please allow both permissions to continue the registration</Text>
        :null}
        <View style={styles.nextButtonContainer}>
          <NextButton
          title="Next"
            onPress={handleNext}
          />
        </View>
      </SafeAreaView>
    )
  }
  
  const styles = StyleSheet.create({
    container: {
      height: Dimensions.get('window').height,
      flexDirection: 'column'
    },
    arrowImage: {
      marginTop: 60,
      marginLeft: 20
    },
    upperContainer: {
      marginTop: 25,
      justifyContent: 'space-between',
      height: Dimensions.get('window').height * .125,
    },
    profileDetailesText: {
      fontWeight: 'bold',
      fontSize: 38,
      marginLeft: 20
    },
    fillTheFieldsText: {
      fontSize: 23,
      marginLeft: 20
    },
    countryContainer: {
      height: Dimensions.get('window').height * .11,
      marginTop: 40
    },
    countryTitle: {
      fontWeight: 'bold',
      fontSize: 24,
      marginLeft: 20
    }, 
    countryErrorText: {
      color: 'red',
      fontSize: 15,
      marginLeft: 20
    },
    permissionsContainer: {
      justifyContent: 'space-between',
      height: Dimensions.get('window').height * .24,
      marginTop: 70,
      marginLeft: 20
    },
    permissionsText: {
      fontWeight: 'bold',
      fontSize: 27
    },
    permissionsSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: Dimensions.get('window').height * .03,
      marginRight: 25,
      marginTop: 20
    },
    permissionsErrorText: {
      textAlign:'center',
      color: 'red',
      fontSize: 15,
      marginTop: 25
    }, 
    nextButtonContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center'
    }
  });

  export default ProfileDetailsPage1;