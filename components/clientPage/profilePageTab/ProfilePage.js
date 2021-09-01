import React, {useContext, useState, useEffect, useReducer, useRef} from 'react';
import { Button, Text, View, StyleSheet, ScrollView, Dimensions, Image, Modal, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import FastImage from 'react-native-fast-image'
import auth from '@react-native-firebase/auth';
import DropdownAlert from 'react-native-dropdownalert';
import Icon from 'react-native-vector-icons/Feather';
import * as Progress from 'react-native-progress';

import TrainerItem from '../../GlobalComponents/TrainerItem';
import {ClientContext} from '../../../context/ClientContext';
import {TrainerContext} from '../../../context/TrainerContext';
import { OrderContext } from '../../../context/OrderContext';
import History from './History';

//The client's profile page area page
const ProfilePage = ({ navigation }) => {
    const [doc, setDoc] = useState()
    let reviewsArray = []

    const [initializing, setInitializing] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');

    const { dispatchClientObject } = useContext(ClientContext);
    const { dispatchClientId } = useContext(ClientContext);
    const [clientObjectToPass, setClientObjectToPass] = useState([]);
    const [clientIdToPass, setClientIdToPass] = useState('[]');
    // dispatch trainer values for use in TrainerOrderPage
    const { dispatchTrainerObject } = useContext(TrainerContext);
    const { orderEndTime, dispatchOrderEndTime } = useContext(OrderContext);

    const [pendingOrdersArrived, setPendingOrdersArrived] = useState([]);
    const [approvedOrdersArrived, setApprovedOrdersArrived] = useState([]);

    let ordersHistoryTrainerArrayToPush = [];
    const [ordersHistoryTrainerArray, setOrdersHistoryTrainerArray] = useState([]);
    const [completedOrdersToPass, setCompletedOrdersToPass] = useState([]);
    const [noRecentOrders, setNoRecentOrders] = useState('none');
    const [isLoadingFinish, setIsLoadingFinish] = useState(false);

    //ref to show covid alert
    let dropDownAlertRef = useRef(null);
    //Modal to display for covid-19 alert tap
    const [covidModalVisible, setCovidModalVisible] = useState(false);


    const config = {
        withCredentials: true,
        baseURL: 'http://localhost:3000/',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const renderItem = ({ item }) => (
        <TrainerItem
          name={`${item.name.first} ${item.name.last}`}
          media={item.media}
          trainerObject={item}
          reviewsArray = {item.reviews}
          handleOnTrainerPressed = {handleOnTrainerPressed}
        />
    )

    useEffect(() => {
        axios
          .get('/trainers/getAllTrainers', config)
          .then((doc) => {
            console.log('in getalltrainers then')
            if (doc) {
              console.log('in getalltrainers then if doc ', doc.data)
              setDoc(doc.data)
            }
          })
          .catch((err) => {
              console.log('in getalltrainers catch err', err)
          })
    }, [])

    const getClientOrders = async (clientId) => {
        console.log(clientId);
        await axios
          .get('/orders/by-client-id/' + clientId,
            config,
          )
          .then((doc) => {
              let allOrders = doc.data;
              let pendingOrders = [];
              let approvedOrders = [];
              let completedOrders = [];


              for (let index = 0; index < allOrders.length; index++) {
                  console.log("getClientOrders: allOrders - " + allOrders[index].status);
                  const singleOrder = allOrders[index];
                  if (singleOrder.status === 'pending') {
                      pendingOrders.push(singleOrder);
                  }
                  if (singleOrder.status === 'approved') {
                      approvedOrders.push(singleOrder);

                  } else if (singleOrder.status === 'completed') {
                      completedOrders.push(singleOrder);
                  }

              }
              console.log("getClientOrders: " + completedOrders.toString());
              getAllTrainersInfo(completedOrders);
              setPendingOrdersArrived(pendingOrders);
              setApprovedOrdersArrived(approvedOrders);
              setCompletedOrdersToPass(completedOrders);
          })
          .catch((err) => {
              console.log(err);
          });
    };



    const getUserByFirebaseAuth = () => {
        const subscriber = auth().onAuthStateChanged((user) => {
            console.log('🚨userStatus:', user);
            if (user) {
                setInitializing(true);
                axios
                  .get('/clients/'
                    + user.email.toLocaleLowerCase(),
                    config,
                  )
                  .then((doc) => {
                      if (doc) {
                          const currectUserData = doc.data[0];
                          console.log(doc.data[0]);
                          setFirstName(currectUserData.name.first);
                          setLastName(currectUserData.name.last);
                          setProfileImageUrl(currectUserData.image);
                          setClientIdToPass(doc.data[0]._id);
                          setClientObjectToPass(doc.data[0]);

                          dispatchClientObject({
                              type: 'SET_CLIENT_OBJECT',
                              clientObject: doc.data[0],
                          });
                          //for filling the recent orders scrollView
                          getClientOrders(doc.data[0]._id).done();

                      }
                  })
                  .catch((err) => console.log(err));
            } else {
                setInitializing(true);
            }
        });
        return subscriber; // unsubscribe on unmount
    };


    //First off all, the component loads the user details from the data base and sets the variables to the data

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getUserByFirebaseAuth();
        });
        return unsubscribe;
    }, [navigation]);

    //Update the covid alert var to false (will not display coivd alert anymore)
    const covidAlertCancel = () => {
        global.covidAlert = false;
    };

    //Show the covid information modal
    const covidAlertTap = () => {
        setCovidModalVisible(true);
    };

    //using func as async for waiting trainers array to fill from MongoDB
    //getting the trainer from mongoDb => recent orders use
    const getAllTrainersInfo = async (ordersHistoryArray) => {
        //console.log('inThatFunction');
        //Array to to be filled with the ids of the clients that left reviews
        let idArray = [];
        if (ordersHistoryArray.length === 0) {
            setOrdersHistoryTrainerArray([]);
            setNoRecentOrders('flex');
        } else {
            setNoRecentOrders('none');
            //Push into the idArray all of the clientID
            for (let index = 0; index < ordersHistoryArray.length; index++) {
                const singleTrainerID = ordersHistoryArray[index].trainer.id;
                idArray.push(singleTrainerID);
            }
            console.log(idArray);


            //fetch the trainer of all trainers from mongodb using axios
            await axios
              .get('/trainers/findMultipleTrainers/' + idArray,
                config,
              )
              .then((doc) => {
                  for (let index = 0; index < doc.data.length; index++) {
                      const element = doc.data[index];
                      console.log('findMultipleTrainers');
                      console.log(element);
                  }

                  let allTrainersInfo = doc.data;
                  allTrainersInfo.reverse();
                  setIsLoadingFinish(true);
                  setOrdersHistoryTrainerArray(allTrainersInfo);


              })
              .catch((err) => {
                  console.log('errorInTrainerReading');
                  console.log(err);
              });
        }
    };

    //Load trainer star rating
    const getStarRating = (reviews) => {
        if (reviews.length === 0) {
            return 0;
        } else {
            let sumStars = 0;
            for (let index = 0; index < reviews.length; index++) {
                const singleReviewStar = reviews[index].stars;
                sumStars += Number(singleReviewStar);
            }
            return ((sumStars / reviews.length).toFixed(1));
        }
    };

    //scrollView of trainers (working like flatList)
    const getApprovedOrdersPattern = () => {
        let repeats = [];
        if (ordersHistoryTrainerArray !== []) {
            for (let i = 0; i < ordersHistoryTrainerArray.length; i++) {
                //pushing each trainer UI into the array
                repeats.push(
                  <TouchableOpacity
                    key={'ordersRow' + i}
                    onPress={() => handleOnTrainerInRecentOrderScrollViewPressed(ordersHistoryTrainerArray[i])}
                  >

                      <View style={styles.trainerView}>
                          <View style={styles.trainerImageView}>
                              <FastImage
                                style={styles.trainerImage}
                                source={{
                                    uri: ordersHistoryTrainerArray[i].media.images[0],
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.stretch}
                              />
                          </View>
                          <View
                            style={styles.trainerPreviewText}
                          >
                              <Text
                                style={styles.trainerText1}>{ordersHistoryTrainerArray[i].name.first + ' ' + ordersHistoryTrainerArray[i].name.last}</Text>
                              <Text style={styles.trainerText2}>Personal Trainer</Text>
                              <View style={styles.ratingRow}>
                                  <Text
                                    style={styles.trainerText3}>{getStarRating(ordersHistoryTrainerArray[i].reviews)} </Text>
                                  <Image
                                    source={require('../../../images/starIconBlue.png')}
                                    style={styles.starIcon}
                                  />
                              </View>
                          </View>
                      </View>

                  </TouchableOpacity>,
                );
            }
        }
        return repeats;
    };


    //Handle when the user presses the ConfirmedOrders button
    const handleOnConfirmedOrdersPRessed = () => {
        dispatchClientId({
            type: 'SET_CLIENT_ID',
            clientId: clientIdToPass,
        });

        dispatchClientObject({
            type: 'SET_CLIENT_OBJECT',
            clientObject: clientObjectToPass,
        });


        navigation.navigate('PendingApprovalOrders');
    };

    //Handle when the user presses the PendingOrders button
    const handleOnPendingOrdersPRessed = () => {

        dispatchClientId({
            type: 'SET_CLIENT_ID',
            clientId: clientIdToPass,
        });

        dispatchClientObject({
            type: 'SET_CLIENT_OBJECT',
            clientObject: clientObjectToPass,
        });


        navigation.navigate('PendingApprovalOrders');
    };

    //Handle when the user presses the Invite friends button
    const handleOnInvitePressed = () => {
        navigation.navigate('ComingSoon');
    };

    //Handle when the user presses the Receipts history button
    const handleOnReceiptsHistoryPressed = () => {
        navigation.navigate('ReceiptsHistory');
    };

    //Handle when the user presses the History button
    const handleOnHistoryPressed = () => {

        navigation.navigate('ProfilePageStack',
          {
              screen: 'History',
              params: { ordersHistoryTrainerArray: completedOrdersToPass },
          });
    };

    //Handle when the user presses on Trainer in recent orders scrollview
    const handleOnTrainerInRecentOrderScrollViewPressed = (trainerObject) => {

        console.log('trainerObject');
        console.log(trainerObject);
        dispatchTrainerObject({
            type: 'SET_TRAINER_OBJECT',
            trainerObject: trainerObject,
        });

        navigation.navigate('StarPageStack',
          { screen: 'TrainerOrderPage' });
    };


    //Handle when the user presses the Edit profile button
    const handleOnEditProfilePressed = () => {
        navigation.navigate('EditProfile');
    };

    //Handle when the user presses the CustomerService button
    const handleOnCustomerServicePressed = () => {
        navigation.navigate('CustomerService');
    };

    //Handle when the user presses the Settings button
    const handleOnSettingsPressed = () => {
        navigation.navigate('Settings');
    };

    const handleOnTrainerPressed = (trainerObject) => {
        dispatchTrainerObject({
          type: 'SET_TRAINER_OBJECT',
          trainerObject: trainerObject,
        })
        dispatchOrderEndTime({
          type: 'SET_ORDER_END_TIME',
          orderEndTime: '',
        })

        navigation.navigate('TrainerOrderPage', { params: '' })
    }

    return (
      <SafeAreaView style={styles.safeArea}>
          <ScrollView style={styles.container}>
              <View style={styles.header}>
                  <Text style={styles.headerText}>Just You</Text>
              </View>

              <Text style={styles.helloUserTitle}>Hello {firstName}</Text>

              <View style={styles.imageAndDetailsRow}>
                  <TouchableOpacity>
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
                          <View style={styles.credits}>
                              <Text style={styles.creditValue}>0.00</Text>
                              <Text style={styles.creditText}>Credit (USD)</Text>
                          </View>
                      </View>
                  </View>
              </View>

              <View style={styles.sectionContainer}>
                  <Text style={styles.inPageMainTitles}>Trainers I Liked</Text>

                  <FlatList
                    horizontal
                    data={doc}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    showsHorizontalScrollIndicator={false}
                  />
              </View>

              <View style={styles.pageMainTitlesContainer}>
                  <Text style={styles.inPageSubMainTitles}>Links</Text>
                  <View style={styles.linksRowsContainer}></View>
                  <View style={styles.eachRowContainer}>
                          <TouchableOpacity
                            onPress={() => handleOnInvitePressed()}
                          >
                              <View style={styles.navigationsRows}>
                                <Text style={styles.navigationsRowsTitle}>Receive credit by inviting friends</Text>
                                <Image
                                    source={require('../../../images/arrowButton.png')}
                                    style={styles.arrowImage}
                                />
                              </View>
                          </TouchableOpacity>
                  </View>
                  <View style={styles.eachRowContainer}>
                          <TouchableOpacity
                            onPress={() => handleOnReceiptsHistoryPressed()}
                          >
                              <View style={styles.navigationsRows}>
                                <Text style={styles.navigationsRowsTitle}>Receipts History</Text>
                                <Image
                                    source={require('../../../images/arrowButton.png')}
                                    style={styles.arrowImage}
                                />
                              </View>
                          </TouchableOpacity>
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
                      <View
                        display={noRecentOrders}
                        style={styles.noRecentOrdersTextContainer}>

                          <Text
                            style={styles.noRecentOrdersText}
                          >There are no recent orders yet...
                          </Text>
                      </View>
                      {isLoadingFinish ?
                        getApprovedOrdersPattern()
                        :
                        <View style={styles.progressView}>
                            <Progress.Circle size={Dimensions.get('window').height * .1} indeterminate={true} />
                        </View>
                      }
                  </ScrollView>
              </View>
              <View style={styles.pageMainTitlesContainer}>
                  <Text style={styles.inPageSubMainTitles}>More</Text>
                  <View style={styles.moreRowsContainer}>
                      <View style={styles.eachRowContainer}>
                              <TouchableOpacity
                                onPress={() => handleOnEditProfilePressed()}
                              >
                                  <View style={styles.navigationsRows}>
                                  <Text style={styles.navigationsRowsTitle}>Edit Profile</Text>
                                  <Image
                                    source={require('../../../images/arrowButton.png')}
                                    style={styles.arrowImage}
                                  />
                                  </View>
                              </TouchableOpacity>
                      </View>
                      <View style={styles.eachRowContainer}>
                              <TouchableOpacity
                                onPress={() => handleOnCustomerServicePressed()}
                              >
                                  <View style={styles.navigationsRows}>
                                  <Text style={styles.navigationsRowsTitle}>Customer Service</Text>
                                  <Image
                                    source={require('../../../images/arrowButton.png')}
                                    style={styles.arrowImage}
                                  />
                                  </View>
                              </TouchableOpacity>
                      </View>
                      <View style={styles.eachRowContainer}>
                              <TouchableOpacity
                                onPress={() => handleOnSettingsPressed()}
                              >
                                  <View style={styles.navigationsRows}>
                                  <Text style={styles.navigationsRowsTitle}>Settings</Text>
                                  <Image
                                    source={require('../../../images/arrowButton.png')}
                                    style={styles.arrowImage}
                                  />
                                  </View>
                              </TouchableOpacity>
                      </View>
                      <View
                        style={styles.deadAreaBottom}
                      />
                  </View>
              </View>
          </ScrollView>
      </SafeAreaView>
    );
};

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
        alignSelf: 'center',
        marginTop: 10
    },
    headerText: {
        fontSize: Dimensions.get('window').height * .04,
        fontWeight: 'bold'
    },
    helloUserTitle: {
        fontWeight: 'bold',
        marginTop: Dimensions.get('window').height * .040,
        fontSize: Dimensions.get('window').height * .025,
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
        fontSize: Dimensions.get('window').height * .0112,
        textAlign: 'center'
    },
    ratingRow: {
        flexDirection: 'row'
    },
    trainerText3: {
        fontSize: Dimensions.get('window').height * .0112,
        textAlign: 'center',
        fontWeight: 'bold',

    },
    starIcon: {
        height: Dimensions.get('window').height * .0112,
        width: Dimensions.get('window').width * .0245,
        alignSelf: 'center'
    },
    pageMainTitlesContainer: {
        marginTop: Dimensions.get('window').height * .030,
    },
    progressView: {
        marginTop: Dimensions.get('window').height * .03,
        marginLeft: Dimensions.get('window').width * .33,

        alignSelf: 'center'
    },
    noRecentOrdersTextContainer:{
        backgroundColor: '#fafafa',
        alignItems:'flex-start',
        borderTopColor:'gainsboro',
        borderBottomColor:'gainsboro',
        borderLeftColor: '#fafafa' ,
        borderRightColor: '#fafafa',
        borderWidth: 3,
        width: Dimensions.get('window').width * 1.1,
        height: Dimensions.get('window').height * .1,



    },
    noRecentOrdersText:{
        marginTop:Dimensions.get('window').height * .03,
        fontWeight: 'bold',
        color: 'grey',
        fontSize: Dimensions.get('window').height * .02,
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
        height: Dimensions.get('window').height * .06,
        justifyContent: 'center',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
    },
    arrowImage: {
        height: Dimensions.get('window').height * .015,
        marginTop: Dimensions.get('window').height * .005,
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
    },
    covidAlertView: {
        zIndex: 2,
        opacity: 0.9
    },
    covidAlertContainer: {
        backgroundColor: 'deepskyblue',
    },
    covidContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    covidModalContainer: {
        backgroundColor: "white",
        height: Dimensions.get('window').height * .45,
        width: Dimensions.get('window').width * .9,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    covidTitle: {
        marginTop: Dimensions.get('window').height * .01,
        alignSelf: 'center',
        fontSize: Dimensions.get('window').height * .0278,
        fontWeight: 'bold'
    },
    covidMessage: {
        flex: 1,
        marginTop: Dimensions.get('window').height * .013,
        alignSelf: 'center',
        marginLeft: Dimensions.get('window').width * .020,
        fontSize: Dimensions.get('window').height * .02,
    },
    covidCloseIcon: {
        marginTop: Dimensions.get('window').height * .015,
        marginRight: Dimensions.get('window').width * .015,
        alignSelf: 'flex-end',
    }
});

export default ProfilePage;
