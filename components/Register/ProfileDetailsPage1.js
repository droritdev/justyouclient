import React, { useState, useContext, useEffect} from 'react';
import { StyleSheet, View, Text, Image, Dimensions, SafeAreaView, Alert } from 'react-native';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FlipToggle from 'react-native-flip-toggle-button';
import {Dropdown} from 'react-native-material-dropdown-v2'
import {Platform} from 'react-native';
import {check ,request, PERMISSIONS, RESULTS, requestNotifications, checkNotifications, openSettings} from 'react-native-permissions';

import FlipToggleButton from '../GlobalComponents/FlipToggleButton';
import ArrowBackButton from '../GlobalComponents/ArrowBackButton';
import PickCountry from '../GlobalComponents/PickCountry';
import AppButton from '../GlobalComponents/AppButton';
import {CountryContext} from '../../context/CountryContext';
import {PasswordContext} from '../../context/PasswordContext';






//Here the user picks his country and grante the push and location pemissions
const ProfileDetailsPage1 = ({navigation}) => {
    const {dispatchPassword} = useContext(PasswordContext);
    const { country ,dispatchCountry} = useContext(CountryContext);
    const [isLocationPermission, setIsLocationPermission] = useState(true);
    const [isPushPermission, setIsPushPermission] = useState(true);
    const [isPermissionsNotConfirmed, setIsPermissionsNotConfirmed] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState("United States");
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

    //Handle when user presses the world icon
    const handleOnWorldIconPress = () => {
      // setVisible(true);
    }

    //Handle when the country modal closes
    const handleOnModalClose = () => {
      setVisible(false);
    }


    //Sets the location permission to the value
    const handleLocationToggleChange = (newState) => {
      if(newState) {
        //toogle is on
        askForPermission();
      } else {
        //toogle is off
        setIsLocationPermission(newState);
      }
    }



    //check if the location permission is enabled
    const checkLocationPermission = () => {
      check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              alert('This feature is not available (on this device / in this context)');
              break;
            case RESULTS.DENIED:
              //permission wasn't asked yet
                askForPermission();
              break;
            case RESULTS.LIMITED:
              alert('The permission is limited: some actions are possible');
              break;
            case RESULTS.GRANTED:
              //permission is granted
              setIsLocationPermission(true);
              break;
            case RESULTS.BLOCKED:
              //permission is not allowed
              setIsLocationPermission(false);
              showOpenSettingsAlert("location");
              break;
          }
        })
        .catch((error) => {
        });
    }



    // prompt permission window to the user
    const askForPermission = () => {
      request(
        Platform.select({
          android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        })).then((result) => {
          if(result === 'granted') {
            //user has granted permission
            setIsLocationPermission(true);
          } else {
            //user has declined permission
            setIsLocationPermission(false);
          }
        });
    }



    // show alert to send user to his settings (user has decliend permission)
    const showOpenSettingsAlert = (type) => {
      let title = "";
      let msg = "";
      switch (type) {
        case "location":
          title = "Location is disabled";
          msg = "To continue, allow JustYou app to access your location"
          break;
        case "notifications":
          title = "Notifications is disabled";
          msg = "To continue, allow JustYou app to show notifcations"
          break;
      }
      Alert.alert(
        title,
        msg,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => openSettings }
        ],
        { cancelable: false }
      );
    }


    //Sets the push permission to the value
    const handleNotificationToggleChange = (newState) => {
      if(newState){
        checkNotifications().then(({status, settings}) => {
          switch(status){
            case "blocked":
              showOpenSettingsAlert("notifications");
            break;
            case "denied":
              requestNotifications(['alert', 'sound']).then(({status, settings}) => {
                if(status === "granted"){
                  setIsPushPermission(newState);
                }

              });
            break;
            case "granted":
              setIsPushPermission(newState);
            break;
          }
        }
        );

      }else{
        setIsPushPermission(newState);
      }
    }

    //Handle the next button press - if ok, navigates to ProfileDetailsPage2
    const handleNext = () => {
      // if(!isCountrySelected){
      //   setCountryErrorMessage("Pick a country");
      //   setIsCountryErrorMessage(true);
      // }
      // else
      if(!isLocationPermission || !isPushPermission){
        setIsPermissionsNotConfirmed(true);
      }
      else{
        setIsPermissionsNotConfirmed(false);
        dispatchCountry({
          type: 'SET_COUNTRY',
          country: 'United States'
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
          <Text style={styles.fillTheFieldsText}></Text>
        </View>
        <View style={styles.countryContainer}>
          <Text style={styles.countryTitle}>Country</Text>
          <View styles={styles.countryPicker}>
            {/* <View style={styles.containerUSA}>
              <View style={styles.viewUSA}>
                <Text style={styles.textUSA}>United States</Text>
              </View>
              <Image 
                source={require('../../images/worldIcon.png')}
                style={styles.image}
              />
            </View> */}
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
              onToggle={(newState) => handleNotificationToggleChange(newState)}
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
          <AppButton
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
      backgroundColor: 'white',
      flexDirection: 'column'
    },
    // arrowImage: {
    //   marginTop: Dimensions.get('window').height * 0.066,
    //   marginLeft: Dimensions.get('window').width * 0.0483
    // },
    upperContainer: {
      marginTop: Dimensions.get('window').height * 0.022,
      // justifyContent: 'space-between',
      height: Dimensions.get('window').height * .125,
    },
    profileDetailesText: {
      fontWeight: 'bold',
      fontSize: Dimensions.get('window').height * 0.038,
      marginLeft: Dimensions.get('window').width * 0.0483
    },
    fillTheFieldsText: {
      marginTop: Dimensions.get('window').height * 0.01,
      fontSize: Dimensions.get('window').height * 0.026,
      marginLeft: Dimensions.get('window').width * 0.0483
    },
    countryContainer: {
      height: Dimensions.get('window').height * .11,
      marginTop: Dimensions.get('window').height * 0.044
    },
    countryTitle: {
      fontWeight: 'bold',
      fontSize: Dimensions.get('window').height * 0.027,
      marginLeft: Dimensions.get('window').width * 0.0483
    },
    countryErrorText: {
      color: 'red',
      fontSize: Dimensions.get('window').height * 0.014,
      marginLeft: Dimensions.get('window').width * 0.0483,
    },
    permissionsContainer: {
      justifyContent: 'space-between',
      height: Dimensions.get('window').height * .24,
      marginTop: Dimensions.get('window').height * 0.077,
      marginLeft: Dimensions.get('window').width * 0.0483
    },
    permissionsText: {
      fontWeight: 'bold',
      fontSize: Dimensions.get('window').height * 0.03
    },
    permissionsSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: Dimensions.get('window').height * .05,
      marginRight: Dimensions.get('window').height * 0.028,
      marginTop: Dimensions.get('window').height * 0.022
    },
    permissionsErrorText: {
      textAlign:'center',
      color: 'red',
      fontSize: Dimensions.get('window').height * 0.016,
      marginTop: Dimensions.get('window').height * 0.03
    },
    nextButtonContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginBottom: 50
    },
    containerUSA: {
      flexDirection: 'row', 
      alignSelf: 'center', 
      width: Dimensions.get('window').width * .95, 
      alignItems: 'center',
      marginTop: 20
    },
    viewUSA: {
      width: Dimensions.get('window').width * .825,
      height: 60,
      justifyContent: 'center',
      borderColor: 'deepskyblue',
      borderRadius: 17,
      borderWidth: 2,
      alignItems: 'center'
    },
    textUSA: {
      color: 'black',
      fontSize: 20,
      fontWeight: '300'
    },
    image: {
      width: 60,
      height: 60
    }
  });

  export default ProfileDetailsPage1;
