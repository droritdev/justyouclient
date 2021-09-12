import React, { useState, useEffect, useContext, useReducer } from "react";
import { Text,TextInput , View, StyleSheet, ScrollView, Dimensions, Image, Modal , FlatList} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/Feather';
import StarRating from 'react-native-star-rating';
import * as Progress from 'react-native-progress';



import axios from 'axios';

import {ClientContext} from '../../../context/ClientContext';
import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';
import Alert from "react-native/Libraries/Alert/Alert";



//The history page
const History = ({navigation, route}) => {
    //boolean to check if there are orders
    const [isTrainers, setIsTrainers] = useState(true);
    //get the orders from the ProfilePage
    const { ordersHistoryTrainerArray } = route.params;
    //get the client object
    const {clientObject} = useContext(ClientContext);
    //trainer Id to use when uploading review
    const [trainerIdForReview, setTrainerIdForReview] = useState('');
    //visability for add review modal
    const [modalVisible, setModalVisible] = useState(false);
    //TODO: star count in review modal
    const [starsCount, setStarsCount] = useState(0);
    //review content to upload
    const [reviewContent, setReviewContent] = useState('');
    //check if all the data we want to show in the UI is ready
    const [listIsReadyToShow, setListIsReadyToShow] = useState('none');
    //array of booleans to check which trainer already got review
    const [reviewBooleanArray, setReviewBooleanArray] = useState([]);

    const [isLoadingCircle, setIsLoadingCircle] = useState(true);

    const forceUpdate = useReducer(bool => !bool)[1];//Page refresh


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            checkForOrders().done();
        });
        return unsubscribe;
      }, [navigation]);

    //check if there are any completed orders
    //if not => showing no orders View
    const checkForOrders = async () => {
      console.log('components/clientPage/profilePageTab/History.js/checkForOrders:');

      if (ordersHistoryTrainerArray.length === 0){
            setIsTrainers(false);
        }else{
            await getAllTrainersInfo();
        }
    }

    //check if client already given a review for trainer in the recent order list
    const checkIfTrainerAlreadyGotReviewByClient =  (allTrainers) => {
        //array of booleans to push into reviewBooleanArray
        let isReviewExistArray = []
        console.log("checkIfTrainerAlreadyGotReviewByClient");
        //for loop on all our orders
        for (let index = 0; index < ordersHistoryTrainerArray.length; index++) {
            const order = ordersHistoryTrainerArray[index];
            //for each loop on trainers that are in orders(by id)
            allTrainers.forEach(trainer => {
                //check for same trainer id in order and for trainer
                if (trainer._id === order.trainer.id){

                    //check if client ID is found in the trainer's reviews
                    if(trainer.reviews.some(i => i.userID.includes(clientObject._id ))){
                        console.log('thereIsRviewThere')
                        //our client ID is in the trainers reviews
                        isReviewExistArray.push(true);
                    }else{
                        //our client ID isn't in the trainers reviews
                        isReviewExistArray.push(false);
                    }
                }
            });
        }
        //the list is ready to show because now we know which trainer already got/not review by our client
        setIsLoadingCircle(false);
        setListIsReadyToShow('flex');

        setReviewBooleanArray(isReviewExistArray);
    }

    const getAllTrainersInfo = async () => {
        //Array to to be filled with the ids of the trainers that left reviews
        let idArray = [];

        //Push into the idArray all of the trainerID
        for (let index = 0; index < ordersHistoryTrainerArray.length; index++) {
            const singleTrainerID = ordersHistoryTrainerArray[index].trainer.id;
            idArray.push(singleTrainerID);
        }
        console.log('components/clientPage/profilePageTab/History.js/getAllTrainersInfo: ' +idArray.toString());
        //fetch the trainer of all trainers from mongodb using axios
        await axios
        .get('/trainers/findMultipleTrainers/'+idArray,
        config
        )
        .then((doc) => {
          console.log('components/clientPage/profilePageTab/History.js/getAllTrainersInfo: then');
            checkIfTrainerAlreadyGotReviewByClient(doc.data);

        })
        .catch((err) => {console.log(err)});
    }

     //scrollView of trainers (working like flatList)
     //Todo: check if needed in sunday
    const getCompletedOrdersPattern = () => {
        let repeats = [];
        if (ordersHistoryTrainerArray !== [] && reviewBooleanArray !== []) {
            for(let i = 0; i < ordersHistoryTrainerArray.length; i++) {
                 //pushing each trainer UI into the array
              console.log(ordersHistoryTrainerArray[i]._id);
                repeats.push(
                    <TouchableOpacity
                        key = {'ordersRow' + i}
                        >
                        <View style={styles.trainerView}>
                            <View style={styles.trainerViewRow}>
                                <FastImage
                                        style={styles.trainerImage}
                                        source={{
                                            uri: ordersHistoryTrainerArray[i].trainer.profilePic,
                                            priority: FastImage.priority.normal,
                                                }}
                                         resizeMode={FastImage.resizeMode.stretch}
                                />
                                <View style={styles.trainerDetails}>
                                    <Text style={styles.trainerDetail1}>{ordersHistoryTrainerArray[i].trainer.firstName +' '+ordersHistoryTrainerArray[i].trainer.lastName}</Text>
                                    <Text style={styles.trainerDetail2}>{ordersHistoryTrainerArray[i].trainingDate.startTime.slice(0, 10)}</Text>
                                    <View style={styles.ratingRow}>

                                    </View>
                                </View>



                                <View style={styles.iconsContainer}>
                                    {reviewBooleanArray[i] ?
                                        <TouchableOpacity

                                            onPress= {() => handleOnAlreadyGotReview()}>

                                            <Icon name="check-circle" size={Dimensions.get('window').height * .035} color="#00bfff" />
                                        </TouchableOpacity>
                                    :
                                        <TouchableOpacity
                                            onPress= {() => handleOnAddReviewButton(ordersHistoryTrainerArray[i].trainer.id)}>
                                            <Icon name="plus-circle" size={Dimensions.get('window').height * .035} color="#00bfff" />
                                        </TouchableOpacity>
                                    }

                                </View>
                            </View>
                        </View>

                    </TouchableOpacity>
                    )
                }
            }
            return repeats;
    };


    const config = {
        withCredentials: true,
    //    baseURL: 'http://10.0.2.2:3000/',
        baseURL: 'http://localhost:3000/',
        headers: {
          "Content-Type": "application/json",
        },
    };

    //adding the review to reviews array in trainer
    const addReview = () => {
        axios
            .put('/clients/comments/add', {

                _id: trainerIdForReview,
                userID: clientObject._id,
                stars: starsCount,
                reviewContent: reviewContent
            },
            config
            )
            .then((res) => {
                setStarsCount(0);
            })
            .catch((err) => console.log(err));
    }

    //Navigates back to the profile page
    const handleOnArrowPress = () => {
        navigation.navigate('ProfilePage');
    }

    //handle on add review button click
    const handleOnAddReviewButton = (trainerID) => {
      console.log('You have already set review for this trainer');

      setModalVisible(true);
      setTrainerIdForReview(trainerID);

    }

    const handleOnAlreadyGotReview = () => {
        Alert.alert('You have already set review for this trainer');
        console.log('You have already set review for this trainer');
    }
    //handle when text is changing in text input (for review)
    const handleOnInputChange = (text) => {
        setReviewContent(text)

    }
    //handle when user choose star rating for the review
    const onStarRatingPress = (rating) => {
        setStarsCount(rating);

    }
    //handle when user fill all the fields and click submit for pushing the review to the trainer
    const handleSubmitButton = () => {
        addReview();
        //dismiss the review modal window
        setModalVisible(false);
        //MARK
        setListIsReadyToShow('none');
        setIsLoadingCircle(true);
        checkForOrders().done();
        // navigation.push('History');
    }

    return(
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Just You</Text>
            </View>
                <ArrowBackButton
                    onPress={handleOnArrowPress}
                />
            <View style={styles.allOrdersTitle}>
                {/* <Icon name="shopping-bag" size={Dimensions.get('window').height * .05} color="#00bfff" /> */}

                <Text style={styles.allOrdersText}>All Orders</Text>
            </View>
            <View style={styles.greyBorder}/>
            <View style={styles.verifyExplenationContainer}>
                <Text style={styles.verifyExplenationText}>
                    {"Your past orders are displayed below, \nIf you would like, you may leave a review on the trainer as well."}
                </Text>
            </View>

                {isTrainers ?
                    <ScrollView>

                            <View display={listIsReadyToShow}>
                            {isLoadingCircle?
                                <View>
                                    <View style={styles.progressView}>
                                        <Progress.Circle size={Dimensions.get('window').height * .25} indeterminate={true} />
                                    </View>

                                </View>
                            :
                                getCompletedOrdersPattern()
                            }
                            </View>

                    </ScrollView>
                :
                    <View>
                        <Image
                            source={require('../../../images/noOrders.png')}
                            style={styles.noOrdersImage}
                        />
                        <Text style={styles.noOrdersText}> No orders yet..</Text>
                    </View>
                }

            <Modal

                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                }}
                >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Training statisfaction</Text>
                        <View style={styles.starsContainer}>
                            <StarRating
                                disabled={false}
                                maxStars={5}
                                rating={starsCount}
                                fullStarColor = {'gold'}
                                selectedStar={(rating) => onStarRatingPress(rating)}
                            />
                        </View>

                        <Text style={styles.subtitleText}>Comment</Text>
                        <View style={styles.textConatiner}>
                            <View style={styles.textInputContainer}>
                                <TextInput
                                    style={{fontSize: Dimensions.get('window').height * .02}}
                                    multiline={true}
                                    placeholder =  'Share your experience and thoughts about your training'
                                    onChangeText={(value) => handleOnInputChange(value)}
                                    focusable={true}
                                />
                            </View>
                        </View>


                        <View style={styles.buttonsRow}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <Text style={styles.cancelTextStyle}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={() => {
                                    handleSubmitButton();

                                }}
                            >
                                <Text style={styles.submitTextStyle}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>



        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'white',
        height: Dimensions.get('window').height,
    },
    container: {
        backgroundColor: 'white',
        width: Dimensions.get('window').width,
    },
    header: {
        alignSelf: 'center'
    },
    headerText: {
        fontSize: Dimensions.get('window').height * .03,
        fontWeight: 'bold'
    },

    allOrdersTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf : 'center',
        marginTop: Dimensions.get('window').height * .02,
    },
    allOrdersText: {
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .035,
        marginLeft: Dimensions.get('window').width * .025,
    },
    greyBorder: {
        marginTop: Dimensions.get('window').height * .01,
        marginBottom: Dimensions.get('window').height * .02,

        alignSelf: 'center',
        width: Dimensions.get('window').width * .7,
        borderTopWidth: 3,
        borderTopColor: 'lightgrey',
    },
    verifyExplenationContainer: {
        width: Dimensions.get('window').width * .8,
        alignSelf: 'center'
    },
    verifyExplenationText: {
        fontWeight: '500',
        color: 'grey',
        fontSize: Dimensions.get('window').height * .019,
        textAlign:'center',
    },
    trainerView: {
        width: Dimensions.get('window').width,
        marginLeft: Dimensions.get('window').width * .025,
        marginTop: Dimensions.get('window').height * .025
    },
    trainerViewRow: {
        flexDirection: 'row',
        justifyContent:'space-between'
    },
    trainerImage: {
        height: Dimensions.get('window').height * .1,
        width: Dimensions.get('window').height * .1,
        borderRadius: 15,
        backgroundColor: 'gainsboro'
    },
    trainerDetails: {
        justifyContent: 'center',
        marginLeft: Dimensions.get('window').width * .025
    },
    trainerDetail1: {
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .025
    },
    trainerDetail2: {
        fontSize: Dimensions.get('window').height * .02
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    trainerDetail3: {
        fontSize: Dimensions.get('window').height * .02
    },
    ratingIcon: {
    },
    noOrdersImage:{
        marginTop : Dimensions.get('window').height * .02,
        alignSelf: 'center',
        height: Dimensions.get('window').height * 0.4,
        width: Dimensions.get('window').width * 0.8,
    },
    noOrdersText: {
        marginTop : Dimensions.get('window').height * .02,
        alignSelf: 'center',
        fontSize: Dimensions.get('window').height * .03,
        fontWeight: 'bold',
    },

    iconsContainer:{
        alignSelf: 'flex-end',
        // alignItems:'flex-end',
        marginRight: Dimensions.get('window').width * .05,
        marginBottom: Dimensions.get('window').height * .035,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        height: Dimensions.get('window').height * .45,
        width: Dimensions.get('window').width * .86,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      modalText: {
        marginTop:  Dimensions.get('window').height * .01,
        fontWeight: "bold",
        fontSize: Dimensions.get('window').height * .023,
        textAlign: "center"
      },
      starsContainer:{
        width: Dimensions.get('window').width * .6,
        alignSelf: 'center',
        marginTop: Dimensions.get('window').height * .01,
      },
      subtitleText: {
        marginTop:  Dimensions.get('window').height * .02,
        fontWeight: "bold",
        fontSize: Dimensions.get('window').height * .023,
        textAlign: "center"
      },
      textConatiner: {
        marginTop: Dimensions.get('window').height * .015,
        width: Dimensions.get('window').width * .76,
        height: Dimensions.get('window').height * .21,
        borderColor: 'deepskyblue',
        borderRadius: 17,
        borderWidth: 2,
        alignSelf: 'center'
    },
      textInputContainer: {
        marginLeft: Dimensions.get('window').width * .045,
        marginRight: Dimensions.get('window').width * .045,
        marginTop: Dimensions.get('window').height * .005,
        width: Dimensions.get('window').width * .67,
        height: Dimensions.get('window').height * .2,

    },
      buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Dimensions.get('window').height * .020,

      },
      cancelButton: {
        marginLeft: Dimensions.get('window').width * .04,
        backgroundColor: "lightgrey",
        width: Dimensions.get('window').width * .25,
        height: Dimensions.get('window').height * .05,
        borderRadius: 20,
        justifyContent: 'center'
      },
      cancelTextStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
      },
      submitButton: {
        marginRight: Dimensions.get('window').width * .04,
        backgroundColor: "deepskyblue",
        width: Dimensions.get('window').width * .25,
        height: Dimensions.get('window').height * .05,
        borderRadius: 20,
        justifyContent: 'center'
      },
      submitTextStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
      },
      progressView: {
        alignSelf: 'center'
    },


});

export default History;
