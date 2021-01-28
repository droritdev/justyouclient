import React, {useContext, useState, useEffect} from 'react';
import { Button, Text, View, SafeAreaView, Image, StyleSheet, Dimensions, ImageBackground, TextInput} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import Slider from '@react-native-community/slider';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Dialog from "react-native-dialog";
import AppButton from '../../GlobalComponents/AppButton';
import FlipToggleButton from '../../GlobalComponents/FlipToggleButton';
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-crop-picker';

import BirthdayPicker from '../../GlobalComponents/BirthdayPicker';
import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';


//for Firebase Storage
import storage from '@react-native-firebase/storage';
//for Firebase Auth
import auth from '@react-native-firebase/auth';

import {NameContext} from '../../../context/NameContext';
import {BirthdayContext} from '../../../context/BirthdayContext';
import {ClientContext} from '../../../context/ClientContext'

//Edit profile page
const EditProfile = ({navigation}) => {
    const {firstName, dispatchFirst} = useContext(NameContext);
    const {lastName, dispatchLast} = useContext(NameContext);

    const {birthday, dispatchBirthday} = useContext(BirthdayContext);
    const {clientObject, dispatchClientObject} = useContext(ClientContext);
    

    const [firstNameInput, setFirstNameInput] = useState("");
    const [lastNameInput, setLastNameInput] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [birthdayInput, setBirthdayInput] = useState("");

    const [isNewImageSelected, setIsNewImageSelected] = useState(false);
    const [isBirthdaySelected, setIsBirthdaySelected] = useState(false);


    var profileImage = '';
    
    //const [profileImageSource, setProfileImageSource] = useState(require('../../images/profilePic.png'));
    const [minimumDate, setMinimumDate] = useState( new Date());
    const [maximumDate, setMaximumDate] = useState( new Date());
    const [birthdaySelected, setBirthdaySelected] = useState(clientObject.birthday);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [isLocationPermission, setIsLocationPermission] = useState(true);
    const [isPushPermission, setIsPushPermission] = useState(true);
    const [isPermissionsNotConfirmed, setIsPermissionsNotConfirmed] = useState(false);

    const [isNamesError, setIsNamesError] = useState(false); 
    const [nameErrorMessage ,setNameErrorMessage] = useState("Fill all the name fields");

    const config = {
        withCredentials: true,
        baseURL: 'http://localhost:3000/',
        headers: {
          "Content-Type": "application/json",
        },
    };

    //First off all, the component loads the user details from the data base and sets the variables to the data
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setValuesForPage();
        });
        return unsubscribe;
      }, [navigation]);


    const setValuesForPage = () => {
        console.log('clientObject.name.first ' + clientObject.name.first)
        setFirstNameInput(clientObject.name.first);
        setLastNameInput(clientObject.name.last);
        setProfileImageUrl(clientObject.image);
        setBirthdayInput(clientObject.birthday);
        let currentYear = new Date().getFullYear();
        let currentMonth = new Date().getMonth();
        let currentDay = new Date().getDate();
        setMaximumDate(new Date().setFullYear(currentYear - 18, currentMonth, currentDay));
        setMinimumDate(new Date().setFullYear(currentYear - 120, currentMonth, currentDay));
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
            setProfileImageUrl(source);
            profileImage = source;
        }).catch((err) => {
              
          })
          setIsNewImageSelected(true);
            const options = {
              title: 'Select photo',
              base64: true
            };
      }

    const getFormat = (uri) => {
        indexOfDot = uri.indexOf('.', uri.length-6);
        console.log("format : " +uri.slice(indexOfDot));
        return uri.slice(indexOfDot);
    }

    const uploadImage = async (filePath, imageUri) => {
        let reference = await storage().ref(filePath);
        const task = reference.putFile(imageUri);
        
          task.on('state_changed', taskSnapshot => {
            console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
            const bytesTransferred = taskSnapshot.bytesTransferred;
            const totalByteCount = taskSnapshot.totalByteCount;
            const progress = (bytesTransferred / totalByteCount);
            
          });
          
          task.then(() => {
            console.log('Image uploaded to the bucket!');
            reference.getDownloadURL().then((url) => {

                updateUserInMongoDB(url);
            })
          })
          .catch((e) => {
              console.log(e)
            });
      }

    const fullUploadImageProccess = () => {
        const user = auth().currentUser;
        console.log(user.uid);
        const userUid = "/clients/" + user.uid + '/profileImage'+getFormat(profileImageUrl.uri); 
        uploadImage(userUid, profileImageUrl.uri)
    }

    const updateUserInMongoDB = (uri) => {
        axios
                .put('/clients/settings/edit-profile/' + clientObject.email , {
                    name: {
                        first: firstNameInput,
                        last: lastNameInput
                    },
                    birthday: birthdaySelected,
                    image : uri,
                },
                config
                )
                .then((doc) => {
                    if(doc){
                        // navigation.navigate('ProfilePage');
                        //for refresh the target page (get updated info from mongoDB)
                        navigation.push('ProfilePage');
                    }
                    else{
                        alert("error");
                    }
                })
                .catch((err) => alert(err.data));
        
    }
    
    


    //Handle when the user presses the yes button in the dialog
    const handleYesDialog = () => {

        setDialogVisible(false);
        navigation.navigate('ProfilePage');
    };

    //Handle when the user presses the no button in the dialog
    const handleNoDialog = () => {
        setDialogVisible(false);
    };

    //Handle when the user presses the arrow back button
    const handleOnArrowPress = () => {
        setDialogVisible(true);
    }
    
    //Sets the firstNameInput object to the input the user enters
    const handleOnChangeFirstName = (value) => {
        setIsNamesError(false);
        setFirstNameInput(value);
    }

    //Sets the lastNameInput object to the input the user enters
    const handleOnChangeLastName = (value) => {
        setIsNamesError(false);
        setLastNameInput(value);
    }

    //Sets the birthday of the user when selected
    const handleConfirm = (date) => {
        setBirthdaySelected((date.getMonth()+1)+"/"+date.getUTCDate()+"/"+date.getUTCFullYear());
        setDatePickerVisible(false);
    };

    //Hides the Date picker when user close/confirm
    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    //Shows the date picker when user press the button
    const handleDateInputPressed = () => {
        setIsBirthdaySelected(true);
        setDatePickerVisible(!datePickerVisible);
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

    //Handle when user presses the approve button
    const handleOnApprovePressed = (uri) => {
        if(isNewImageSelected){

        
        fullUploadImageProccess();

            if(firstNameInput === "" || lastNameInput === ""){
                if(firstNameInput === "" || lastNameInput === ""){
                    setIsNamesError(true);
                }
            }
            else{
                if(firstNameInput !== clientObject.name.first){
                    // dispatchFirst({
                    //     type: 'SET_FIRST_NAME',
                    //     firstName: firstNameInput
                    // });
                }
                if(lastNameInput !== clientObject.name.last){
                    // dispatchLast({
                    //     type: 'SET_LAST_NAME',
                    //     lastName: lastNameInput
                    // })
                }
                if(birthdaySelected !== clientObject.birthday){
                    // dispatchBirthday({
                    //     type: 'SET_BIRTHDAY',
                    //     birthday: birthdaySelected
                    // })
                }
                // axios
                //     .put('/clients/settings/edit-profile/' + clientObject.email , {
                //         name: {
                //             first: firstNameInput,
                //             last: lastNameInput
                //         },
                //         birthday: birthdaySelected,
                //         image : uri,
                //     },
                //     config
                //     )
                //     .then((doc) => {
                //         if(doc){
                //             navigation.navigate('ProfilePage');
                //         }
                //         else{
                //             alert("error");
                //         }
                //     })
                //     .catch((err) => alert(err.data));
            }
        }else{
            updateUserInMongoDB(clientObject.image);
        }
    }

    return(
        <SafeAreaView style={styles.safeArea}>
            <View>
                <Dialog.Container visible={dialogVisible}>
                    <Dialog.Title style={styles.dialogTitle}>Attention</Dialog.Title>
                    <Dialog.Description style={styles.dialogContent}>Changes will not be saved - are you sure?</Dialog.Description>
                    <Dialog.Button label="No" onPress={(() => handleNoDialog())} />
                    <Dialog.Button label="Yes" onPress={() => handleYesDialog()} />

                </Dialog.Container>
            </View>
            <View>
                <Dialog.Container visible={dialogVisible}>
                    <Dialog.Title style={styles.dialogTitle}>Attention</Dialog.Title>
                    <Dialog.Description style={styles.dialogContent}>Changes will not be saved - are you sure?</Dialog.Description>
                    <Dialog.Button label="No" onPress={(() => handleNoDialog())} />
                    <Dialog.Button label="Yes" onPress={() => handleYesDialog()} />

                </Dialog.Container>
            </View>
            <View style={styles.headerContainer}>
                <Text style={styles.justYouHeader}>Just You</Text>
            </View>
                {/* <ArrowBackButton
                     onPress={handleOnArrowPress()}
                /> */}
            <TouchableOpacity
                    onPress={() => handleOnArrowPress()}
                >
                <Image
                    source={require('../../../images/leftArrow.png')}
                    style={styles.arrowImage}
                />
            </TouchableOpacity>
            <Text style={styles.editProfileTitle}>Edit Profile</Text>
            <View style={styles.namesContainer}>
                <View style={styles.namesAndErrorContainer}>
                    <View style={styles.namesRowContainer}>
                        <TouchableOpacity onPress={handleProfileImage}>
                            {isNewImageSelected ? <Image
                            source={profileImageUrl}
                            style={styles.profileImage}
                          />: 
                          <FastImage
                                style={styles.profileImage}
                                source={{
                                    uri: profileImageUrl,
                                    priority: FastImage.priority.normal,
                                        }}
                                resizeMode={FastImage.resizeMode.stretch}
                            />}
                           
                        </TouchableOpacity>
                        <TextInput
                            style={styles.namesInput}
                            textAlign='center'
                            placeholder={firstNameInput}
                            onChangeText={(value) => handleOnChangeFirstName(value)}
                        />
                        <TextInput
                            style={styles.namesInput}
                            textAlign='center'
                            placeholder={lastNameInput}
                            onChangeText={value => handleOnChangeLastName(value)}
                        />
                        
                    </View>
                    {isNamesError ? 
                        <Text style={styles.nameErrorMessage}>{nameErrorMessage}</Text>
                    : null}
                </View>
                <Text style={styles.nameExplination}>Your name help the clients to identify you</Text>
            </View>
            <Text style={styles.birthdayText}>Birthday</Text>
            <View style={styles.birthdayContainer}>
                <View style={styles.birthdayBoxContainer}>
                <View style={styles.birthdayBox}>
                    <TouchableOpacity
                    onPress={() => handleDateInputPressed()}
                    >
                    {isBirthdaySelected ? <Text style={styles.birthdayPicked}>{birthdaySelected}</Text> :<Text style={styles.birthdayUnPicked}>{birthdaySelected}</Text>}    
                    {/* <Text style={styles.birthdayPicked}>{birthdaySelected}</Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleDateInputPressed()}
                    >
                        <Image
                            source={require('../../../images/calendarIcon.png')}
                            style={styles.calendarIcon}
                        />
                    </TouchableOpacity>
                </View>
                </View>
                <DateTimePickerModal
                    isVisible={datePickerVisible}
                    mode="date"
                    onConfirm={(date) => handleConfirm(date)}
                    onCancel={hideDatePicker}
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                    headerTextIOS="Pick a date - minimum 18"
                />
            </View>
            
            <View style={styles.nextButtonContainer}>
                <AppButton
                    title="APPROVE"
                    onPress={handleOnApprovePressed}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'white',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        flexDirection: 'column',
    },
    headerContainer: {
        alignItems: 'center'
    },
    justYouHeader: {
        fontSize : Dimensions.get('window').height * .035,
        fontWeight: 'bold'
    },
    arrowImage: {
        marginLeft: Dimensions.get('window').width * .038,
        width: Dimensions.get('window').width * .080,
        height: Dimensions.get('window').height * .050,    
    },
    editProfileTitle: {
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .035, 
        marginLeft: Dimensions.get('window').width * .05,
        marginTop: Dimensions.get('window').height * .025,
    },
    namesAndErrorContainer: {
        marginTop: Dimensions.get('window').height * .01,
        height: Dimensions.get('window').height * .11,
    }, 
    namesRowContainer: {
        flexDirection: 'row',
        width: Dimensions.get('window').width * .95,
        height: Dimensions.get('window').width * .15,
        alignSelf: 'center',
        justifyContent: 'space-between'
    },  
    namesInput: {
        marginTop: Dimensions.get('window').height * 0.035,
        borderColor: 'deepskyblue',
        borderRadius: 17,
        borderWidth: 3,
        height: Dimensions.get('window').height * .065,
        width: Dimensions.get('window').width * .34,
        justifyContent: 'center',
        fontSize: Dimensions.get('window').height * .022,
    },
    profileImage: {
        marginTop: Dimensions.get('window').height * 0.015,
        marginLeft: Dimensions.get('window').width * 0.01,
        width: Dimensions.get('window').width * .200,
        height: Dimensions.get('window').height * .095,
        overflow: 'hidden',
        borderRadius: 70,
    },
    nameErrorMessage: {
        color: 'red',
        marginLeft: Dimensions.get('window').width * 0.025,
    },  
    nameExplination: {
        color: 'grey',
        textAlign: 'center',
        marginTop: Dimensions.get('window').height * 0.015,
    },
    birthdayText: {
        marginLeft: Dimensions.get('window').width * 0.0483,
        marginTop: Dimensions.get('window').height * 0.035,
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * 0.0278,
    },
    birthdayContainer: {
        height: Dimensions.get('window').height * 0.07,
        alignItems: 'center',
        marginTop: Dimensions.get('window').height * 0.015,
    },
    birthdayBoxContainer: {
        height: Dimensions.get('window').height * .065,
        width: Dimensions.get('window').width * .93,
        borderWidth: 3,
        borderColor: 'deepskyblue',
        borderRadius: 17,
        justifyContent: 'center'
    },
    birthdayBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: Dimensions.get('window').height * .065,
        width: Dimensions.get('window').width * .9,
    },
    birthdayUnPicked: {
        textAlign: 'center',
        color: 'grey',
        fontSize: Dimensions.get('window').height * 0.025,
        fontWeight: '300',
        marginLeft: Dimensions.get('window').width * .35,
    },
    birthdayPicked: {
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * 0.025,
        marginLeft: Dimensions.get('window').width * .35,
        color: 'black'
    },
    calendarIcon: {
        height: Dimensions.get('window').height * .04,
        width: Dimensions.get('window').height * .04,
    },
    birthdayErrorMessage: {
        marginLeft: Dimensions.get('window').width * .25,
        color: 'red',
        marginTop: Dimensions.get('window').height * .001,
    },  
    datePicker: {
        marginTop: Dimensions.get('window').height * .001,
        width: Dimensions.get('window').width * .9,
        marginLeft: Dimensions.get('window').width * .025
    },
    nextButtonContainer: {
        alignItems: 'center',
        flex: 1,
        // marginTop: Dimensions.get('window').height * 0.15,

        justifyContent: 'flex-end',
        marginBottom: Dimensions.get('window').height * .1
    },
    dialogTitle: {
        fontWeight: 'bold',
        fontSize: 20
    },
    dialogContent: {
        fontSize: 18
    },
    permissionsContainer: {
        justifyContent: 'space-between',
        height: Dimensions.get('window').height * .24,
        marginTop: 30,
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
});

export default EditProfile;