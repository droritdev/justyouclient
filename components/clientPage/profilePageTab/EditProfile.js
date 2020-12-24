import React, {useContext, useState, useEffect} from 'react';
import { Button, Text, View, SafeAreaView, Image, StyleSheet, Dimensions, ImageBackground, TextInput} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import Slider from '@react-native-community/slider';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Dialog from "react-native-dialog";
import AppButton from '../../GlobalComponents/AppButton';
import FlipToggleButton from '../../GlobalComponents/FlipToggleButton';

import {NameContext} from '../../../context/NameContext';
import {BirthdayContext} from '../../../context/BirthdayContext';

//Edit profile page
const EditProfile = ({navigation}) => {
    const {firstName, dispatchFirst} = useContext(NameContext);
    const {lastName, dispatchLast} = useContext(NameContext);

    const {birthday, dispatchBirthday} = useContext(BirthdayContext);

    const [firstNameInput, setFirstNameInput] = useState("");
    const [lastNameInput, setLastNameInput] = useState("");
    //const [profileImageSource, setProfileImageSource] = useState(require('../../images/profilePic.png'));
    const [minimumDate, setMinimumDate] = useState("");
    const [maximumDate, setMaximumDate] = useState("");
    const [birthdaySelected, setBirthdaySelected] = useState("Set your birthday");
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
        axios
            .get('/clients/omero@gmail.com',
            config
        )
        .then((doc) => {
            if(doc){
                dispatchFirst({
                    type: 'SET_FIRST_NAME',
                    firstName: doc.data[0].name.first
                });
                setFirstNameInput(doc.data[0].name.first);

                dispatchLast({
                    type: 'SET_LAST_NAME',
                    lastName: doc.data[0].name.last
                })
                setLastNameInput(doc.data[0].name.last);

                dispatchBirthday({
                    type: 'SET_BIRTHDAY',
                    birthday: doc.data[0].birthday
                })
                setBirthdaySelected(doc.data[0].birthday);
            }
            else{
                alert("No trainer");
            }
        })
        .then(() => {
            let date = new Date();
            let date2 = new Date();
            let currentYear = new Date().getFullYear();
            let currentMonth = new Date().getMonth();
            let currentDay = new Date().getDate();
            date.setFullYear(currentYear - 70, currentMonth, currentDay)
            date2.setFullYear(currentYear - 18, currentMonth, currentDay)
            setMinimumDate(date);
            setMaximumDate(date2);
        })
        .catch((err) => alert(err))
    },[])

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
        // setIsNamesError(false);
        // setIsBirthdayErrorMessage(false);
        // setIsCategoryError(false);
        // setIsTrainingSiteError(false);
        // setIsPriceError(false);
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
    const handleOnApprovePressed = () => {
        if(firstNameInput === "" || lastNameInput === ""){
            if(firstNameInput === "" || lastNameInput === ""){
                setIsNamesError(true);
            }
        }
        else{
            if(firstNameInput !== firstName){
                dispatchFirst({
                    type: 'SET_FIRST_NAME',
                    firstName: firstNameInput
                });
            }
            if(lastNameInput !== lastName){
                dispatchLast({
                    type: 'SET_LAST_NAME',
                    lastName: lastNameInput
                })
            }
            if(birthdaySelected !== birthday){
                dispatchBirthday({
                    type: 'SET_BIRTHDAY',
                    birthday: birthdaySelected
                })
            }

            axios
                .put('/clients/settings/edit-profile/omero@gmail.com' , {
                    name: {
                        first: firstNameInput,
                        last: lastNameInput
                    },
                    birthday: birthdaySelected,
                },
                config
                )
                .then((doc) => {
                    if(doc){
                        navigation.navigate('ProfilePage');
                    }
                    else{
                        alert("error");
                    }
                })
                .catch((err) => alert(err.data));
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
            <TouchableOpacity
                    onPress={() => handleOnArrowPress()}
                >
                <Image
                    source={require('../../../images/blackArrow.png')}
                    style={styles.arrowImage}
                />
            </TouchableOpacity>
            <Text style={styles.editProfileTitle}>Edit Profile</Text>
            <View style={styles.namesContainer}>
                <View style={styles.namesAndErrorContainer}>
                    <View style={styles.namesRowContainer}>
                    <TouchableOpacity 
                            //onPress={handleProfileImage}
                        >
                            <Image
                                source={require('../../../images/profileImage.png')}
                                style={styles.profileImage}
                            />
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
                    <Text style={styles.birthdayPicked}>{birthdaySelected}</Text>
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
            <View style={styles.permissionsContainer}>
                <Text style={styles.permissionsText}>Permissions</Text>
                <View style={styles.permissionsSection}>
                    <Text style={{fontWeight: 'bold', fontSize: 20}}>Location</Text>
                    <FlipToggleButton
                        value={isLocationPermission}
                        onToggle={(newState) => handleLocationToggleChange(newState)}
                    />
                </View>
                <Text style={{color: 'grey'}}>By sharing your location you'll see which instructors and sport clubs are next to you</Text>
                <View style={styles.permissionsSection}>
                    <Text 
                        style={{fontWeight: 'bold', fontSize: 20}}>Allow push notifications</Text>
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
        fontSize: 30,
        fontWeight: 'bold'
    },
    arrowImage: {
        marginLeft: 20
    },
    editProfileTitle: {
        fontWeight: 'bold',
        fontSize: 30,
        marginLeft: 20,
        marginTop: 30
    },
    namesAndErrorContainer: {
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
        fontSize: 18
    },
    profileImage: {
        width: Dimensions.get('window').width * .200,
        height: Dimensions.get('window').height * .113,
        borderRadius: 5
    },
    nameErrorMessage: {
        color: 'red',
        marginLeft: 20
    },  
    nameExplination: {
        color: 'grey',
        textAlign: 'center',
        marginTop: 10
    },
    birthdayText: {
        marginTop: 30,
        fontWeight: 'bold',
        fontSize: 25,
        marginLeft: 20
    },
    birthdayContainer: {
        height: 65,
        alignItems: 'center',
        marginTop: 10
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
        fontSize: 20,
        fontWeight: '300',
        marginLeft: Dimensions.get('window').width * .3
    },
    birthdayPicked: {
        textAlign: 'center',
        fontSize: 20,
        marginLeft: Dimensions.get('window').width * .3,
        color: 'lightgrey'
    },
    calendarIcon: {
        height: Dimensions.get('window').height * .04,
        width: Dimensions.get('window').height * .04,
    },
    birthdayErrorMessage: {
        marginLeft: 20,
        color: 'red',
        marginTop: 5
    },  
    datePicker: {
        marginTop: 10,
        width: Dimensions.get('window').width * .9,
        marginLeft: 20
    },
    nextButtonContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 90
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