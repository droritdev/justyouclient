import React from 'react';
import { Button, Text, View, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

//The claint's receipts history page
const ReceiptsHistory = ({navigation}) => {

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
                    style={styles.arrowImage}
                />
            </TouchableOpacity>
            <View style={styles.receiptsHistoryTitle}>
                <Text style={styles.receiptsHistoryText}>Receipts History</Text>
            </View>
            <ScrollView style={styles.receiptsContainer}>
                <View style={styles.receiptContainer}>
                    <View style={styles.receiptRow}>
                        <View style={styles.nameDateHourContainer}>
                            <Text style={styles.trainerName}>Ivgeni Shatz</Text>
                            <Text style={styles.dateAndHour}>6/3/2020, 16:32</Text>
                        </View>
                        <View style={styles.priceAndArrow}>
                            <Text style={styles.receiptPrice}>$100.00</Text>
                            <TouchableOpacity 
                                style={styles.arrowButton}
                            >
                                <Image
                                    source={require('../../../images/arrowButton.png')}
                                    style={styles.arrowReceiptImage}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.receiptContainer}>
                    <View style={styles.receiptRow}>
                        <View style={styles.nameDateHourContainer}>
                            <Text style={styles.trainerName}>Koby Lamar</Text>
                            <Text style={styles.dateAndHour}>6/4/2020, 16:32</Text>
                        </View>
                        <View style={styles.priceAndArrow}>
                            <Text style={styles.receiptPrice}>$150.00</Text>
                            <TouchableOpacity 
                                style={styles.arrowButton}
                            >
                                <Image
                                    source={require('../../../images/arrowButton.png')}
                                    style={styles.arrowReceiptImage}
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
    arrowImage: {
        marginLeft: 20,
        marginTop: 20
    },
    receiptsHistoryTitle: {
        marginLeft: 20,
        marginTop: 30
    },
    receiptsHistoryText: {
        fontWeight: 'bold',
        fontSize: 25
    },
    receiptsContainer: {
        marginTop: 30,
        borderTopColor: 'gainsboro',
        borderTopWidth: 2,
        width: Dimensions.get('window').width,
    },
    receiptRow: {
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        justifyContent: 'space-between',
        alignItems: 'center',
        height: Dimensions.get('window').height * .07,
        borderBottomWidth: 2,
        borderBottomColor: 'gainsboro'
    },
    nameDateHourContainer: {
        marginLeft: 20,
    },
    trainerName: {
        fontSize: 20
    },
    dateAndHour: {
        color: 'grey',
        marginTop: 5
    },
    priceAndArrow: {
        flexDirection: 'row'
    },
    receiptPrice: {
        color: 'grey',
        fontSize: 15
    },
    arrowReceiptImage: {
        height: 20,
    },
});

export default ReceiptsHistory;