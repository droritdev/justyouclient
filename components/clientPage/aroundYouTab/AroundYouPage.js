import React, {useState} from 'react';
import { Button, Text, View, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

//The claint's around you area page
const ProfilePage = ({navigation}) => {

    const [isTrainers, setIsTrainers] = useState(true);

    const handleFlipToggle = () => {
        setIsTrainers(!isTrainers);
    }

    return(
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Just You</Text>
            </View>
            <View style={styles.aroundYouTitle}>
                <Text style={styles.aroundYouText}>Around You</Text>
            </View>
            <View style={styles.sliderContainer}>
                <Text style={styles.maxDistanceText}>DISTANCE RANGE</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={100}
                    minimumTrackTintColor="deepskyblue"
                    maximumTrackTintColor="#000000"
                    //onValueChange={(value) => handleSliderValueChange(value)}
                    step={1}
                    thumbTintColor='deepskyblue'
                />
            </View>
            <View style={ styles.pricingLabels}>
              <TouchableOpacity 
                style={isTrainers ? styles.trainersPricing : styles.trainersPricingLabeld}
                onPress={handleFlipToggle}
              >
                <Text style={isTrainers ? styles.trainersText : styles.trainersTextLabeld}>TRAINERS</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={isTrainers ? styles.placesPricing : styles.placesPricingLabeld}
                onPress={handleFlipToggle}
              >
                <Text style={isTrainers ? styles.placesText : styles.placesTextLabeld}>PLACES</Text>
              </TouchableOpacity>
            </View>
            {isTrainers ?
                <ScrollView>
                    <View style={styles.trainerView}>
                        <View style={styles.trainerViewRow}>
                            <TouchableOpacity
                                style={styles.trainerImage}
                            >
                                <Image

                                />
                            </TouchableOpacity>
                            <View style={styles.trainerDetails}>
                                <Text style={styles.trainerDetail1}>Ivgeni Shatz</Text>
                                <Text style={styles.trainerDetail2}>Personal Trainer</Text>
                                <View style={styles.ratingRow}>
                                    <Text style={styles.trainerDetail3}>8.7 </Text>
                                    <Image
                                        source={require('../../../images/ratingStar.png')}
                                        
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.trainerView}>
                        <View style={styles.trainerViewRow}>
                            <TouchableOpacity
                                style={styles.trainerImage}
                            >
                                <Image

                                />
                            </TouchableOpacity>
                            <View style={styles.trainerDetails}>
                                <Text style={styles.trainerDetail1}>Koby Lamar</Text>
                                <Text style={styles.trainerDetail2}>Personal Trainer</Text>
                                <View style={styles.ratingRow}>
                                    <Text style={styles.trainerDetail3}>9.1 </Text>
                                    <Image
                                        source={require('../../../images/ratingStar.png')}
                                        
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.trainerView}>
                        <View style={styles.trainerViewRow}>
                            <TouchableOpacity
                                style={styles.trainerImage}
                            >
                                <Image

                                />
                            </TouchableOpacity>
                            <View style={styles.trainerDetails}>
                                <Text style={styles.trainerDetail1}>Judi Woods</Text>
                                <Text style={styles.trainerDetail2}>Personal Trainer</Text>
                                <View style={styles.ratingRow}>
                                    <Text style={styles.trainerDetail3}>7.9 </Text>
                                    <Image
                                        source={require('../../../images/ratingStar.png')}
                                        
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.trainerView}>
                        <View style={styles.trainerViewRow}>
                            <TouchableOpacity
                                style={styles.trainerImage}
                            >
                                <Image

                                />
                            </TouchableOpacity>
                            <View style={styles.trainerDetails}>
                                <Text style={styles.trainerDetail1}>Omer Ohana</Text>
                                <Text style={styles.trainerDetail2}>Personal Trainer</Text>
                                <View style={styles.ratingRow}>
                                    <Text style={styles.trainerDetail3}>8.0 </Text>
                                    <Image
                                        source={require('../../../images/ratingStar.png')}
                                        
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            : 
                <ScrollView>
                    <View style={styles.placeView}>
                        <View style={styles.placeViewRow}>
                            <TouchableOpacity
                                style={styles.placeImage}
                            >
                                <Image

                                />
                            </TouchableOpacity>
                            <View style={styles.placeDetails}>
                                <Text style={styles.placeDetail1}>Studio XPT</Text>
                                <Text style={styles.placeDetail2}>5th Ave, New York</Text>
                                <Text style={styles.placeDetail3}>4 km</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.placeView}>
                        <View style={styles.placeViewRow}>
                            <TouchableOpacity
                                style={styles.placeImage}
                            >
                                <Image

                                />
                            </TouchableOpacity>
                            <View style={styles.placeDetails}>
                                <Text style={styles.placeDetail1}>Lena Studio</Text>
                                <Text style={styles.placeDetail2}>7th St., New York</Text>
                                <Text style={styles.placeDetail3}>5 km</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.placeView}>
                        <View style={styles.placeViewRow}>
                            <TouchableOpacity
                                style={styles.placeImage}
                            >
                                <Image

                                />
                            </TouchableOpacity>
                            <View style={styles.placeDetails}>
                                <Text style={styles.placeDetail1}>Get fit Studio</Text>
                                <Text style={styles.placeDetail2}>8th St., New York</Text>
                                <Text style={styles.placeDetail3}>6 km</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.placeView}>
                        <View style={styles.placeViewRow}>
                            <TouchableOpacity
                                style={styles.placeImage}
                            >
                                <Image

                                />
                            </TouchableOpacity>
                            <View style={styles.placeDetails}>
                                <Text style={styles.placeDetail1}>Grate Shape</Text>
                                <Text style={styles.placeDetail2}>10th Ave, New York</Text>
                                <Text style={styles.placeDetail3}>7 km</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            }
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
        fontSize: 25,
        fontWeight: 'bold'
    },
    aroundYouTitle: {
        marginLeft: 15,
        marginTop: 40
    },
    aroundYouText: {
        fontWeight: 'bold',
        fontSize: 25
    },
    sliderContainer: {
        marginTop: 20
    },  
    maxDistanceText: {
        fontSize: 20,
        marginTop: 20,
        marginLeft: 15,
        fontWeight: '500'
    },  
    slider: {
        width: Dimensions.get('window').width * .95,
        alignSelf: 'center',
        marginTop: 10
    },
    pricingLabels: {
        marginTop: 15,
        marginLeft: 15,
        marginBottom: 15,
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
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    },
    trainersTextLabeld: {
        fontSize: 20,
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
        fontSize: 20,
        color: 'deepskyblue',
        fontWeight: 'bold'
    },
    placesTextLabeld: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    },
    trainerView: {
        width: Dimensions.get('window').width,
        marginLeft: 15,
        marginTop: 20
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
        marginLeft: 20
    },
    trainerDetail1: {
        fontWeight: 'bold',
        fontSize: 23
    },
    trainerDetail2: {
        fontSize: 18
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    trainerDetail3: {
        fontSize: 18
    },
    ratingIcon: {

    },
    placeView: {
        width: Dimensions.get('window').width,
        marginLeft: 15,
        marginTop: 20
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
        marginLeft: 20
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
});

export default ProfilePage;