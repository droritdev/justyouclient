import React, {useState, useEffect, useContext} from 'react';
import { Text,TextInput , View, StyleSheet, ScrollView, Dimensions, Image, Modal , FlatList} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/Feather';
import StarRating from 'react-native-star-rating';


import axios from 'axios';

import {ClientContext} from '../../../context/ClientContext';
import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';



//The history page
const History = ({navigation, route}) => {

    const [isTrainers, setIsTrainers] = useState(true);
    const { ordersHistoryTrainerArray } = route.params;
    const {clientObject} = useContext(ClientContext);
    const [trainerIdForReview, setTrainerIdForReview] = useState('');
    const [alreadyHasReview, setAlreadyHasReview] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [starsCount, setStarsCount] = useState(0);
    const [reviewContent, setReviewContent] = useState('');

    var reviewsArray = [];


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            checkForOrders();
        });
        return unsubscribe;
      }, [navigation]);

    //check if there are any completed orders
    //if not => showing no orders View
    const checkForOrders = () => {
        if (ordersHistoryTrainerArray.length === 0){
            setIsTrainers(false);
        }else{
            setIsTrainers(true);
        }
    }

    //check if client already given a review for trainer in the recent order list
    const checkIfTrainerAlreadyGotReviewByClient = () => {
        var reviewBool = false
        for (let index = 0; index < reviewsArray.length; index++) {
            const review = reviewsArray[index];
            if(review.userID === clientObject._id){
                reviewBool = true;
                break;
            }
            
        }
        // setAlreadyHasReview(true);

        return reviewBool;

    }

    //Load trainer star rating
         //Todo: check if needed in sunday

    // const getStarRating = (reviews) => {
    //     if (reviews.length === 0) {
    //         setStarRating(0);
    //     } else {
    //         var sumStars = 0;
    //         for (let index = 0; index < reviews.length; index++) {
    //             const singleReviewStar = reviews[index].stars;
    //             sumStars += Number(singleReviewStar);
    //         }
    //         return ((sumStars/reviews.length).toFixed(1));
    //     }
    // }

     //scrollView of trainers (working like flatList)
     //Todo: check if needed in sunday
    // const getApprovedOrdersPattern = () => {
    //     let repeats = [];
    //     if (ordersHistoryTrainerArray !== []) {
    //         for(let i = 0; i < ordersHistoryTrainerArray.length; i++) {
    //             var reviewBool = checkIfTrainerAlreadyGotReviewByClient(ordersHistoryTrainerArray[i]);
    //             // setAlreadyHasReview(reviewBool);
    //             //pushing each trainer UI into the array
    //             repeats.push(
    //                 <TouchableOpacity 
    //                     key = {'ordersRow' + i}
    //                     >
    //                     <View style={styles.trainerView}>
    //                         <View style={styles.trainerViewRow}>
    //                             <FastImage
    //                                     style={styles.trainerImage}
    //                                     source={{
    //                                         uri: ordersHistoryTrainerArray[i].media.images[0],
    //                                         priority: FastImage.priority.normal,
    //                                             }}
    //                                     resizeMode={FastImage.resizeMode.stretch}
    //                             />
    //                             <View style={styles.trainerDetails}>
    //                                 <Text style={styles.trainerDetail1}>{ordersHistoryTrainerArray[i].name.first +' '+ordersHistoryTrainerArray[i].name.last}</Text>
    //                                 <Text style={styles.trainerDetail2}>Personal Trainer</Text>
    //                                 <View style={styles.ratingRow}>
    //                                     <Text style={styles.trainerDetail3}>{getStarRating(ordersHistoryTrainerArray[i].reviews)} </Text>
    //                                     <Image
    //                                             source={require('../../../images/ratingStar.png')}
                                                
    //                                     />
    //                                 </View>
    //                             </View>

    //                             <View style={styles.iconsContainer}>
    //                                 <TouchableOpacity
    //                                     onPress= {() => handleOnAddReviewButton(ordersHistoryTrainerArray[i]._id)}>
    //                                         {checkIfTrainerAlreadyGotReviewByClient(ordersHistoryTrainerArray[i]) ? 
    //                                             <Icon name="check-circle" size={Dimensions.get('window').height * .035} color="#00bfff" />
    //                                         :
    //                                             <Icon name="plus-circle" size={Dimensions.get('window').height * .035} color="#00bfff" />
    //                                         }
    //                                     {/* <Icon name="plus-circle" size={Dimensions.get('window').height * .035} color="#00bfff" /> */}
    //                                 </TouchableOpacity>
    //                             </View>
    //                         </View>
    //                     </View>
                                   
    //                 </TouchableOpacity>
    //                 )
    //             }
    //         }
    //         return repeats;
    // };

    const getTrainerStarRating = () => {
        var starsCounter = 0
        var finalStarRating = 0
        for (let index = 0; index < reviewsArray.length; index++) {
            const element = reviewsArray[index];
            starsCounter += Number(element.stars)

        }

        finalStarRating = (starsCounter/(reviewsArray.length)).toFixed(1);
        return finalStarRating;
    }

    const Item = ({ uri, name, trainerID }) => (

        
        
        <TouchableOpacity 
        // key = {'ordersRow' + i}
        >
        <View style={styles.trainerView}>
            <View style={styles.trainerViewRow}>
                <FastImage
                        style={styles.trainerImage}
                        source={{
                            uri: uri,
                            priority: FastImage.priority.normal,
                                }}
                        resizeMode={FastImage.resizeMode.stretch}
                />
                <View style={styles.trainerDetails}>
                    <Text style={styles.trainerDetail1}>{name}</Text>
                    <Text style={styles.trainerDetail2}>Personal Trainer</Text>
                    <View style={styles.ratingRow}>
                        <Text style={styles.trainerDetail3}>{getTrainerStarRating()} </Text>
                        <Image
                                source={require('../../../images/ratingStar.png')}
                                
                        />
                    </View>
                </View>

                <View style={styles.iconsContainer}>
                    
                            {checkIfTrainerAlreadyGotReviewByClient() ? 
                            <TouchableOpacity
                                onPress= {() => handleOnAlreadyGotReview()}>                   
                                <Icon name="check-circle" size={Dimensions.get('window').height * .035} color="#00bfff" />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress= {() => handleOnAddReviewButton(trainerID)}>                  
                                <Icon name="plus-circle" size={Dimensions.get('window').height * .035} color="#00bfff" />
                            </TouchableOpacity>
                            }
                    
                </View>
            </View>
        </View>
                   
    </TouchableOpacity>

        
      )



    const renderItem = ({ item }) => (
        <Item 
        uri = {item.media.images[0]}
        name = {`${item.name.first} ${item.name.last}`}
        trainerID = {item._id}
        
        {...reviewsArray = (item.reviews)}
        ></Item>
        
    );





    const config = {
        withCredentials: true,
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
        setModalVisible(true);
        setTrainerIdForReview(trainerID);
    }

    const handleOnAlreadyGotReview = () => {
        alert('You have already set review for this trainer');
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
                <Icon name="shopping-bag" size={Dimensions.get('window').height * .05} color="#00bfff" />

                <Text style={styles.allOrdersText}>All Orders</Text>
            </View>
            <View style={styles.greyBorder}></View>
            <View style={styles.verifyExplenationContainer}>
                <Text style={styles.verifyExplenationText}>
                    {"Your past orders are displayed below, \nIf you would like, you may leave a review on the trainer aswell."}
                </Text>
            </View>

                {isTrainers ? 
                    <ScrollView>
                        <FlatList
                                horizontal
                                data={ordersHistoryTrainerArray}
                                renderItem={renderItem}
                                keyExtractor={item => item._id}
                                
                                
                            />
                            
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
        marginLeft: Dimensions.get('window').width * .275,
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
   
  
});

export default History;