import React from 'react';
import { Button, Text, View, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

//The claint's start area page
const StarPage = ({navigation}) => {

    //Handle when the client presses on a trainer button
    const handleOnTrainerPressed = () => {
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
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Just You</Text>
                </View>
                <View style={styles.popularSectionContainer}>
                    <Text style={styles.popularTitle}>Popular</Text>
                    <ScrollView 
                        style={styles.popularScrollView} 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={styles.trainerView}>
                            <View style={styles.trainerImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.trainerImageView}
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
                        </View>
                        <View style={styles.trainerView}>
                            <View style={styles.trainerImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.trainerImageView}
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
                        </View>
                        <View style={styles.trainerView}>
                            <View style={styles.trainerImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.trainerImageView}
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
                        </View>
                        <View style={styles.trainerView}>
                            <View style={styles.trainerImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.trainerImageView}
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
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.categoriesSectionContainer}>
                    <Text style={styles.categoriesTitle}>Categories</Text>
                    <ScrollView 
                        style={styles.categoriesScrollView} 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={styles.categoryView}>
                            <View style={styles.categoryImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.categoryImageView}
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
                        <View style={styles.categoryView}>
                            <View style={styles.categoryImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.categoryImageView}
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
                        <View style={styles.categoryView}>
                            <View style={styles.categoryImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.categoryImageView}
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
                        <View style={styles.categoryView}>
                            <View style={styles.categoryImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.categoryImageView}
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
                <View style={styles.placesSectionContainer}>
                    <Text style={styles.placesTitle}>Places</Text>
                    <ScrollView 
                        style={styles.placesScrollView} 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={styles.placeView}>
                            <View style={styles.placeImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.placeImageView}
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
                        <View style={styles.placeView}>
                            <View style={styles.placeImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.placeImageView}
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
                        <View style={styles.placeView}>
                            <View style={styles.placeImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.placeImageView}
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
                        <View style={styles.placeView}>
                            <View style={styles.placeImageViewContainer}>
                                <TouchableOpacity
                                    style={styles.placeImageView}
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
                </View>
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
                    <View style={styles.rowContainer}>
                        <View style={styles.discountCodeRow}>
                            <TouchableOpacity
                                onPress={() => handleOnDiscountCodePressed()}
                            >
                                <Text style={styles.discountCodeTitle}>Discount Code</Text>
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
                    <View style={styles.rowContainer}>
                        <View style={styles.customerServiceRow}>
                            <TouchableOpacity
                                onPress={() => handleOnCustomerSrvicePressed()}
                            >
                                <Text style={styles.customerServicesTitle}>Customer Service</Text>
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
                    <View style={styles.rowContainer}>
                        <View style={styles.giftCardRow}>
                            <TouchableOpacity
                                onPress={() => handleOnGiftCardPurchasePressed()}
                            >
                                <Text style={styles.giftCardTitle}>Gift Card Purchase</Text>
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
        fontSize: 25,
        fontWeight: 'bold'
    },
    popularSectionContainer: {
        marginTop: 35,
        marginLeft: 10
    },
    popularTitle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    popularScrollView: {
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
    trainerImageViewContainer: {
        height: '60%'
    },
    trainerImageView: {
        height: '100%',
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
    categoriesSectionContainer: {
        marginTop: 35,
        marginLeft: 10
    },
    categoriesTitle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    categoriesScrollView: {

    },
    categoryView: {
        marginTop: 10,
        marginRight: 5,
        height: Dimensions.get('window').height * .125,
        width: Dimensions.get('window').width * .3,
        borderWidth: 2,
        borderColor: 'gainsboro',
        borderRadius: 20
    },
    categoryImageViewContainer: {
        height: '60%',
    },
    categoryImageView: {
        height: '100%',
        backgroundColor: 'gainsboro',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15
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
        fontSize: 10,
        textAlign: 'center'
    },
    placesSectionContainer: {
        marginTop: 35,
        marginLeft: 10
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
        marginTop: 25,
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
        marginTop: 20,
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
    discountCodeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    discountCodeTitle: {
        fontSize: 20,
        marginLeft: 20,
    },
    discountCodeButton: {

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
    giftCardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    giftCardTitle: {
        fontSize: 20,
        marginLeft: 20,
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
    }
});

export default StarPage;