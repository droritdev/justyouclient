import React, {useState, useContext, useEffect} from 'react';
import {StyleSheet, View, Text, Image, Dimensions} from 'react-native';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FlipToggle from 'react-native-flip-toggle-button';
import {Dropdown, DropDown} from 'react-native-material-dropdown'

import {CountryContext} from '../context/CountryContext';
import {PasswordContext} from '../context/PasswordContext';

//Here the user picks his country and grante the push and location pemissions
const ProfileDetailsPage1 = ({navigation}) => {
    const {dispatchPassword} = useContext(PasswordContext);
    const {country, dispatch} = useContext(CountryContext);
    const [isLocationPermission, setIsLocationPermission] = useState(true);
    const [isPushPermission, setIsPushPermission] = useState(true);
    const [isPermissionsNotConfirmed, setIsPermissionsNotConfirmed] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [isCountryErrorMessage, setIsCountryErrorMessage] = useState(false);
    const [countryErrorMessage,setCountryErrorMessage] = useState("");
    const [isCountrySelected, setIsCountrySelected] = useState(false);

    let countries = [
      {
        label: 'United States',
        value: 1
      },
      {
        label: 'Israel',
        value: 2
      }
    ]

    //Checks if both permissions granted every time each of them changes
    useEffect(() => {
      if(isLocationPermission && isPushPermission){
        setIsPermissionsNotConfirmed(false);
      }
    },[isPushPermission, isLocationPermission])

    //Navigates back to the create password page and Re-set the password in the passwordContext
    const handleArrowButton = () => {
      dispatchPassword({
        type: 'SET_PASSWORD',
        password: ""
      })
      navigation.navigate('CreatePassword');
    }

    //Sets the selected country array to the value
    const handleOnChangeText = (value) => {
      setIsCountrySelected(true);
      setIsCountryErrorMessage(false);
      setCountryErrorMessage("");
      setSelectedCountry(value);
    }

    //Sets the location permission to the value
    const handleLocationToggleChange = (newState) => {
      setIsLocationPermission(newState);
    }

    //Sets the push permission to the value
    const handlePermissionToggleChange = (newState) => {
      setIsPushPermission(newState);
    }
    
    //Handle the next button press - if ok, navigates to ProfileDetailsPage2
    const handleNext = () => {
      if(!isCountrySelected){
        setCountryErrorMessage("You must pick a country");
        setIsCountryErrorMessage(true);
      }
      else if(!isLocationPermission || !isPushPermission){
        setIsPermissionsNotConfirmed(true);
      }
      else{
        setIsPermissionsNotConfirmed(false);
        dispatch({
          type: 'SET_COUNTRY',
          country: selectedCountry
        });
        navigation.navigate('ProfileDetailsPage2');
      }
    }
  
    return(
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handleArrowButton}
        >
          <Image
            source={require('../images/arrowBack.png')}
            style={styles.arrowImage}
          />
        </TouchableOpacity>
        <View style={styles.upperContainer}>
          <Text style={styles.profileDetailesText}>Profile Details</Text>
          <Text style={styles.fillTheFieldsText}>Please fill out all fields:</Text>
          <View style={styles.countryContainer}>
            <Text style={styles.countryTitle}>Country</Text>
            <View style={styles.dropDownContainer}>
              <Dropdown
                data={countries}
                value={country}
                useNativeDriver={true}
                onChangeText={(value) => handleOnChangeText(value)}
                containerStyle={{
                  width: Dimensions.get('window').width * .92,
                  marginLeft: 20
                }}
              />
              {isCountryErrorMessage ? 
                <Text style={styles.countryErrorText}>{countryErrorMessage}</Text>
              : null}
            </View>
          </View>
        </View>
        <View style={styles.permissionsContainer}>
          <Text style={styles.permissionsText}>Permissions</Text>
          <View style={styles.permissionsSection}>
            <Text 
              style={{fontWeight: 'bold', fontSize: 20}}
            >Location</Text>
            <FlipToggle
              value={isLocationPermission}
              buttonHeight={30}
              buttonWidth={70}
              buttonRadius={40}
              sliderWidth={35}
              sliderHeight={30}
              sliderRadius={50}
              sliderOffColor={'black'}
              sliderOnColor={'white'}
              buttonOffColor={'grey'}
              buttonOnColor={'deepskyblue'}
              onToggle={(newState) => handleLocationToggleChange(newState)}
            />
          </View>
          <Text style={{color: 'grey'}}>By sharing your location you'll see which instructors and sport clubs are next to you
          </Text>
          <View style={styles.permissionsSection}>
            <Text 
              style={{fontWeight: 'bold', fontSize: 20}}
            >Allow push notifications</Text>
            <FlipToggle
              value={isPushPermission}
              buttonHeight={30}
              buttonWidth={70}
              buttonRadius={40}
              sliderWidth={35}
              sliderHeight={30}
              sliderRadius={50}
              sliderOffColor={'black'}
              sliderOnColor={'white'}
              buttonOffColor={'grey'}
              buttonOnColor={'deepskyblue'}
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
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      </View>
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
      height: Dimensions.get('window').height * .275,
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
    },
    dropDownContainer: {

    },
    countryTitle: {
      fontWeight: 'bold',
      fontSize: 24,
      marginLeft: 20
    },
    countryErrorText: {
      textAlign:'center',
      color: 'red',
      fontSize: 15
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
      marginBottom: 40,
      alignItems: 'center'
    },
    nextButton: {
      width: Dimensions.get('window').width * .9,
      height: Dimensions.get('window').height * .065,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: 'deepskyblue',
      borderRadius: 20
    },
    nextButtonText: {
      fontSize: 25,
      fontWeight: 'bold',
      color: 'white'
    },
  });

  export default ProfileDetailsPage1;