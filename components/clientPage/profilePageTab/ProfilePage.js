import React, {useContext, useState, useEffect, useReducer} from 'react';
import { Button, Text, View, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import FastImage from 'react-native-fast-image'
import auth from '@react-native-firebase/auth';



import {EmailContext} from '../../../context/EmailContext';
import {NameContext} from '../../../context/NameContext';
import {ClientContext} from '../../../context/ClientContext';

//The client's profile page area page
const ProfilePage = ({navigation}) => {

    const [initializing, setInitializing] = useState(false);
    const [user, setUser] = useState();


    // const {emailAddress} = useContext(EmailContext);
    const [emailAddress, setEmailAddress] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState("");

    const {dispatchClientObject} = useContext(ClientContext);
    const {clientId, dispatchClientId} = useContext(ClientContext);
    const [clientObject, setClientObject] = useState([]);
    const [clientIdToPass, setClientIdToPass] = useState('[]');

    const [pendingOrders, setPendingOrders] = useState([]);
    const [approvedOrders, setApprovedOrders] = useState([]);

    const forceUpdate = useReducer(bool => !bool)[1];//Page refresh 


    // var clientIdToPass = ''

    // forceUpdate();

    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
      }
    
    


    const config = {
        withCredentials: true,
        baseURL: 'http://localhost:3000/',
        headers: {
          "Content-Type": "application/json",
        },
    };

    const getClientOrders = () => {
        console.log('clientId: in pending:' + clientId)

        axios
        .get('/orders/by-client-id/'+clientId, 
        config
        )
        .then((doc) => {
            var allOrders = doc.data;
            var pendingOrders = [];
            var approvedOrders = [];
            console.log('****************doc.data*****************');
            console.log(doc.data);

            for (let index = 0; index < allOrders.length; index++) {
                const singleOrder = allOrders[index];
                if (singleOrder.status === "pending") {
                    pendingOrders.push(singleOrder);
                } else if (singleOrder.status === "approved") {
                    approvedOrders.push(singleOrder);
                }
            }

            // pendingOrders = sortOrders(pendingOrders);
            // approvedOrders = sortOrders(approvedOrders);

            setPendingOrders(pendingOrders);
            setApprovedOrders(approvedOrders);
            forceUpdate();
        })
        .catch((err) => {
            console.log(err);
        });
    }


    const getUserFromMongoDB = () => {
        axios
                        .get('/clients/'
                        +emailAddress.toLocaleLowerCase(),
                        config
                    )
                    .then((doc) => {
                        if(doc) {
                        //   const currectUserData = doc.data[0];
                        //   setFirstName(currectUserData.name.first);
                        //   setLastName(currectUserData.name.last);
                        //   setProfileImageUrl(currectUserData.image);
                        //   clientObjectToPass = doc.data[0];
                        console.log(doc.data[0]);
                          dispatchClientObject({
                            type: 'SET_CLIENT_OBJECT',
                            clientObject : doc.data[0]
                        });
                        //   setClientObject(currectUserData);
                        
                        //   console.log(profileImageUrl);
                          if(doc.data[0].email!=null){
                            
                          }
                        }
                      })
                    .catch((err) => console.log(err));
                    }
        
    

    //First off all, the component loads the user details from the data base and sets the variables to the data
    useEffect(() => {

        forceUpdate();

        const subscriber = auth().onAuthStateChanged((user) => {
                    // console.log('🚨userStatus:' , user)
                    setUser(user);
                    // getUserFromMongoDB();

                    if(user){
                        setInitializing(true);
                        // setEmailAddress(user.email); 
                        
                        
                        axios
                        .get('/clients/'
                        +user.email.toLocaleLowerCase(),
                        config
                    )
                    .then((doc) => {
                        if(doc) {
                          console.log("doc.data" , doc.data);
                          const currectUserData = doc.data[0];
                          setFirstName(currectUserData.name.first);
                          setLastName(currectUserData.name.last);
                          setProfileImageUrl(currectUserData.image);
                        //   clientIdToPass = doc.data[0]._id
                          setClientIdToPass(doc.data[0]._id);
                          console.log('clientIdToPass: '+ clientIdToPass)

                          dispatchClientObject({
                            type: 'SET_CLIENT_OBJECT',
                            clientObject : doc.data[0]
                        });
                          if(doc.data[0].email!=null){
                            
                          }
                        }
                      })
                    .catch((err) => console.log(err));
                    }else{
                        setInitializing(true);
                    }

                    

                 
                 
        // auth().onAuthStateChanged((user) => {
        //     if (user === null){
        //         console.log('userStatus:' , user)
        //         }else{
        //         setEmailAddress(user.email); 
        //         console.log('🚨firebase: ' + user.email);

        //         axios
        //         .get('/clients/'
        //         +emailAddress.toLocaleLowerCase(),
        //         config
        //     )
        //     .then((doc) => {
        //         if(doc) {
        //           console.log("doc.data" , doc.data);
        //           const currectUserData = doc.data[0];
        //           setFirstName(currectUserData.name.first);
        //           setLastName(currectUserData.name.last);
        //           setProfileImageUrl(currectUserData.image);
        //           console.log(profileImageUrl);
        //           if(doc.data[0].email!=null){
                    
        //           }
        //         }
        //       })
        //     .catch((err) => console.log(err))
            // }   
        
         });
         getClientOrders();

         return subscriber; // unsubscribe on unmount

    } ,[]);


    if(user){
        // getUserFromMongoDB();
        
    }
    // dispatchClientObject({
    //     type: 'SET_CLIENT_OBJECT',
    //     ClientObject: clientObject
    // });

    

    

    

    //Handle when the user presses the ConfirmedOrders button
    const handleOnConfirmedOrdersPRessed = () => {
        dispatchClientId({
            type: 'SET_CLIENT_ID',
            clientId : clientIdToPass
        });
        navigation.navigate('PendingOrders' );    }

    //Handle when the user presses the PendingOrders button
    const handleOnPendingOrdersPRessed = () => {
        
        dispatchClientId({
            type: 'SET_CLIENT_ID',
            clientId : clientIdToPass
        });
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
        // initializing?
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Just You</Text>
                </View>
                <Text style={styles.helloUserTitle}> {firstName} {lastName}</Text>
                <View style={styles.imageAndDetailsRow}>
                <TouchableOpacity >
                    <FastImage
                        style={styles.profileImage}
                        source={{
                            uri: profileImageUrl,
                            priority: FastImage.priority.normal,
                                }}
                        resizeMode={FastImage.resizeMode.stretch}
                    />
              </TouchableOpacity>
                    {/* <View
                        style={styles.imageView}
                        
                    >
                        <TouchableOpacity>
                            <Image
                                //  source={profileImage}

                            />
                        </TouchableOpacity>
                    </View> */}
                    <View style={styles.nameAndDetailsView}>        
                        <View style={styles.detailsRow}>
                            <View style={styles.credits}>
                                <Text style={styles.creditValue}>0.00</Text>
                                <Text style={styles.creditText}>Credit (USD)</Text>
                            </View>
                            <View style={styles.confirmedOrders}>
                                <Text style={styles.confirmedOrdersValue}>{approvedOrders.length}</Text>
                                <TouchableOpacity
                                    onPress={() => handleOnConfirmedOrdersPRessed()}
                                >
                                    <Text style={styles.confirmedOrdersText}>Approved Orders</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.pandingOrders}>
                                <Text style={styles.pandingOrdersValue}>{pendingOrders.length}</Text>
                                <TouchableOpacity
                                    onPress={() => handleOnPendingOrdersPRessed()}
                                >
                                    <Text style={styles.pandingOrdersText}>Pending Orders</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.sectionContainer}>
                    <Text style={styles.inPageMainTitles}>Choices I Liked</Text>
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
                <View style={styles.pageMainTitlesContainer}>
                    <Text style={styles.inPageSubMainTitles}>Links</Text>
                       <View style={styles.linksRowsContainer}></View> 
                        <View style={styles.eachRowContainer}>
                            <View style={styles.navigationsRows}>
                                <TouchableOpacity
                                    onPress={() => handleOnInvitePressed()}
                                >
                                    <Text style={styles.navigationsRowsTitle}>Receive credit by inviting friends</Text>
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
                        <View style={styles.eachRowContainer}>
                            <View style={styles.navigationsRows}>
                                <TouchableOpacity
                                    onPress={() => handleOnReceiptsHistoryPressed()}
                                >
                                    <Text style={styles.navigationsRowsTitle}>Receipts History</Text>
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
                <View style={styles.sectionContainer}>
                    <View style={styles.recentAndHistoryRow}>
                        <Text style={styles.inPageMainTitles}>Recent Orders</Text>
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
                <View style={styles.pageMainTitlesContainer}>
                   <Text style={styles.inPageSubMainTitles}>More</Text>
                    <View style={styles.moreRowsContainer}>
                            <View style={styles.eachRowContainer}>
                                <View style={styles.navigationsRows}>
                                    <TouchableOpacity
                                        onPress={() => handleOnEditProfilePressed()}
                                    >
                                        <Text style={styles.navigationsRowsTitle}>Edit Profile</Text>
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
                            <View style={styles.eachRowContainer}>
                                <View style={styles.navigationsRows}>
                                    <TouchableOpacity
                                        onPress={() => handleOnCustomerServicePressed()}    
                                    >
                                        <Text style={styles.navigationsRowsTitle}>Customer Service</Text>
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
                            <View style={styles.eachRowContainer}>
                                <View style={styles.navigationsRows}>
                                    <TouchableOpacity
                                        onPress={() => handleOnSettingsPressed()}
                                    >
                                        <Text style={styles.navigationsRowsTitle}>Settings</Text>
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
        fontSize: Dimensions.get('window').height * .04,
        fontWeight: 'bold'
    },
    helloUserTitle: {
        fontWeight: 'bold',
        marginTop: Dimensions.get('window').height * .040,
        fontSize: Dimensions.get('window').height * .03,
        marginLeft: Dimensions.get('window').width * .03,
    },
    imageAndDetailsRow: {
        flexDirection: 'row',
        height: Dimensions.get('window').height * .11,
        width: Dimensions.get('window').width * .95,
        alignSelf: 'center',
        marginTop: Dimensions.get('window').height * .01,
        alignItems: 'center'
    },
    profileImage: {
        marginTop: Dimensions.get('window').height * 0.015,
        marginLeft: Dimensions.get('window').height * 0.01,
        width: Dimensions.get('window').width * .200,
        height: Dimensions.get('window').height * .095,
        overflow: 'hidden',
        borderRadius: 70,
    },
    nameAndDetailsView: {
        justifyContent: 'space-between',
        height: Dimensions.get('window').height * .095,
    },
    detailsRow: {
        marginTop: Dimensions.get('window').height * .035,
        flexDirection: 'row',
        width: Dimensions.get('window').width * .65,
        justifyContent: 'space-between',
        marginLeft: Dimensions.get('window').width * .045,
    },
    credits: {
        alignItems: 'center'
    },
    creditValue: {
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .017,
    },
    creditText: {
    },
    confirmedOrders: {
        alignItems: 'center',
        width: Dimensions.get('window').width * .200,
    },
    confirmedOrdersValue: {
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .017,
    },
    confirmedOrdersText: {
        textAlign: 'center',
        color: 'deepskyblue',
        fontWeight: 'bold'
    },
    pandingOrders: {
        alignItems: 'center',
        width: Dimensions.get('window').width * .200
    },
    pandingOrdersValue: {
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .017,
    },
    pandingOrdersText: {
        textAlign: 'center',
        color: 'deepskyblue',
        fontWeight: 'bold'
    },
    sectionContainer: {
        marginTop: Dimensions.get('window').height * .035,
        marginLeft: Dimensions.get('window').width * .045
    },
    inPageMainTitles: {
        marginTop: Dimensions.get('window').height * .0150,
        marginLeft: Dimensions.get('window').width * .010,
        fontSize: Dimensions.get('window').height * .0225,
        fontWeight: 'bold'
    },
    inPageSubMainTitles: {
        marginLeft: Dimensions.get('window').width * .05,
        fontSize: Dimensions.get('window').height * .0225,
        fontWeight: 'bold'
    },
    likesScrollView: {
        marginTop: Dimensions.get('window').height * .01,
    },
    trainerView: {
        marginRight: Dimensions.get('window').width * .017,
        height: Dimensions.get('window').height * .125,
        width: Dimensions.get('window').width * .3,
        borderWidth: 2,
        borderColor: 'gainsboro',
        borderRadius: 17
    },
    trainerImageView: {
        height: Dimensions.get('window').height * .0745,
        backgroundColor: 'gainsboro',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },
    trainerImage: {

    },
    trainerPreviewText: {
        height: Dimensions.get('window').height * .045,
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width * .3,
    },
    trainerText1: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    trainerText2: {
        fontSize: Dimensions.get('window').height * .010,
        textAlign: 'center'
    },
    ratingRow: {
        flexDirection: 'row'
    },
    trainerText3: {
        fontSize: Dimensions.get('window').height * .010,
        textAlign: 'center'
    },
    starIcon: {
        height: Dimensions.get('window').height * .01,
        width: Dimensions.get('window').width * .017,
        alignSelf: 'center'
    },
    pageMainTitlesContainer: {
        marginTop: Dimensions.get('window').height * .030,
    },
    linksTitle: {
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .0225,
        marginLeft: Dimensions.get('window').width * .05,
    },
    linksRowsContainer:{
        marginTop:Dimensions.get('window').height * .01,
    },
    moreRowsContainer:{
        marginTop:Dimensions.get('window').height * .035,
    },
    eachRowContainer: {
        height: Dimensions.get('window').height * .04,
        justifyContent: 'center',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
    },
    arrowImage: {
        height: Dimensions.get('window').height * .015,
        marginTop: Dimensions.get('window').height * .005,
    },
    arrowButton: {
        
    },
    navigationsRows: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    navigationsRowsTitle: {
        fontSize: Dimensions.get('window').height * .02,
        marginLeft: Dimensions.get('window').width * .05,
    },
    receiptsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    
    recentOrdersSectionContainer: {
        marginTop: Dimensions.get('window').height * .02,
        marginLeft: Dimensions.get('window').width * .05,
    },
    recentAndHistoryRow: {
        marginRight: Dimensions.get('window').width * .05,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Dimensions.get('window').width * .90,
        alignSelf: 'center'
    },
    historyText: {
        marginTop:  Dimensions.get('window').height * .015,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'deepskyblue' 
    },
    recentOrdersScrollView: {
        marginTop: Dimensions.get('window').height * .005,
    }
});

export default ProfilePage;