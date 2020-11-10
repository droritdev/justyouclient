import React, {useState, useEffect, useContext, useReducer} from 'react';
import {StyleSheet, View, Text, Image, TextInput, Dimensions} from 'react-native';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { Platform, Alert, Linking } from 'react-native';

import { checkPermission } from '../permissionService';
import {NameContext} from '../context/NameContext';
import {ProfileImageContext} from '../context/ProfileImageContext';
import {BirthdayContext} from '../context/BirthdayContext';
import {EmailContext} from '../context/EmailContext';

//Here the user enters his: Full name, profile image(wich uploads to the cloudinary cloud) and his birthday
const ProfileDetailsPage2 = ({navigation}) => {
    const {emailAddress} = useContext(EmailContext);
    const {dispatchFirst} = useContext(NameContext);
    const {dispatchLast} = useContext(NameContext);
    const {dispatchProfileImage} = useContext(ProfileImageContext);
    const {dispatchBirthday} = useContext(BirthdayContext);

    const [photo, setPhoto] = useState("");
    const [firstNameInput, setFirstNameInput] = useState("");
    const [lastNameInput, setLastNameInput] = useState("");
    const [profileImageSource, setProfileImageSource] = useState(require('../images/camera.png'));
    const [birthdaySelected, setBirthdaySelected] = useState("");
    const [minimumDate, setMinimumDate] = useState("");
    const [namesErrorMessage, setNamesErrorMessage] = useState("");
    const [isNamesError, setIsNamesError] = useState(false);
    const [birthdayErrorMessage, setBirthdayErrorMessage] = useState("");
    const [isBirthdayError, setIsBirthdayError] = useState(false);

    const config = {
      withCredentials: true,
      baseURL: 'http://localhost:3000/',
      headers: {
        "Content-Type": "application/json",
      },
    };
    
    //Sets the minimum age of registration to 18 automatticly
    useEffect (() => {
      let currentYear = new Date().getFullYear();
      let currentMonth = new Date().getMonth();
      let currentDay = new Date().getDate();
      let minimumYear = (Number(currentYear) - 18).toString();
      let minimumDate = `${currentDay}`+"-"+`${currentMonth}`+"-"+`${minimumYear}`;
      setMinimumDate(minimumDate);
    }, []);

  // const checkForPermissions = () => {
  //   check(PERMISSIONS.IOS.CAMERA)
  //     .then((result) => {
  //       switch (result) {
  //         case RESULTS.UNAVAILABLE:
  //           alert(
  //             'This feature is not available (on this device / in this context)',
  //           );
  //           break;
  //         case RESULTS.DENIED:
  //           alert(
  //             'The permission has not been requested / is denied but requestable',
  //           );
  //           break;
  //         case RESULTS.GRANTED:
  //           alert('The permission is granted');
  //           break;
  //         case RESULTS.BLOCKED:
  //           alert('The permission is denied and not requestable anymore');
  //           break;
  //       }
  //     })
  //     .catch((error) => {
  //       alert(error);
  //     });
      // const permissions =
      //   Platform.OS === 'ios'
      //     ? [PERMISSIONS.IOS.CAMERA]
      //     : [PERMISSIONS.ANDROID.CAMERA];
      // // Call our permission service and check for permissions
      // const isPermissionGranted = await checkPermission(permissions);

      // return isPermissionGranted;

  // }

    //Navigates back
    const handleArrowButton = () => {
      navigation.navigate('ProfileDetailsPage1');
    }

    //User picks an image from the gallery/camera and sets it to his profile picture
    const handleProfileImage = () => {
      //   const granted = checkForPermissions();
    
      //   if(granted) {
    
          const options = {
            title: 'Select photo',
            base64: true
          };
    
          ImagePicker.showImagePicker(options, (res) => {
            if(res.didCancel){
            }
            else if(res.error){
            }
            else{
              const imagesource = {uri: res.uri};
              setProfileImageSource(imagesource);

              const uri = res.uri;
              const type = res.type;
              const name = res.fileName;
              const source = {
                uri,
                type,
                name,
              }
              cloudinaryUpload(source);
            }
          })
        }
      //   }
      //   else{
      //     // Show an alert in case permission was not granted
      //     Alert.alert(
      //       'Permission Request',
      //       'Please allow permission to access the Camera.',
      //       [
      //         {
      //           text: 'Go to Settings',
      //           onPress: () => {
      //             Linking.openSettings();
      //           },
      //         },
      //         {
      //           text: 'Cancel',
      //           style: 'cancel',
      //         },
      //       ],
      //       { cancelable: false },
      //     );
      //   }
    
    //Sets the firstName object to the value
    const handleFirstNameInputChange = (text) => {
      setIsNamesError(false);
      setFirstNameInput(text);
    }

    //Sets the lastName object to the value
    const handleLastNameInputChange = (text) => {
      setIsNamesError(false);
      setLastNameInput(text);
    }

    //Upload the profile picture of the user to the cloudinary cloud
    const cloudinaryUpload = (photo) => {
      const data = new FormData()
      data.append('file', photo);
      data.append('upload_preset', 'omer13');
      data.append("cloud_name", "omerohana");

      fetch("https://api.cloudinary.com/v1_1/omerohana/upload", {
        method: "post",
        body: data
      })
      .then(res => res.json())
      .then(data => setPhoto(data.secure_url))
      .catch(err => {
        alert("An Error Occured While Uploading")
      })
    }

    const handleOnBirthdayChange = (text) => {
      setBirthdaySelected(text);
    }
    //Handle the next button press - if ok, navigates to RegisteringAccountPopUp
    const handleNext = () => {
      if(firstNameInput === "" || lastNameInput === ""){
        setNamesErrorMessage("Name fields are required");
        setIsNamesError(true);
      }
      else if(birthdaySelected === ""){
        setBirthdayErrorMessage("Birthday is required");
        setIsBirthdayError(true);
      }
      else{
        dispatchFirst({
          type: 'SET_FIRST_NAME',
          firstName: firstNameInput
        });

        dispatchLast({
          type: 'SET_LAST_NAME',
          firstName: lastNameInput
        });

        dispatchProfileImage({
          type: 'SET_PROFILE_IMAGE',
          profileImage: profileImageSource.uri
        });

        dispatchBirthday({
          type: 'SET_BIRTHDAY',
          birthday: birthdaySelected
        });

        setIsNamesError(false);
        setIsBirthdayError(false);

        navigation.navigate('PaymentsAndPolicy');
      }
    }
    return(
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={handleArrowButton}
            >
              <Image
                source={require('../images/arrowBack.png')}
                style={styles.arrowImage}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileDetailesText}>Profile Details</Text>
          <Text style={styles.fillTheFieldsText}>Please fill out all fields</Text>
          <View style={styles.namesAndErrorContainer}>
            <View style={styles.nameAndImageContanier}>
              <TextInput
                style={styles.textInput}
                textAlign='center'
                placeholder='First name'
                placeholderTextColor='darkgrey'
                onChangeText={value => handleFirstNameInputChange(value)}
              />
              <TextInput
                style={styles.textInput}
                textAlign='center'
                placeholder='Last name'
                placeholderTextColor='darkgrey'
                onChangeText={value => handleLastNameInputChange(value)}
              />
              <TouchableOpacity onPress={handleProfileImage}>
                <Image
                  source={profileImageSource}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            </View>
            {isNamesError ?
              <Text style={styles.namesErrorMessage}>{namesErrorMessage}</Text>
            :null}
          </View>
          <View style={styles.errorMessageContainer}>
            <Text style={styles.nameAndImageExplenation}>Your name and photo help the trainer to identify you</Text>
          </View>
          <Text style={styles.birthdayText}>Birthday</Text>
          <DatePicker
            style={styles.datePicker}
            date={birthdaySelected}
            mode="date"
            placeholder="Enter your birthday"
            placeholderTextColor="black"
            format="DD-MM-YYYY"
            minDate={minimumDate}
            maxDate="29-10-2090"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={(date) => handleOnBirthdayChange(date)}
            customStyles={{
              dateIcon: {
                height: 50,
                width: 50
              },
              dateInput: {
                height: 50
              },
              dateText: {
                fontSize: 25
              }
            }}
          />
          {isBirthdayError ?
            <Text style={styles.birthdayErrorMessage}>{birthdayErrorMessage}</Text>
          :null}
          <Text style={styles.emailAddressText}>EMAIL ADDRESS</Text>
          <View style={styles.emailContainer}>
            <TextInput 
              editable={false}
              placeholder={emailAddress}
              placeholderTextColor='black'
              style={styles.emailAddressButton}
            />
            <Text style={styles.emailExplinationText}>We use your email to send you receips. your mobile number is required to enhance account security.</Text>
          </View>
          <View style={styles.nextButtonContainer}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>NEXT</Text>
            </TouchableOpacity>
        </View>
       </View> 
    );
  }
  
  const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        flexDirection: 'column'
      },
      headerContainer: {
        marginLeft: 20,
        flexDirection: 'row',
        marginTop:30,
      },
      arrowImage: {
        marginTop: 20
      },
      profileDetailesText: {
        marginLeft: 20,
        marginTop: 20,
        fontWeight: 'bold',
        fontSize: 38
      },
      fillTheFieldsText: {
        marginLeft: 20,
        marginTop: 30,
        fontSize: 23
      },
      nameAndImageContanier: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Dimensions.get('screen').width,
        marginLeft: 10
      },
      textInput: {
        marginTop: 20,
        borderColor: 'deepskyblue',
        borderRadius: 17,
        borderWidth: 3,
        height: Dimensions.get('window').height * .065,
        width: Dimensions.get('window').width * .35,
        justifyContent: 'center',
        fontSize: 18
      },
      profileImage: {
        marginRight: 20,
        width: Dimensions.get('window').width * .225,
        height: Dimensions.get('window').height * .1,
        borderRadius: 50
      },
      namesAndErrorContainer: {
        height: Dimensions.get('window').height * .12,
      },
      namesErrorMessage: {
        color: 'red',
        marginLeft: 15
      },
      nameAndImageExplenation: {
        color: 'darkgrey',
        width: Dimensions.get('window').width,
        textAlign: 'center',
        fontSize: 16,
        marginTop: 5
      },
      birthdayText: {
        marginLeft: 20,
        marginTop: 40,
        fontWeight: 'bold',
        fontSize: 25
      },
      datePicker: {
        alignSelf: 'center',
        marginTop: 20,
        width: Dimensions.get('window').width * .9,
      },
      birthdayErrorMessage: {
        marginLeft: 20,
        color: 'red',
        marginTop: 15
      },
      emailContainer: {
        marginLeft: 20
      },
      emailAddressText: {
        marginLeft: 20,
        marginTop: 45,
        fontWeight: 'bold',
        fontSize: 25
      },
      emailAddressButton: {
        marginTop: 15,
        borderColor: 'deepskyblue',
        backgroundColor: 'lightgrey',
        borderRadius: 20,
        borderWidth: 3,
        height: Dimensions.get('window').height * .065,
        width: Dimensions.get('window').width * .9,
        justifyContent: 'center',
        fontSize: 25,
        fontWeight: '300',
        textAlign: 'center',
      },
      emailExplinationText: {
        marginTop: 10,
        width: Dimensions.get('window').width * .9,
        textAlign: 'center'
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
      }
  });

  export default ProfileDetailsPage2;