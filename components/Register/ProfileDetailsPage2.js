import React, {useState, useEffect, useContext, useReducer} from 'react';
import {StyleSheet, View, Text, Image, TextInput, Dimensions, SafeAreaView, Keyboard, TouchableWithoutFeedback} from 'react-native';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker';
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { Platform, Alert, Linking } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";


import ArrowBackButton from '../GlobalComponents/ArrowBackButton';
import BirthdayPicker from '../GlobalComponents/BirthdayPicker';
import AppButton from '../GlobalComponents/AppButton';
import { checkPermission } from '../../permissionService';
import {NameContext} from '../../context/NameContext';
import {ProfileImageContext} from '../../context/ProfileImageContext';
import {BirthdayContext} from '../../context/BirthdayContext';
import {EmailContext} from '../../context/EmailContext';


//for Firebase Storage
import storage from '@react-native-firebase/storage';

//for Firebase Auth
import auth from '@react-native-firebase/auth';


//Here the user enters his: Full name, profile image(wich uploads to the cloudinary cloud) and his birthday
const ProfileDetailsPage2 = ({navigation}) => {
    const {emailAddress} = useContext(EmailContext);
    const {dispatchFirst} = useContext(NameContext);
    const {dispatchLast} = useContext(NameContext);
    const {profileImage ,dispatchProfileImage} = useContext(ProfileImageContext);
    const {dispatchBirthday} = useContext(BirthdayContext);

    const [imageUriFireBase, setImageUriFireBase] = useState("");
    const [firstNameInput, setFirstNameInput] = useState("");
    const [lastNameInput, setLastNameInput] = useState("");
    // const [profileImageSource, setProfileImageSource] = useState(require('../../images/profileImage.png'));
    const [birthdaySelected, setBirthdaySelected] = useState("Set your birthday");
    const [isBirthdaySelected, setIsBirthdaySelected] = useState(false);
    const [minimumDate, setMinimumDate] = useState(new Date());
    const [maximumDate, setMaximumDate] = useState(new Date());
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [namesErrorMessage, setNamesErrorMessage] = useState("");
    const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState("");
    const [isNamesError, setIsNamesError] = useState(false);
    const [isFirstNameError, setIsFirstNameError] = useState(false);
    const [isLastNameError, setIsLastNameError] = useState(false);
    const [birthdayErrorMessage, setBirthdayErrorMessage] = useState("");
    const [isBirthdayError, setIsBirthdayError] = useState(false);


    const config = {
      withCredentials: true,
      baseURL: 'https://justyou.iqdesk.info:443/',
      headers: {
        "Content-Type": "application/json",
      },
    };

    //Sets the minimum age of registration to 18 automatticly
    useEffect (() => {
      setIsNamesError(false);
      let currentYear = new Date().getFullYear();
      let currentMonth = new Date().getMonth();
      let currentDay = new Date().getDate();
      setMaximumDate(new Date().setFullYear(currentYear - 18, currentMonth, currentDay));
      setMinimumDate(new Date().setFullYear(currentYear - 120, currentMonth, currentDay));
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

    const reference = storage().ref('shahar');

    const uploadImage = async (image) => {
      await reference.putFile(image);
    }

    const uploadImageToStorage = async (path, imageName) => {
      let reference = storage().ref('shaharUpload/projectX/');         // 2
      let task = reference.putFile(imageName);               // 3

      task.then(() => {                                 // 4
          console.log('Image uploaded to the bucket!');
      }).catch((e) => console.log('uploading image error => ', e));
  }

    //User picks an image from the gallery/camera and sets it to his profile picture
    const handleProfileImage = () => {
      //   const granted = checkForPermissions();

      //   if(granted) {

        ImagePicker.openPicker({
          width: 400,
          height: 400,
          cropping: true,
          mediaType: 'photo',
        }).then(image => {
          console.log(image);
          const source = {uri :'file://'+image.path}
          dispatchProfileImage({
            type: 'SET_PROFILE_IMAGE',
            profileImage: source
          });
        }).catch((err) => {

        })

          const options = {
            title: 'Select photo',
            base64: true
          };


          // ImagePicker.showImagePicker(options, (res) => {
          //   if(res.didCancel){
          //   }
          //   else if(res.error){
          //   }
          //   else{
          //     const imagesource = {uri: res.uri};

          //     console.log(imagesource);
          //     uploadImage('/Users/shaharkeisar/Desktop/justforyou/justYouClientFromBackup/justYouClient/images/aroundYouFocusedIcon.png');
          //     uploadImageToStorage(res.uri, 'aroundYouFocusedIcon.png')
          //     // {
          //     //   // path to existing file on filesystem
          //     //   // const pathToFile = `${utils.FilePath.PICTURES_DIRECTORY}/black-t-shirt-sm.png`;
          //     //   // uploads file
          //     //    reference.putFile(imagesource.toString());
          //     // }
          //     setProfileImageSource(imagesource);
          //   }
          // })
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
      setIsFirstNameError(false);
      setIsLastNameError(false);
      setIsBirthdayError(false);
      setFirstNameInput(text);
    }

    //Sets the lastName object to the value
    const handleLastNameInputChange = (text) => {
      setIsNamesError(false);
      setIsFirstNameError(false);
      setIsLastNameError(false);
      setIsBirthdayError(false);
      setLastNameInput(text);
    }

    const handleConfirm = (date) => {

      if(date.getUTCFullYear() === new Date().getUTCFullYear()){
        date = minimumDate;
      }
      else{
          setBirthdaySelected((date.getMonth()+1)+"/"+date.getUTCDate()+"/"+date.getUTCFullYear());
          setIsBirthdaySelected(true);

      }

      setDatePickerVisible(false);

    };

    const hideDatePicker = () => {
      setDatePickerVisible(false);
    };

    const handleDateInputPressed = () => {
      setIsNamesError(false);
      setIsFirstNameError(false);
      setIsLastNameError(false);
      setIsBirthdayError(false);
      setDatePickerVisible(!datePickerVisible);
    }

    //Handle the next button press - if ok, navigates to RegisteringAccountPopUp
    const handleNext = () => {
      if (profileImage === require('../../images/profileImage.png')) {
        setIsNamesError(true);
        setNamesErrorMessage('Profile image is required');
      }
      else if(firstNameInput === "" && lastNameInput === ""){
        setNamesErrorMessage("Names fields are required");
        setIsNamesError(true);
      }else if(firstNameInput === ""){
        setFirstNameErrorMessage("First name field is required");
        setIsFirstNameError(true);
      }else if(lastNameInput === ""){
        setLastNameErrorMessage("Last name field is required");
        setIsLastNameError(true);
      }
      else if(birthdaySelected === "Set your birthday"){
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
          lastName: lastNameInput
        });

        dispatchBirthday({
          type: 'SET_BIRTHDAY',
          birthday: birthdaySelected
        });

        setIsNamesError(false);
        setIsFirstNameError(false);
        setIsLastNameError(false);
        setIsBirthdayError(false);

        navigation.navigate('PaymentsAndPolicy');
      }
    }
    return(
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <ArrowBackButton
            onPress={handleArrowButton}
          />
          <Text style={styles.profileDetailesText}>Profile Details</Text>
          <Text style={styles.fillTheFieldsText}>Please fill out all fields</Text>
          <View style={styles.namesAndErrorContainer}>
            <View style={styles.nameAndImageContanier}>
              <TouchableOpacity onPress={handleProfileImage}>
                <Image
                  source={profileImage}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
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

            </View>
            {isNamesError ?
              <Text style={styles.namesErrorMessage}>{namesErrorMessage}</Text>
            :null}

            {isFirstNameError ?
              <Text style={styles.namesErrorMessage}>{firstNameErrorMessage}</Text>
            :null}

            {isLastNameError?
            <Text style={styles.namesErrorMessage}>{lastNameErrorMessage}</Text>
            :null}
          </View>

          <View style={styles.errorMessageContainer}>
            <Text style={styles.nameAndImageExplenation}>Your name and photo help the trainer to identify you</Text>
          </View>
          <View style={styles.birthdayContainer}>
            <Text style={styles.birthdayText}>Birthday</Text>
            <BirthdayPicker
              onPress={handleDateInputPressed}
              isBirthdaySelected={isBirthdaySelected}
              isVisible={datePickerVisible}
              onConfirm={(date) => handleConfirm(date)}
              onCancel={hideDatePicker}
              maximumDate={(maximumDate)}
              minimumDate={(minimumDate)}
              birthdaySelected={birthdaySelected}
            />
            {isBirthdayError ?
              <Text style={styles.birthdayErrorMessage}>{birthdayErrorMessage}</Text>
            : null}
          </View>
          <Text style={styles.emailAddressText}>Email Address</Text>
          <View style={styles.emailContainer}>
            <TextInput
              editable={false}
              placeholder={emailAddress}
              placeholderTextColor='black'
              style={styles.emailAddressButton}
            />
            <Text style={styles.emailExplinationText}>We use your email to send you receipts. Your mobile number is required to enhance account security.</Text>
          </View>
          <View style={styles.nextButtonContainer}>
            <AppButton
              title="Next"
              onPress={handleNext}
            />
        </View>
       </SafeAreaView>
       </TouchableWithoutFeedback>
    );
  }

  const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        flexDirection: 'column',
        backgroundColor: 'white'
      },
      profileDetailesText: {
        marginLeft: Dimensions.get('window').width * 0.0483,
        marginTop: Dimensions.get('window').height * 0.022,
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * 0.04
      },
      fillTheFieldsText: {
        marginLeft: Dimensions.get('window').width * 0.0483,
        marginTop: Dimensions.get('window').height * 0.01,
        fontSize: Dimensions.get('window').height * 0.027
      },
      nameAndImageContanier: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        //width: Dimensions.get('window').width * .95,
        height: Dimensions.get('window').width * - .15,
        width: Dimensions.get('screen').width,
        marginLeft: Dimensions.get('window').width * -0.0241
      },
      textInput: {
        marginTop: Dimensions.get('window').height * 0.035,
        borderColor: 'deepskyblue',
        borderRadius: 17,
        borderWidth: 1,
        height: Dimensions.get('window').height * .065,
        width: Dimensions.get('window').width * .34,
        justifyContent: 'center',
        fontSize: 20,
        // fontSize: Dimensions.get('window').height * 0.025
      },
      profileImage: {
        marginTop: Dimensions.get('window').height * 0.015,
        marginLeft: Dimensions.get('window').height * 0.032,
        width: Dimensions.get('window').width * .200,
        height: Dimensions.get('window').height * .095,
        overflow: 'hidden',
        borderRadius: 70,
      },
      namesAndErrorContainer: {
        height: Dimensions.get('window').height * .12,
        justifyContent: 'center'

      },
      namesErrorMessage: {
        color: 'red',
        justifyContent: 'center',
        alignSelf: 'center'
      },
      nameAndImageExplenation: {
        color: 'darkgrey',
        width: Dimensions.get('window').width,
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * 0.018,
        marginTop: Dimensions.get('window').height * 0.02
      },
      birthdayContainer: {
        height: Dimensions.get('window').height * .165
      },
      birthdayText: {
        marginTop: Dimensions.get('window').height * 0.033,
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * 0.0278,
        marginLeft: Dimensions.get('window').width * 0.0483
      },
      birthdayErrorMessage: {
        marginLeft: Dimensions.get('window').width * 0.0483,
        color: 'red',
        marginTop: Dimensions.get('window').height * 0.0055
      },
      emailContainer: {
        marginLeft: Dimensions.get('window').width * 0.0483,
        width: Dimensions.get('window').width * .9,

      },
      emailAddressText: {
        marginLeft: Dimensions.get('window').width * 0.0483,
        marginTop: Dimensions.get('window').height * 0.05,
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * 0.0278
      },
      emailAddressButton: {
        marginTop: Dimensions.get('window').height * 0.018,
        borderColor: 'deepskyblue',
        backgroundColor: 'lightgrey',
        borderRadius: 17,
        borderWidth: 1,
        height: Dimensions.get('window').height * .065,
        width: Dimensions.get('window').width * .9,
        justifyContent: 'center',
        fontSize: Dimensions.get('window').height * 0.0278,
        fontWeight: '300',
        textAlign: 'center',
      },
      emailExplinationText: {
        marginTop: Dimensions.get('window').height * 0.011,
        width: Dimensions.get('window').width * .9,
        textAlign: 'center'
      },
      nextButtonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 50
      }
  });

  export default ProfileDetailsPage2;
