import React, {useContext, useState, useEffect} from 'react';
import { Button, Text, View, SafeAreaView, Image, StyleSheet, Dimensions, ImageBackground} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Dialog from "react-native-dialog";
import {Accordion, Block} from 'galio-framework';

import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';

import auth from '@react-native-firebase/auth';


//The settings page
const Settings = ({navigation}) => {

    const [dialogVisible, setDialogVisible] = useState(false);


    useEffect (() => {
        //Hide bottom navigation UI
        navigation.dangerouslyGetParent().setOptions({
            tabBarVisible: false
        })
    }, []);

    //Handle when the user presses yes in the sign out dialog
    const handleYesDialog = () => {
        setDialogVisible(false);
        auth().signOut()
            .then(() => navigation.navigate('LogIn'));
         };

    //Handle when the user presses no in the sign out dialog
    const handleNoDialog = () => {
        setDialogVisible(false);
    };

    //Handle when the user presses the sign out button
    const handleOnSignOutPress = () => {
        setDialogVisible(true);
    }

    //Navigates back to the profile page
    const handleOnArrowPress = () => {
        navigation.dangerouslyGetParent().setOptions({
            tabBarVisible: true
        })
        navigation.navigate('ProfilePage');
    }

    //Handle when the user presses the change email address button
    const handleOnChangeEmailPress = () => {
        navigation.navigate('ChangeEmailAddress');
    }

    //Handle when the user presses the change phone number button
    const handleOnChangePhonePressed = () => {
        navigation.navigate('ChangePhoneNumber');
    }

    return(
        <SafeAreaView style={styles.safeArea}>
            <View>
                <Dialog.Container visible={dialogVisible}>
                    <Dialog.Title style={styles.dialogTitle}>Are You Sure?</Dialog.Title>
                    <Dialog.Button style={styles.cancelDialog} label="Cancel" onPress={(() => handleNoDialog())} />
                    <Dialog.Button style={styles.signOutDialog} label="Sign Out" onPress={() => handleYesDialog()} />

                </Dialog.Container>
            </View>
            <View style={styles.container}>
                <View style={styles.titlesContainer}>
                    <Text style={styles.justYouHeader}>Just You</Text>
                </View>
                    <ArrowBackButton
                        onPress={handleOnArrowPress}
                    />
                <Text style={styles.settingsTitle}>Settings</Text>
                <View style={styles.settingsContainer1}>
                    <View style={styles.paymentsRow}>
                        <TouchableOpacity
                            //onPress={() => handleOnEditProfilePressed()}
                        >
                            <Text style={styles.paymentsTitle}>Methods of payment</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.arrowButton}
                            //onPress={() => handleOnEditProfilePressed()}
                        >
                            <Image
                                source={require('../../../images/arrowButton.png')}
                                style={styles.arrowImage}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.changeEmailRow}>
                        <TouchableOpacity
                            onPress={() => handleOnChangeEmailPress()}
                        >
                            <Text style={styles.changeEmailTitle}>Change email address</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.arrowButton}
                            onPress={() => handleOnChangeEmailPress()}
                        >
                            <Image
                                source={require('../../../images/arrowButton.png')}
                                style={styles.arrowImage}
                                onPress={() => handleOnChangeEmailPress()}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.changePhoneRow}>
                        <TouchableOpacity
                            onPress={() => handleOnChangePhonePressed()}
                        >
                            <Text style={styles.changePhoneTitle}>Change phone number</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.arrowButton}
                            onPress={() => handleOnChangePhonePressed()}
                        >
                            <Image
                                source={require('../../../images/arrowButton.png')}
                                style={styles.arrowImage}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.settingsContainer2}>
                    <View style={styles.policyrow}>
                        <TouchableOpacity
                            //onPress={() => handleOnEditProfilePressed()}
                        >
                            <Text style={styles.policytitle}>Privacy policy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.arrowButton}
                            //onPress={() => handleOnEditProfilePressed()}
                        >
                            <Image
                                source={require('../../../images/arrowButton.png')}
                                style={styles.arrowImage}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.termsRow}>
                        <TouchableOpacity>
                            <Text style={styles.termsTitle}>Terms & Conditions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.arrowButton}>
                            <Image
                                source={require('../../../images/arrowButton.png')}
                                style={styles.arrowImage}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.signOutRow}>
                        <TouchableOpacity
                            onPress={() => handleOnSignOutPress()}
                        >
                            <Text style={styles.signOutTitle}>Sign out</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.arrowButton}
                            onPress={() => handleOnSignOutPress()}
                        >
                            <Image
                                source={require('../../../images/arrowButton.png')}
                                style={styles.arrowImage}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'white',
        flex: 1
    },
    dialogTitle: {
        fontWeight: 'bold',
        fontSize: 20
    },
    dialogContent: {
        fontSize: 18
    },
    cancelDialog: {
        color: 'black'
    },
    signOutDialog: {
        color: 'red',
        fontWeight: 'bold'
    },
    container: {
        flex: 1
    },
    titlesContainer: {
        alignItems: 'center',
    },
    justYouHeader: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    partnerText: {
        color: 'deepskyblue',
        fontWeight: 'bold',
        fontSize: 20
    },
    arrowBackButton: {
        alignItems: 'flex-start',
        marginLeft: 15
    },
    settingsTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 25,

    },
    settingsContainer1: {
        marginTop: 30,
        borderTopWidth: 2,
        borderTopColor: 'lightgrey'
    },
    arrowImage: {
        height: 15,
        marginTop: 8
    },
    arrowButton: {

    },
    paymentsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
        height: 35,
        alignItems: 'center'
    },
    paymentsTitle: {
        fontSize: 20,
        marginLeft: 20,
    },
    editProfileButton: {

    },
    changeEmailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
        height: 35,
        alignItems: 'center'
    },
    changeEmailTitle: {
        fontSize: 20,
        marginLeft: 20,
    },
    reviewsButton: {

    },
    changePhoneRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
        height: 35,
        alignItems: 'center'
    },
    changePhoneTitle: {
        fontSize: 20,
        marginLeft: 20,
    },
    disableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
        height: 35,
        alignItems: 'center'
    },
    disableTitle: {
        fontSize: 20,
        marginLeft: 20,
    },
    customerServicesButton: {

    },
    settingsContainer2: {
        marginTop: 100,
        borderTopWidth: 2,
        borderTopColor: 'lightgrey',
    },
    policyrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
        height: 35,
        alignItems: 'center'
    },
    policytitle: {
        fontSize: 20,
        marginLeft: 20,
    },
    termsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
        height: 35,
        alignItems: 'center'
    },
    termsTitle: {
        fontSize: 20,
        marginLeft: 20,
    },
    signOutRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
        height: 35,
        alignItems: 'center'
    },
    signOutTitle: {
        fontSize: 20,
        marginLeft: 20,
    },


});

export default Settings;
