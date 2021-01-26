import React, {useState, useContext} from 'react';
import { Button, Text, View, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import {getDistance} from 'geolib';
import Geolocation from '@react-native-community/geolocation';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Feather';

//for using trainerContext
import {TrainerContext} from '../../../context/TrainerContext';

//The claint's around you area page
const AroundYouPage = ({navigation}) => {
    const [maxDistanceSelected, setMaxDistanceSelected] = useState("1");
    const [sliderValue, setSliderValue] = useState("1 MILES");
    const [trainersAroundMe, setTrainersAroundMe] = useState([]);

        const { dispatchTrainerObject,} = useContext(TrainerContext);

    var maxDistance = 1;

    //Sets the slider value to the value
    const handleSliderValueChange = (value) => {
        maxDistance = value;
        getTrainersByDistance();
    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getTrainersByDistance();
        });
    
        
        return unsubscribe;
      }, [navigation]);


    const config = {
        withCredentials: true,
        baseURL: 'http://localhost:3000/',
        headers: {
              "Content-Type": "application/json",
        },
    };

    //GET request using axios, to fetch trainers by distance
    const getTrainersByDistance = async () => {
        await axios  
        .get('/trainers/getAllTrainers',
        config)
        .then((doc) => {
            var trainers = doc.data;
            sortByDistance(trainers);

        })
        .catch((err) =>  {
            console.log(err)
        });
    }


    //Sort trainers by distance
    const sortByDistance = (trainers) => {
        Geolocation.getCurrentPosition(info => {
            //Array to be filled with all the trainers that meet the distance requirement
            var trainersAround = [];

            //Client current location cords
            var clientLatitude = info.coords.latitude;
            var clientLongitude = info.coords.longitude;

            //Run thrhough all trainers and check if they meet the requirments
            for (let index = 0; index < trainers.length; index++) {
                //Trainer object
                const singleTrainer = trainers[index];

                //Trainer trainingsite1 cords
                var trainingSite1Cord = singleTrainer.location.trainingSite1.coordinates;

                //Check if the first location cords array isn't empty
                if (trainingSite1Cord !== []) {
                    //Calculate the distance between trainingsite1 and client cords
                    //Return if the cords are in the selected range
                    var isInRange = calculateDistance(
                        {latitude: clientLatitude, longitude: clientLongitude},
                        {latitude: trainingSite1Cord[0], longitude: trainingSite1Cord[1]});

                    //If the cords are in range
                    if(isInRange) {
                        //Check if trainer isn't already in the array
                        if (!trainersAround.includes(singleTrainer)) {
                            //Push trainer into the array
                            trainersAround.push(singleTrainer);
                        }
                    }
                }
            
                //Check the second location of the trainer (if exists)
                try {
                    //Trainer trainingsite2 cords
                    trainingSite2Cord = singleTrainer.location.trainingSite2.coordinates;

                     //Check if the second location cords array isn't empty
                    if (trainingSite2Cord !== []) {
                        //Calculate the distance between trainingsite2 and client cords
                        //Return if the cords are in the selected range
                        var isInRange = calculateDistance(
                            {latitude: clientLatitude, longitude: clientLongitude},
                            {latitude: trainingSite2Cord[0], longitude: trainingSite2Cord[1]});

                        //If the cords are in range
                        if(isInRange) {
                             //Check if trainer isn't already in the array
                            if (!trainersAround.includes(singleTrainer)) {
                                //Push trainer into the array
                                trainersAround.push(singleTrainer);
                            }
                        }
                    }
                } catch (error) {}
           }
           setTrainersAroundMe(trainersAround);
           setSliderValue(maxDistance+" MILE");
           setMaxDistanceSelected(maxDistance);
        });
    }



    //Parmas: cords of the client location, cords of the trainer location
    //Returns: if the trainer location is within the seleced distance from the client location
    const calculateDistance = (clientCords, trainerCords) => {
        var metersInMile = 1609.344;

        //Calculate distance between client location to trainer cords
        var dis = getDistance(clientCords, trainerCords);
        
        //Distance received in meters - amount of meters in mile
        var distanceInMiles = dis/metersInMile;
        
        //If the distance is in the selected range
        if (distanceInMiles<maxDistance) {
            return true;
        } else {
            return false;
        }
    }

    //Format the categories list to lower case with first letter upper case
    const categoryDisplayFormat = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }



    //Load trainer star rating
    const getStarRating = (reviews) => {
        if (reviews.length === 0) {
            return 0;
        } else {
            var sumStars = 0;
            for (let index = 0; index < reviews.length; index++) {
                const singleReviewStar = reviews[index].stars;
                sumStars += Number(singleReviewStar);
            }
            return ((sumStars/reviews.length).toFixed(1));
        }
    }



    //Show trainers over the UI
    const getTrainersAroundMePattern = () => {
        let repeats = [];
        if (trainersAroundMe !== []) {
            for(let i = 0; i < trainersAroundMe.length; i++) {
                console.log(trainersAroundMe[i].media.images[0]);
                repeats.push(
                    <View key={'trainerRow'+i} style={styles.trainerView}>

                     <TouchableOpacity 
                        onPress={() => handleOnTrainerPressed(trainersAroundMe[i])}>
                        <View style={styles.trainerViewRow}>
                            <TouchableOpacity
                                style={styles.trainerImage}
                            >
                                <FastImage
                                            style={styles.trainerImage}
                                            source={{
                                            uri: trainersAroundMe[i].media.images[0],
                                            priority: FastImage.priority.normal,
                                            }}
                                            resizeMode={FastImage.resizeMode.strech}
                                />
                            </TouchableOpacity>
                            <View style={styles.trainerDetails}>
                                <Text style={styles.trainerDetail1}>{trainersAroundMe[i].name.first + ' ' + trainersAroundMe[i].name.last}</Text>
                                <Text style={styles.trainerDetail2}>{categoryDisplayFormat(trainersAroundMe[i].categories.join(', '))}</Text>
                                <View style={styles.ratingRow}>
                                    <Text style={styles.trainerDetail3}> {getStarRating(trainersAroundMe[i].reviews)} </Text>
                                    <Image
                                        source={require('../../../images/ratingStar.png')}
                                        
                                    />
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                )
            }
        }
        return repeats;
    };

        const handleOnTrainerPressed = (trainerObject ) => {

        dispatchTrainerObject({
            type: 'SET_TRAINER_OBJECT',
            trainerObject: trainerObject
        })


        navigation.navigate('StarPageStack',
        { screen: 'TrainerOrderPage'  });}



    return(
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Just You</Text>
            </View>
            <View style={styles.aroundYouTitle}>
                <Text style={styles.aroundYouText}>Around You</Text>
            </View>
            <View style={styles.sliderContainer}>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={styles.maxDistanceText}>Distance range - </Text>
                    <Text style={styles.sliderValueTitle}>{sliderValue}</Text>
                    <Icon name="map-pin" size={23} style={styles.locationIcon} /> 
                </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={100}
                        minimumTrackTintColor="deepskyblue"
                        maximumTrackTintColor="#000000"
                        onValueChange={(value) => handleSliderValueChange(value)}
                        step={1}
                        thumbTintColor='deepskyblue'
                    />
            </View>

            <View style={styles.verifyExplenationContainer}>
                <Text style={styles.verifyExplenationText}>We'll present all the trainers that provide workouts inside the radius of the selected distance range.</Text>
              </View>


              <View style={styles.aroundYouTitle}>
                <Text style={styles.aroundYouText}>Trainers </Text>
            </View>
        
            <ScrollView>
            {getTrainersAroundMePattern()}
            </ScrollView>
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
        fontSize: Dimensions.get('window').height * 0.03,
        fontWeight: 'bold'
    },
    aroundYouTitle: {
        marginLeft: Dimensions.get('window').width * 0.022,
        marginTop: Dimensions.get('window').height * 0.04
    },
    aroundYouText: {
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * 0.03,
    },
    sliderContainer: {
        marginTop: Dimensions.get('window').height * 0.025,
    },  
    maxDistanceText: {
        fontSize: Dimensions.get('window').height * 0.022,
        marginTop: Dimensions.get('window').height * 0.025,
        marginLeft: Dimensions.get('window').width * 0.019,
        fontWeight: '500'
    },  
    sliderValueTitle: {
        //alignSelf: 'center',
        fontSize: Dimensions.get('window').width * .05,
        marginTop: Dimensions.get('window').height * .023,
        marginLeft: Dimensions.get('window').width * 0.019
    },
    slider: {
        width: Dimensions.get('window').width * .85,
        alignSelf: 'center',
        marginTop: Dimensions.get('window').height * .015
    },
    pricingLabels: {
        marginTop: Dimensions.get('window').height * 0.019,
        marginLeft: Dimensions.get('window').width * 0.019,
        marginBottom: Dimensions.get('window').height * 0.019,
        flexDirection: 'row'
    },  
    trainersPricing: {
        width: Dimensions.get('window').width * .275,
        height: Dimensions.get('window').height * .04,
        borderWidth: 3,
        borderColor: 'deepskyblue',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        alignItems: 'center',
        backgroundColor: 'deepskyblue'
    },
    trainersPricingLabeld: {
        width: Dimensions.get('window').width * .275,
        height: Dimensions.get('window').height * .04,
        borderWidth: 3,
        borderColor: 'deepskyblue',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    trainersText: {
        fontSize: Dimensions.get('window').height * 0.022,
        color: 'white',
        fontWeight: 'bold'
    },
    trainersTextLabeld: {
        fontSize: Dimensions.get('window').height * 0.022,
        color: 'deepskyblue',
        fontWeight: 'bold'
    },
    placesPricing: {
        width: Dimensions.get('window').width * .275,
        height: Dimensions.get('window').height * .04,
        borderWidth: 3,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderColor: 'deepskyblue',
        alignItems: 'center'
    },
    placesPricingLabeld: {
        width: Dimensions.get('window').width * .275,
        height: Dimensions.get('window').height * .04,
        borderWidth: 3,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderColor: 'deepskyblue',
        backgroundColor: 'deepskyblue',
        alignItems: 'center'
    },
    placesText: {
        fontSize: Dimensions.get('window').height * 0.022,
        color: 'deepskyblue',
        fontWeight: 'bold'
    },
    placesTextLabeld: {
        fontSize: Dimensions.get('window').height * 0.022,
        color: 'white',
        fontWeight: 'bold'
    },
    trainerView: {
        width: Dimensions.get('window').width,
        marginLeft: Dimensions.get('window').width * 0.019,
        marginTop: Dimensions.get('window').height * 0.022
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
        marginLeft: Dimensions.get('window').width * 0.022
    },
    trainerDetail1: {
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * 0.029
    },
    trainerDetail2: {
        fontSize: Dimensions.get('window').height * 0.021
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    trainerDetail3: {
        fontSize: Dimensions.get('window').height * 0.021
    },
    ratingIcon: {

    },
    placeView: {
        width: Dimensions.get('window').width,
        marginLeft: Dimensions.get('window').width * 0.018,
        marginTop: Dimensions.get('window').height * 0.022
    },
    placeViewRow: {
        flexDirection: 'row',
    },
    placeImage: {
        height: Dimensions.get('window').height * .1,
        width: Dimensions.get('window').height * .1,
        borderRadius: 15,
        backgroundColor: 'gainsboro'
    },
    placeDetails: {
        justifyContent: 'center',
        marginLeft: Dimensions.get('window').width * 0.018
    },
    placeDetail1: {
        fontWeight: 'bold',
        fontSize: 23
    },
    placeDetail2: {
        fontSize: 18
    },
    placeDetail3: {
        fontSize: 18
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
    locationIcon: {
        marginTop: Dimensions.get('window').height * .024,
        marginLeft: Dimensions.get('window').width * .02,
        width: Dimensions.get('window').width * .060,
        height: Dimensions.get('window').height * .03,
    },
});

export default AroundYouPage;