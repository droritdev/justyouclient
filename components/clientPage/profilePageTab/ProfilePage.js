import React, {useContext, useState, useEffect, useReducer} from 'react';
import { Button, Text, View, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import FastImage from 'react-native-fast-image'
import auth from '@react-native-firebase/auth';

import {ClientContext} from '../../../context/ClientContext';

//The client's profile page area page
const ProfilePage = ({navigation}) => {

    const [initializing, setInitializing] = useState(false);
    const [user, setUser] = useState();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState("");

    const {dispatchClientObject} = useContext(ClientContext);
    const {dispatchClientId} = useContext(ClientContext);
    const [clientObjectToPass, setClientObjectToPass] = useState([]);
    const [clientIdToPass, setClientIdToPass] = useState('[]');

    const [pendingOrdersArrived, setPendingOrdersArrived] = useState([]);
    const [approvedOrdersArrived, setApprovedOrdersArrived] = useState([]);

    var ordersHistoryTrainerArrayToPush = [];
    const [ordersHistoryTrainerArray, setOrdersHistoryTrainerArray] = useState([]);

    const forceUpdate = useReducer(bool => !bool)[1];//Page refresh 


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

    const getClientOrders = (clientId) => {
        console.log(clientId)
        axios
        .get('/orders/by-client-id/'+clientId, 
        config
        )
        .then((doc) => {
            var allOrders = doc.data;
            var pendingOrders = [];
            var approvedOrders = [];
            

            for (let index = 0; index < allOrders.length; index++) {
                const singleOrder = allOrders[index];
                if (singleOrder.status === "pending") {
                    pendingOrders.push(singleOrder);
                    

                } else if (singleOrder.status === "approved") {
                    approvedOrders.push(singleOrder);
                    
                }
            }
            
            getTrainerFromRecentOrders(approvedOrders);
            setPendingOrdersArrived(pendingOrders);
            setApprovedOrdersArrived(approvedOrders);
        })
        .catch((err) => {
            console.log(err);
        });
    }


    

    //First off all, the component loads the user details from the data base and sets the variables to the data
    useEffect(() => {

        forceUpdate();

        const subscriber = auth().onAuthStateChanged((user) => {
                    // console.log('🚨userStatus:' , user)
                    setUser(user);

                    if(user){
                        setInitializing(true);
                        
                        
                        axios
                        .get('/clients/'
                        +user.email.toLocaleLowerCase(),
                        config
                    )
                    .then((doc) => {
                        if(doc) {
                          const currectUserData = doc.data[0];
                          setFirstName(currectUserData.name.first);
                          setLastName(currectUserData.name.last);
                          setProfileImageUrl(currectUserData.image);
                          setClientIdToPass(doc.data[0]._id);
                          setClientObjectToPass(doc.data[0]);

                          dispatchClientObject({
                            type: 'SET_CLIENT_OBJECT',
                            clientObject : doc.data[0]
                            });
                            //for filling the recent orders scrollView
                           getClientOrders(doc.data[0]._id);  
                          
                        }
                      })
                    .catch((err) => console.log(err));
                    }else{
                        setInitializing(true);
                    }

        
         });
         

         return subscriber; // unsubscribe on unmount

    } ,[]);

    //run for all approved orders to get trainer id
    //using func as async for waiting trainers array to fill from MongoDB
    const getTrainerFromRecentOrders = async (ordersHistoryArray) => {
        
        for (let index = 0; index < ordersHistoryArray.length; index++) {
            const trainerID = ordersHistoryArray[index].trainer.id;
            //waiting for trainer to come from mongo for each order
            await getTrainerFromMongoDB(trainerID);
            //when for loop is ended fill the scrollView (set the scrollView array)
            if(index === ordersHistoryArray.length-1 ){
                setOrdersHistoryTrainerArray(ordersHistoryTrainerArrayToPush);
            }
        }

                
        
    }
    //getting the trainer from mongoDb => recent orders use
    const getTrainerFromMongoDB = async (trainerID) => {
        await axios
                    .get('/trainers/id/'
                    +trainerID,
                    config
                )
                .then((doc) => {
                    if(doc) {
                        //filling the the array
                        ordersHistoryTrainerArrayToPush.push(doc.data);
                    }
                  })
                .catch((err) => console.log(err));
    }

    //Load trainer star rating
    const getStarRating = (reviews) => {
        if (reviews.length === 0) {
            setStarRating(0);
        } else {
            var sumStars = 0;
            for (let index = 0; index < reviews.length; index++) {
                const singleReviewStar = reviews[index].stars;
                sumStars += Number(singleReviewStar);
            }
            return ((sumStars/reviews.length).toFixed(1));
        }
    }

    //scrollView of trainers (working like flatList)
    const getApprovedOrdersPattern = () => {
        let repeats = [];
        if (ordersHistoryTrainerArray !== []) {
            for(let i = 0; i < ordersHistoryTrainerArray.length; i++) {
                //pushing each trainer UI into the array
                repeats.push(
                    <TouchableOpacity 
                        key = {'ordersRow' + i}
                        onPress={() => handleArrowApprovedPressed(i)}
                        >

                        <View style={styles.trainerView}>
                            <View style={styles.trainerImageView}>
                                <TouchableOpacity>
                                    <FastImage
                                        style={styles.trainerImage}
                                        source={{
                                            uri: ordersHistoryTrainerArray[i].media.images[0],
                                            priority: FastImage.priority.normal,
                                                }}
                                        resizeMode={FastImage.resizeMode.stretch}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={styles.trainerPreviewText}
                            >
                                <Text style={styles.trainerText1}>{ordersHistoryTrainerArray[i].name.first +' '+ordersHistoryTrainerArray[i].name.last}</Text>
                                <Text style={styles.trainerText2}>Personal Trainer</Text>
                                <View style={styles.ratingRow}>
                                    <Text style={styles.trainerText3}>{getStarRating(ordersHistoryTrainerArray[i].reviews)} </Text>
                                    <Image 
                                        source={require('../../../images/ratingStar.png')}
                                        style={styles.starIcon}
                                    />
                                </View>
                            </View>
                        </View>
                        
                    </TouchableOpacity>
                )
            }
        }
        return repeats;
    };

    


    //Handle when the user presses the ConfirmedOrders button
    const handleOnConfirmedOrdersPRessed = () => {
        dispatchClientId({
            type: 'SET_CLIENT_ID',
            clientId : clientIdToPass
        });

        dispatchClientObject({
            type: 'SET_CLIENT_OBJECT',
            clientObject : clientObjectToPass
        });

       
        navigation.navigate('PendingApprovalOrders');}

    //Handle when the user presses the PendingOrders button
    const handleOnPendingOrdersPRessed = () => {
        
        dispatchClientId({
            type: 'SET_CLIENT_ID',
            clientId : clientIdToPass
        });

        dispatchClientObject({
            type: 'SET_CLIENT_OBJECT',
            clientObject : clientObjectToPass
        });

        
        navigation.navigate('PendingApprovalOrders');
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
                    
                    <View style={styles.nameAndDetailsView}>        
                        <View style={styles.detailsRow}>
                            <View style={styles.credits}>
                                <Text style={styles.creditValue}>0.00</Text>
                                <Text style={styles.creditText}>Credit (USD)</Text>
                            </View>
                            <View style={styles.confirmedOrders}>
                                <Text style={styles.confirmedOrdersValue}>{approvedOrdersArrived.length}</Text>
                                <TouchableOpacity
                                    onPress={() => handleOnConfirmedOrdersPRessed()}
                                >
                                    <Text style={styles.confirmedOrdersText}>Approved Orders</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.pandingOrders}>
                                <Text style={styles.pandingOrdersValue}>{pendingOrdersArrived.length}</Text>
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
                        {getApprovedOrdersPattern()}
                        
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
        height: Dimensions.get('window').height * .0745,
        backgroundColor: 'gainsboro',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
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