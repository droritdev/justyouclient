import React from 'react';
import { Button, Text, View, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

//The confirmed orders page
const ConfirmedOrders = ({navigation}) => {

    //Navigates back to the profile page
    const handleOnArrowPress = () => {
        navigation.navigate('ProfilePage');
    }

    return(
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Just You</Text>
            </View>
            <TouchableOpacity
                    onPress={() => handleOnArrowPress()}
                >
                <Image
                    source={require('../../../images/blackArrow.png')}
                    style={styles.arrowBackImage}
                />
            </TouchableOpacity>
            <View style={styles.receiptsHistoryTitle}>
                <Text style={styles.receiptsHistoryText}>Approved</Text>
            </View>
            <ScrollView>
                <View style={styles.orderContainer}>
                    <View style={styles.orderView}>
                        <View style={styles.order}>
                            <TouchableOpacity>
                                <Image
                                    style={styles.image}
                                />
                            </TouchableOpacity>
                            <View style={styles.nameBox}>
                                <Text style={styles.nameText}>Omer Ohana</Text>
                            </View>
                            <View style={styles.dateBox}>
                                <Text style={styles.dateText}>3.6.2020</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.arrowButton}
                                onPress={() => handleOnArrowPendingPressed()}
                            >
                                <Image
                                    source={require('../../../images/arrowBlueButton.png')}
                                    style={styles.arrowImage}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.orderView}>
                        <View style={styles.order}>
                            <TouchableOpacity>
                                <Image
                                    style={styles.image}
                                />
                            </TouchableOpacity>
                            <View style={styles.nameBox}>
                                <Text style={styles.nameText}>Daniel Neeman</Text>
                            </View>
                            <View style={styles.dateBox}>
                                <Text style={styles.dateText}>4.6.2020</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.arrowButton}
                                onPress={() => handleOnArrowPendingPressed()}
                            >
                                <Image
                                    source={require('../../../images/arrowBlueButton.png')}
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
        backgroundColor: 'white',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    header: {
        alignSelf: 'center'
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    arrowBackImage: {
        marginLeft: 20
    },
    receiptsHistoryTitle: {
        marginLeft: 20,
        marginTop: 30
    },
    receiptsHistoryText: {
        fontWeight: 'bold',
        fontSize: 25
    },
    orderContainer: {
        marginTop: 30,
        borderBottomWidth: 2,
        borderBottomColor: 'lightgrey',
    },
    orderView: {
        borderTopWidth: 2,
        borderTopColor: 'lightgrey',
    },
    order: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        width: Dimensions.get('window').width * .95,
        alignSelf: 'center',
        justifyContent: 'space-between',
    },
    image: {
        height: 60,
        width: 60,
        backgroundColor: 'gainsboro',
        borderRadius: 30
    },
    nameBox: {
        backgroundColor: 'gainsboro',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width * .375
    },
    nameText: {
        fontSize: 18,
        fontWeight: '500'
    },
    dateBox: {
        backgroundColor: 'gainsboro',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width * .275
    },
    dateText: {
        fontSize: 18,
        fontWeight: '500'
    },
    arrowImage: {
        marginTop: 5
    },
    arrowButton: {
    },
});

export default ConfirmedOrders;