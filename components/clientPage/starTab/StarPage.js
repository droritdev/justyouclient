import React, {useState, useContext, useEffect, useReducer} from 'react';
import { Button, Text, View, StyleSheet, ScrollView, RefreshControl, Dimensions, Image, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image'
import * as Progress from 'react-native-progress';

// import { ListItem } from 'react-native-elements'

import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';


import {TrainerContext} from '../../../context/TrainerContext';
import {EmailContext} from '../../../context/EmailContext';



//The client's start area page
const StarPage = ({navigation}) => {

    const [doc, setDoc] = useState();
    const [isRefreshing,setIsRefreshing] = useState(false);
    const forceUpdate = useReducer(bool => !bool)[1];//Page refresh 

    const {
        dispatchTrainerFirst,
                dispatchTrainerMediaPictures,
                        dispatchTrainerNumberOfStars,
                                 dispatchTrainerNumberOfStarComments,
                                                dispatchTrainerCategories ,
                                                        dispatchTrainerObject
                                             }
         = useContext(TrainerContext);

    const config = {
        withCredentials: true,
        baseURL: 'http://localhost:3000/',
        headers: {
              "Content-Type": "application/json",
        },
    };     

    const getAllTrainers = () => {
        console.log('🚨click')
        setIsRefreshing(true);
        
        axios  
            .get('/trainers/getAllTrainers',
            config)
            .then((doc) => {
                console.log('🚨doc' + doc)

                if(doc) {
                    setDoc(doc.data);
                    console.log("is any doc here " + doc.data);
                    setIsRefreshing(false);

                }
            })
            .catch((err) =>  {
            });
    }

    useEffect(() => {
        getAllTrainers();
    },[]);
     
     




    const Item = ({ trainerObject, name,media, numberOfStars, numberOfStarComments,categories, trainerTrainingSite1 ,trainerTrainingSite2 ,date, prices }) => (
        
        <View style={styles.inSectionView}>
            <TouchableOpacity
                onPress={() => handleOnTrainerPressed(trainerObject, name,media, numberOfStars, numberOfStarComments,categories,trainerTrainingSite1 ,trainerTrainingSite2 ,date, prices )}
            >
        <View style={styles.inSectionImageViewContainer}>
            
                <FastImage
                        style={styles.inSectionImageView}
                        source={{
                            uri: media.images[0],
                            priority: FastImage.priority.normal,
                                }}
                        resizeMode={FastImage.resizeMode.stretch}
                    />
        </View>
        <View
            style={styles.trainerPreviewText}
        >
            <Text style={styles.trainerText1}>{name}</Text>
            <Text style={styles.trainerText2}>Personal Trainer</Text>
            <View style={styles.ratingRow}>
                 {numberOfStarComments === 0 ? 
                 <Text style={styles.trainerText3}>no comments</Text> 
                 :
                 <Text style={styles.trainerText3}>{(numberOfStars/numberOfStarComments).toFixed(1)}</Text>} 

                 {numberOfStarComments === 0 ? 
                 <Image 
                    // source={require('../../../images/ratingStar.png')}
                    style={styles.starIcon}/> 
                    : 
                <Image 
                    source={require('../../../images/ratingStar.png')}
                    style={styles.starIcon}
                />}
                      
                
            </View>
        </View>
        </TouchableOpacity>
    </View>



          


        //   <Text style={styles.trainerText1}>{firstName + " " +lastName}</Text>
        
      )
    

    const renderItem = ({ item }) => (
        <Item name = {`${item.name.first} ${item.name.last}`}
        numberOfStars = {item.starCounter.numberOfStars}
        numberOfStarComments = {item.starCounter.numberOfStarComments}
        media = {item.media}
        categories = {item.categories}
        trainerObject = {item}
        
        ></Item>
        
      );

    

    



    //Handle when the client presses on a trainer button
    const handleOnTrainerPressed = (trainerObject, name,media, numberOfStars, numberOfStarComments, categories, trainerTrainingSite1 ,trainerTrainingSite2, date, prices  ) => {
        // console.log('item: '+ name)

            dispatchTrainerObject({
                type: 'SET_TRAINER_OBJECT',
                trainerObject: trainerObject
            })
        
            dispatchTrainerFirst({
                type: 'SET_FIRST_NAME',
                trainerFirstName: name
            });
            dispatchTrainerMediaPictures({
                type: 'SET_MEDIA_PICTURES',
                trainerMediaPictures: media
            });
            dispatchTrainerNumberOfStars({
                type:'SET_NUMBER_OF_STARS',
                trainerNumberOfStars:numberOfStars
            })
            dispatchTrainerNumberOfStarComments({
                type: 'SET_NUMBER_OF_STARS_COMMENTS',
                trainerNumberOfStarComments: numberOfStarComments
            })
            dispatchTrainerCategories({
                type: 'SET_CATEGORIES',
                trainerCategories: categories
            })
            // trainerTrainingSite1({
            //     type: 'SET_TRAINING_SITE_1',
            //     trainerTrainingSite1: trainerTrainingSite1
            // })
            // trainerTrainingSite2({
            //     type: 'SET_TRAINING_SITE_2',
            //     trainerTrainingSite2: trainerTrainingSite2
            // })
            

    
            

        // getPopularTrainers();

        navigation.navigate('TrainerOrderPage')
    }

    //Handle when the client presses on Why Us button
    const handleOnWhyUsPressed = () => {
        navigation.navigate('WhyUs');
    }

    //Handle when the client presses on Q&As button
    const handleOnQandAsPressed = () => {
        navigation.navigate('QuestionsAndAnswers');
    }

    //Handle when the client presses on Discount Code button
    const handleOnDiscountCodePressed = () => {
        navigation.navigate('ComingSoon');
    }

    //Handle when the client presses on Customer Service button
    const handleOnCustomerSrvicePressed = () => {
        navigation.navigate('CustomerService');
    }

    //Handle when the client presses on gift card purchase button
    const handleOnGiftCardPurchasePressed = () => {
        navigation.navigate('ComingSoon');
    }

    return(
        <SafeAreaView style={styles.safeArea}>
            <ScrollView 
                    style={styles.container}
                    >
                    
                <View style={styles.header}>
                    <Text style={styles.headerText}>Just You</Text>
                </View>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Popular</Text>
                    <ScrollView 
                    
                        style={styles.sectionScrollView} 
                        // horizontal={true} 
                        showsHorizontalScrollIndicator={false}
                    >

                        <FlatList
                                horizontal
                                data={doc}
                                renderItem={renderItem}
                                keyExtractor={item => item.email}
                                
                                
                            />
                        {/* example for dummy triner item */}
                        {/* <View style={styles.inSectionView}>
                            <View style={styles.inSectionImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.inSectionImageView}
                                    onPress={() => handleOnTrainerPressed()}
                                >
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
                        </View> */}
                    </ScrollView>
                </View>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <ScrollView 
                        style={styles.sectionScrollView} 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={styles.inSectionView}>
                             <View style={styles.inSectionImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.inSectionImageView}
                                >
                                    <Image
                                        style={styles.categoryImage}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={styles.categoryPreviewText}
                            >
                                <Text style={styles.categoryText1}>RUNNING</Text>
                                <Text style={styles.categoryText2}>Amount of trainrs: 25</Text>
                            </View>
                        </View>
                        <View style={styles.inSectionView}>
                            <View style={styles.inSectionImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.inSectionImageView}
                                >
                                    <Image
                                        style={styles.categoryImage}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={styles.categoryPreviewText}
                            >
                                <Text style={styles.categoryText1}>TRX </Text>
                                <Text style={styles.categoryText2}>Amount of trainrs: 30</Text>
                            </View>
                        </View>
                        <View style={styles.inSectionView}>
                            <View style={styles.inSectionImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.inSectionImageView}
                                >
                                    <Image
                                        style={styles.categoryImage}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={styles.categoryPreviewText}
                            >
                                <Text style={styles.categoryText1}>POWER LIFTING</Text>
                                <Text style={styles.categoryText2}>Amount of trainrs: 78</Text>
                            </View>
                        </View>
                        <View style={styles.inSectionView}>
                            <View style={styles.inSectionImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.inSectionImageView}
                                >
                                    <Image
                                        style={styles.categoryImage}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={styles.categoryPreviewText}
                            >
                                <Text style={styles.categoryText1}>SWIMMING</Text>
                                <Text style={styles.categoryText2}>Amount of trainrs: 75</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                {/* <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Places</Text>
                    <ScrollView 
                        style={styles.sectionScrollView} 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={styles.inSectionView}>
                            <View style={styles.inSectionImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.inSectionImageView}
                                >
                                    <Image
                                        style={styles.placeImage}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={styles.placePreviewText}
                            >
                                <Text style={styles.placeText1}>STUDIO SPRING</Text>
                                <Text style={styles.placeText2}>4 km - $$$</Text>
                            </View>
                        </View>
                        <View style={styles.inSectionView}>
                            <View style={styles.inSectionImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.inSectionImageView}
                                >
                                    <Image
                                        style={styles.placeImage}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={styles.placePreviewText}
                            >
                                <Text style={styles.placeText1}>GET FIT Studio</Text>
                                <Text style={styles.placeText2}>5 km - $$$</Text>
                            </View>
                        </View>
                        <View style={styles.inSectionView}>
                            <View style={styles.inSectionImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.inSectionImageView}
                                >
                                    <Image
                                        style={styles.placeImage}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={styles.placePreviewText}
                            >
                                <Text style={styles.placeText1}>LENA Studio</Text>
                                <Text style={styles.placeText2}>5 km - $$$</Text>
                            </View>
                        </View>
                        <View style={styles.inSectionView}>
                            <View style={styles.inSectionImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.inSectionImageView}
                                >
                                    <Image
                                        style={styles.placeImage}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={styles.placePreviewText}
                            >
                                <Text style={styles.placeText1}>XP Studio</Text>
                                <Text style={styles.placeText2}>4 km - $$$</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View> */}
                <View style={styles.whyShareQandAUpdatesButtonsView}>
                    <View style={styles.whyShareQandAUpdatesButtonsRow}>
                        <TouchableOpacity 
                            style={styles.whyUsButton}
                            onPress={() => handleOnWhyUsPressed()}
                        >
                            <Text style={styles.whyUsTitle}>WHY US</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.shareAndEarnButton}
                            onPress={() => handleOnGiftCardPurchasePressed()}
                        >
                            <Text style={styles.shareAndEarnTitle}>SHARE & EARN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.qAndaButton}
                            onPress={() => handleOnQandAsPressed()}
                        >
                            <Text style={styles.qAndaTitle}>Q & A's</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.updatesButton}
                            onPress={() => handleOnGiftCardPurchasePressed()}
                        >
                            <Text style={styles.updatesTitle}>UPDATES</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* For Instegram and FaceBook socialButtons */}
                <View style={styles.socialButtons}>
                    <TouchableOpacity>
                        <Image
                            source={require('../../../images/facebookButton.png')}
                            style={styles.facebookButton}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            source={require('../../../images/instegramButton.png')}
                            style={styles.instegramImage}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.moreContainer}>
                    <Text style={styles.moreTitle}>More Links</Text>
                    <View style={styles.rowsContainer}></View>
                    <View style={styles.eachRowContainer}>
                        <View style={styles.navigationsRows}>
                            <TouchableOpacity
                                onPress={() => handleOnDiscountCodePressed()}
                            >
                                <Text style={styles.navigationsRowsTitle}>Discount Code</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.discountCodeButton}
                                onPress={() => handleOnDiscountCodePressed()}
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
                                onPress={() => handleOnCustomerSrvicePressed()}
                            >
                                <Text style={styles.navigationsRowsTitle}>Customer Service</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.arrowButton}
                                onPress={() => handleOnCustomerSrvicePressed()}
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
                                onPress={() => handleOnGiftCardPurchasePressed()}
                            >
                                <Text style={styles.navigationsRowsTitle}>Gift Card Purchase</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.giftCardButton}
                                onPress={() => handleOnGiftCardPurchasePressed()}
                            >
                                <Image
                                    source={require('../../../images/arrowButton.png')}
                                    style={styles.arrowImage}
                                />
                            </TouchableOpacity>
                        </View>
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
        fontSize: Dimensions.get('window').height * .025,
        fontWeight: 'bold'
    },
    sectionContainer: {
        marginTop: Dimensions.get('window').height * .035,
        marginLeft: Dimensions.get('window').width * .025,
    },
    sectionTitle: {
        fontSize: Dimensions.get('window').height * .025,
        fontWeight: 'bold'
    },
    sectionScrollView: {
        marginTop: Dimensions.get('window').height * .015,
    },
    inSectionView: {
        marginRight: Dimensions.get('window').width * .013,
        height: Dimensions.get('window').height * .125,
        width: Dimensions.get('window').width * .3,
        borderWidth: 2,
        borderColor: 'gainsboro',
        borderRadius: 17
    },
    inSectionImageViewContainer: {
        height: Dimensions.get('window').height * .073,
    },
    inSectionImageView: {
        height: Dimensions.get('window').height * .0745,
        backgroundColor: 'gainsboro',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },
    trainerImage: {

    },
    trainerPreviewText: {
        height: Dimensions.get('window').height * .0475,
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
        textAlign: 'center'
    },
    starIcon: {
        height: Dimensions.get('window').height * .0112,
        width: Dimensions.get('window').width * .0245,
        alignSelf: 'center'
    },
    categoryImage: {

    },
    categoryPreviewText: {
        height: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width * .3,

    },
    categoryText1: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    categoryText2: {
        fontSize: Dimensions.get('window').height * .0112,
        textAlign: 'center'
    },
    placesSectionContainer: {
        marginTop: 35,
        marginLeft: Dimensions.get('window').width * .0112,
    },
    placesTitle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    placesScrollView: {

    },
    placeView: {
        marginTop: 10,
        marginRight: 5,
        height: Dimensions.get('window').height * .125,
        width: Dimensions.get('window').width * .3,
        borderWidth: 2,
        borderColor: 'gainsboro',
        borderRadius: 20
    },
    placeImageViewContainer: {
        height: '60%',
    },
    placeImageView: {
        height: '100%',
        backgroundColor: 'gainsboro',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15
    },
    placeImage: {

    },
    placePreviewText: {
        height: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width * .3,

    },
    placeText1: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    placeText2: {
        fontSize: 10,
        textAlign: 'center'
    },
    whyShareQandAUpdatesButtonsView: {
        marginTop: Dimensions.get('window').height * .035,
        width: Dimensions.get('window').width,
    },
    whyShareQandAUpdatesButtonsRow: {
        flexDirection: 'row',
        width: Dimensions.get('window').width * .95,
        justifyContent: 'space-between',
        alignSelf: 'center'
    },
    whyUsButton: {
        width: Dimensions.get('window').width * .23,
        height: Dimensions.get('window').height * .065,
        backgroundColor: 'deepskyblue',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    whyUsTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    },
    shareAndEarnButton: {
        width: Dimensions.get('window').width * .23,
        height: Dimensions.get('window').height * .065,
        backgroundColor: 'deepskyblue',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    shareAndEarnTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center'
    },
    qAndaButton: {
        width: Dimensions.get('window').width * .23,
        height: Dimensions.get('window').height * .065,
        backgroundColor: 'deepskyblue',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'  
    },
    qAndaTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center'
    },
    updatesButton: {
        width: Dimensions.get('window').width * .23,
        height: Dimensions.get('window').height * .065,
        backgroundColor: 'deepskyblue',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center' 
    },
    updatesTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center'
    },
    socialButtons: {
        flexDirection: 'row',
        width: Dimensions.get('window').width ,
        marginTop: 20,
        alignSelf: 'center'
    },
    facebookButton: {
        width: Dimensions.get('window').width * .5, 
        height: 60
    },
    instegramImage: {
        width: Dimensions.get('window').width * .5, 
        height: 60,
    },
    moreContainer: {
        marginTop: Dimensions.get('window').height * .035,
    },
    moreTitle: {
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .025,
        marginLeft: 20,
    },
    rowsContainer:{
        marginTop: Dimensions.get('window').height * .035,
    },

    eachRowContainer: {
        height: Dimensions.get('window').height * .04,
        justifyContent: 'center',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
    },
    arrowImage: {
        height: Dimensions.get('window').height * .015,
        marginTop: Dimensions.get('window').height * .01,
    },
    arrowButton: {
        
    },
    navigationsRows:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    navigationsRowsTitle: {
        // marginTop: Dimensions.get('window').height * .0020,
        fontSize: Dimensions.get('window').height * .02,
        marginLeft: Dimensions.get('window').width * .05,
    },
    discountCodeButton: {

    },
    customerServicesButton: {

    },
    giftCardButton: {
    },
    deadAreaBottom: {
        backgroundColor: 'whitesmoke',
        height: 30
    },
    customerServicePanel: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        height: Dimensions.get('window').height * .8
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
      },
      title: {
        fontSize: 32,
      },
});

export default StarPage;