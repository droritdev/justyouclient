import React, {useContext, useEffect} from 'react';
import { Button, Text, View, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

import {NameContext} from '../../../context/NameContext';

//The client's profile page area page
const StarPage = ({navigation}) => {

    const {firstName, dispatchFirst} = useContext(NameContext);
    const {lastName, dispatchLast} = useContext(NameContext);

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

                dispatchLast({
                    type: 'SET_LAST_NAME',
                    lastName: doc.data[0].name.last
                })
            }
            else{
                alert("No trainer");
            }
        })
        .then(() => {

        })
        .catch((err) => alert(err))
    }
    ,[])

    //Handle when the user presses the ConfirmedOrders button
    const handleOnConfirmedOrdersPRessed = () => {
        navigation.navigate('ConfirmedOrders');
    }

    //Handle when the user presses the PendingOrders button
    const handleOnPendingOrdersPRessed = () => {
        navigation.navigate('PendingOrders');
    }

    //Handle when the user presses the Invite friends button
    const handleOnInvitePressed = () => {
        navigation.navigate('ComingSoon');
    }

    //Handle when the user presses the Receipts history button
    const handleOnReceiptsHistoryPressed = () => {
        navigation.navigate('ReceiptsHistory');
    }

    //Handle when the user presses the History button
    const handleOnHistoryPressed = () => {
        navigation.navigate('History');
    }

    //Handle when the user presses the Edit profile button
    const handleOnEditProfilePressed = () => {
        navigation.navigate('EditProfile');
    }

    //Handle when the user presses the CustomerService button
    const handleOnCustomerServicePressed = () => {
        navigation.navigate('CustomerService');
    }

    //Handle when the user presses the Settings button
    const handleOnSettingsPressed = () => {
        navigation.navigate('Settings');
    }
    
    return(
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Just You</Text>
                </View>
                <Text style={styles.helloUserTitle}>Hello {firstName}</Text>
                <View style={styles.imageAndDetailsRow}>
                    <View
                        style={styles.imageView}
                    >
                        <TouchableOpacity>
                            <Image

                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.nameAndDetailsView}>        
                        <Text style={styles.clientNameTitle}>{firstName} {lastName}</Text>
                        <View style={styles.detailsRow}>
                            <View style={styles.credits}>
                                <Text style={styles.creditValue}>0.00</Text>
                                <Text style={styles.creditText}>Credit (USD)</Text>
                            </View>
                            <View style={styles.confirmedOrders}>
                                <Text style={styles.confirmedOrdersValue}>1</Text>
                                <TouchableOpacity
                                    onPress={() => handleOnConfirmedOrdersPRessed()}
                                >
                                    <Text style={styles.confirmedOrdersText}>Confirmed Orders</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.pandingOrders}>
                                <Text style={styles.pandingOrdersValue}>1</Text>
                                <TouchableOpacity
                                    onPress={() => handleOnPendingOrdersPRessed()}
                                >
                                    <Text style={styles.pandingOrdersText}>Panding Orders</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.likesSectionContainer}>
                    <Text style={styles.likesTitle}>Choices I Liked</Text>
                    <ScrollView 
                        style={styles.likesScrollView} 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={styles.trainerView}>
                            <View style={styles.trainerImageView}>
                                <TouchableOpacity>
                                    <Image
                                        style={styles.trainerImage}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={styles.trainerPreviewText}
                            >
                                <Text style={styles.trainerText1}>Judi Woods</Text>
                                <Text style={styles.trainerText2}>Personal Trainer</Text>
                                <View style={styles.ratingRow}>
                                    <Text style={styles.trainerText3}>8.7 </Text>
                                    <Image 
                                        source={require('../../../images/ratingStar.png')}
                                        style={styles.starIcon}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.trainerView}>
                            <View style={styles.trainerImageView}>
                                <TouchableOpacity>
                                    <Image
                                        style={styles.trainerImage}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={styles.trainerPreviewText}
                            >
                                <Text style={styles.trainerText1}>Judi Woods</Text>
                                <Text style={styles.trainerText2}>Personal Trainer</Text>
                                <View style={styles.ratingRow}>
                                    <Text style={styles.trainerText3}>8.7 </Text>
                                    <Image 
                                        source={require('../../../images/ratingStar.png')}
                                        style={styles.starIcon}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.trainerView}>
                            <View style={styles.trainerImageView}>
                                <TouchableOpacity>
                                    <Image
                                        style={styles.trainerImage}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={styles.trainerPreviewText}
                            >
                                <Text style={styles.trainerText1}>Judi Woods</Text>
                                <Text style={styles.trainerText2}>Personal Trainer</Text>
                                <View style={styles.ratingRow}>
                                    <Text style={styles.trainerText3}>8.7 </Text>
                                    <Image 
                                        source={require('../../../images/ratingStar.png')}
                                        style={styles.starIcon}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.trainerView}>
                            <View style={styles.trainerImageView}>
                                <TouchableOpacity>
                                    <Image
                                        style={styles.trainerImage}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={styles.trainerPreviewText}
                            >
                                <Text style={styles.trainerText1}>Judi Woods</Text>
                                <Text style={styles.trainerText2}>Personal Trainer</Text>
                                <View style={styles.ratingRow}>
                                    <Text style={styles.trainerText3}>8.7 </Text>
                                    <Image 
                                        source={require('../../../images/ratingStar.png')}
                                        style={styles.starIcon}
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.linksContainer}>
                    <Text style={styles.linksTitle}>Links</Text>
                    <View style={styles.rowContainer}>
                        <View style={styles.inviteRow}>
                            <TouchableOpacity
                                onPress={() => handleOnInvitePressed()}
                            >
                                <Text style={styles.inviteTitle}>Receive credit by inviting friends</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.inviteButton}
                                onPress={() => handleOnInvitePressed()}
                            >
                                <Image
                                    source={require('../../../images/arrowButton.png')}
                                    style={styles.arrowImage}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <View style={styles.receiptsRow}>
                            <TouchableOpacity
                                onPress={() => handleOnReceiptsHistoryPressed()}
                            >
                                <Text style={styles.receiptssTitle}>Receipts History</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.arrowButton}
                                onPress={() => handleOnReceiptsHistoryPressed()}
                            >
                                <Image
                                    source={require('../../../images/arrowButton.png')}
                                    style={styles.arrowImage}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.recentOrdersSectionContainer}>
                    <View style={styles.recentAndHistoryRow}>
                        <Text style={styles.recentOrdersTitle}>Recent Orders</Text>
                        <TouchableOpacity
                            onPress={() => handleOnHistoryPressed()}
                        >
                            <Text style={styles.historyText}>History</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView 
                        style={styles.recentOrdersScrollView} 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={styles.trainerView}>
                            <View style={styles.trainerImageView}>
                                <TouchableOpacity>
                                    <Image
                                        style={styles.trainerImage}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={styles.trainerPreviewText}
                            >
                                <Text style={styles.trainerText1}>Judi Woods</Text>
                                <Text style={styles.trainerText2}>Personal Trainer</Text>
                                <View style={styles.ratingRow}>
                                    <Text style={styles.trainerText3}>8.7 </Text>
                                    <Image 
                                        source={require('../../../images/ratingStar.png')}
                                        style={styles.starIcon}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.trainerView}>
                            <View style={styles.trainerImageView}>
                                <TouchableOpacity>
                                    <Image
                                        style={styles.trainerImage}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={styles.trainerPreviewText}
                            >
                                <Text style={styles.trainerText1}>Judi Woods</Text>
                                <Text style={styles.trainerText2}>Personal Trainer</Text>
                                <View style={styles.ratingRow}>
                                    <Text style={styles.trainerText3}>8.7 </Text>
                                    <Image 
                                        source={require('../../../images/ratingStar.png')}
                                        style={styles.starIcon}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.trainerView}>
                            <View style={styles.trainerImageView}>
                                <TouchableOpacity>
                                    <Image
                                        style={styles.trainerImage}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={styles.trainerPreviewText}
                            >
                                <Text style={styles.trainerText1}>Judi Woods</Text>
                                <Text style={styles.trainerText2}>Personal Trainer</Text>
                                <View style={styles.ratingRow}>
                                    <Text style={styles.trainerText3}>8.7 </Text>
                                    <Image 
                                        source={require('../../../images/ratingStar.png')}
                                        style={styles.starIcon}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.trainerView}>
                            <View style={styles.trainerImageView}>
                                <TouchableOpacity>
                                    <Image
                                        style={styles.trainerImage}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={styles.trainerPreviewText}
                            >
                                <Text style={styles.trainerText1}>Judi Woods</Text>
                                <Text style={styles.trainerText2}>Personal Trainer</Text>
                                <View style={styles.ratingRow}>
                                    <Text style={styles.trainerText3}>8.7 </Text>
                                    <Image 
                                        source={require('../../../images/ratingStar.png')}
                                        style={styles.starIcon}
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.moreContainer}>
                    <Text style={styles.moreTitle}>More</Text>
                    <View style={styles.rowContainer}>
                        <View style={styles.editProfileRow}>
                            <TouchableOpacity
                                onPress={() => handleOnEditProfilePressed()}
                            >
                                <Text style={styles.editProfileTitle}>Edit Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.arrowButton}
                                onPress={() => handleOnEditProfilePressed()}
                            >
                                <Image
                                    source={require('../../../images/arrowButton.png')}
                                    style={styles.arrowImage}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <View style={styles.customerServiceRow}>
                            <TouchableOpacity
                                onPress={() => handleOnCustomerServicePressed()}    
                            >
                                <Text style={styles.customerServicesTitle}>Customer Service</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.arrowButton}
                                onPress={() => handleOnCustomerServicePressed()}  
                            >
                                <Image
                                    source={require('../../../images/arrowButton.png')}
                                    style={styles.arrowImage}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <View style={styles.settingsRow}>
                            <TouchableOpacity
                                onPress={() => handleOnSettingsPressed()}
                            >
                                <Text style={styles.settingsTitle}>Settings</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.arrowButton}
                                onPress={() => handleOnSettingsPressed()}
                            >
                                <Image
                                    source={require('../../../images/arrowButton.png')}
                                    style={styles.arrowImage}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={styles.deadAreaBottom}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'white'
    },
    container: {
        backgroundColor: 'white',
        width: Dimensions.get('window').width,
        // height: Dimensions.get('window').height
    },
    header: {
        alignSelf: 'center'
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    helloUserTitle: {
        fontWeight: 'bold',
        fontSize: 22,
        marginLeft: 15
    },
    imageAndDetailsRow: {
        flexDirection: 'row',
        height: 110,
        width: Dimensions.get('window').width * .95,
        alignSelf: 'center',
        marginTop: 15,
        alignItems: 'center'
    },
    imageView: {
        height: 100,
        width: 100,
        borderWidth: 2,
        borderRadius: 60,
        borderColor: 'grey'
    },
    nameAndDetailsView: {
        justifyContent: 'space-between',
        height: 90,
    },
    clientNameTitle: {
        marginLeft: 15,
        fontWeight: 'bold',
        fontSize: 20
    },
    detailsRow: {
        flexDirection: 'row',
        width: Dimensions.get('window').width * .7,
        justifyContent: 'space-between',
        marginLeft: 10
    },
    credits: {
        alignItems: 'center'
    },
    creditValue: {
        fontWeight: 'bold',
        fontSize: 17
    },
    creditText: {
    },
    confirmedOrders: {
        alignItems: 'center',
        width: 75
    },
    confirmedOrdersValue: {
        fontWeight: 'bold',
        fontSize: 17
    },
    confirmedOrdersText: {
        textAlign: 'center',
        color: 'deepskyblue',
        fontWeight: 'bold'
    },
    pandingOrders: {
        alignItems: 'center',
        width: 75
    },
    pandingOrdersValue: {
        fontWeight: 'bold',
        fontSize: 17
    },
    pandingOrdersText: {
        textAlign: 'center',
        color: 'deepskyblue',
        fontWeight: 'bold'
    },
    likesSectionContainer: {
        marginTop: 35,
        marginLeft: 10
    },
    likesTitle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    likesScrollView: {
        marginTop: 10,
    },
    trainerView: {
        marginRight: 5,
        height: Dimensions.get('window').height * .125,
        width: Dimensions.get('window').width * .3,
        borderWidth: 2,
        borderColor: 'gainsboro',
        borderRadius: 20
    },
    trainerImageView: {
        height: '60%',
        backgroundColor: 'gainsboro',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },
    trainerImage: {

    },
    trainerPreviewText: {
        height: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width * .3,
    },
    trainerText1: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    trainerText2: {
        fontSize: 10,
        textAlign: 'center'
    },
    ratingRow: {
        flexDirection: 'row'
    },
    trainerText3: {
        fontSize: 10,
        textAlign: 'center'
    },
    starIcon: {
        height: 10,
        width: 10,
        alignSelf: 'center'
    },
    linksContainer: {
        marginTop: 20,
    },
    linksTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 20,
    },
    rowContainer: {
        height: 40,
        justifyContent: 'center',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
    },
    arrowImage: {
        height: 15,
        marginTop: 8
    },
    arrowButton: {
        
    },
    inviteRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inviteTitle: {
        fontSize: 20,
        marginLeft: 20,
    },
    inviteButton: {

    },
    receiptsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    receiptssTitle: {
        fontSize: 20,
        marginLeft: 20,
    },
    receiptssButton: {

    },
    recentOrdersSectionContainer: {
        marginTop: 35,
        marginLeft: 10
    },
    recentAndHistoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Dimensions.get('window').width * .95,
        alignSelf: 'center'
    },
    recentOrdersTitle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    historyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'deepskyblue' 
    },
    recentOrdersScrollView: {
        marginTop: 10,
    },
    moreContainer: {
        marginTop: 30,
    },
    moreTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 20,
    },
    rowContainer: {
        height: 40,
        justifyContent: 'center',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
    },
    arrowImage: {
        height: 15,
        marginTop: 8
    },
    arrowButton: {
        
    },
    editProfileRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    editProfileTitle: {
        fontSize: 20,
        marginLeft: 20,
    },
    editProfileButton: {

    },
    customerServiceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    customerServicesTitle: {
        fontSize: 20,
        marginLeft: 20,
    },
    customerServicesButton: {

    },
    settingsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    settingsTitle: {
        fontSize: 20,
        marginLeft: 20,
    },
    settingsButton: {
    },
});

export default StarPage;