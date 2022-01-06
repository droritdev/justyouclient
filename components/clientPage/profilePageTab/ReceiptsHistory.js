import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { WebView } from 'react-native-webview';

import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';

import {OrderContext} from '../../../context/OrderContext';
import {ClientContext} from '../../../context/ClientContext';

//The claint's receipts history page
const ReceiptsHistory = ({route, navigation}) => {
    const [modalVisible, setModalVisible] = useState(false)

    //const {clientId} = useContext(ClientContext);
    const { clientId } = route.params
    const {orderObject, dispatchOrderObject} = useContext(OrderContext);
    const {clientObject, dispatchClientObject} = useContext(ClientContext);

    const [approvedOrders, setApprovedOrders] = useState([]);
    const [webViewUri, setWebViewUri] = useState('https://www.google.com');

    const config = {
        withCredentials: true,
        baseURL: 'https://justyou.iqdesk.info:443/',
        headers: {
          "Content-Type": "application/json",
        },
    };

    const configPayme = {
        headers: {
          "Content-Type": "application/json",
          "PayMe-Merchant-Key": "MPL16261-63122P9H-6IKMRQFG-FETGWRDR"
        },
    };

    useEffect(() => {
        getApprovedOrders()
    }, [])

    //Navigates back to the profile page
    const handleOnArrowPress = () => {
        navigation.navigate('ProfilePage');
    }

    const getToken = (i) => {
        axios
            .get('/getPaymeToken/' + clientObject.email.toLowerCase(),
                config
            )
            .then((doc) => {
                if (doc.data.length !== 0) {
                    console.log('getpaymetoken success docdata ', doc.data)
                    showReceipt(i, doc.data[0].paymeToken)
                } else {console.log('getpaymetoken failed 1')}
            })
            .catch((err) => console.log('getpaymetoken failed 1 ', err))
    }

    const getApprovedOrders = () => {
        console.log('clientid ', clientId)
        axios
            .get('/orders/by-client-id/'+clientId,
            config
            )
            .then((doc) => {
                let allOrders = doc.data;
                let approvedOrders = [];
                console.log('*****doc.data*****');
                console.log(doc.data);

                for (let index = 0; index < allOrders.length; index++) {
                    const singleOrder = allOrders[index];
                    if (singleOrder.status === "approved" || singleOrder.status === "completed") {
                        approvedOrders.push(singleOrder);
                    }
                }

                approvedOrders = sortOrders(approvedOrders);

                setApprovedOrders(approvedOrders);
            })
            .catch((err) => {
                console.log(err);
            });
    }


    //Sort orders by time created
    const sortOrders = (ordersArray) => {
        // Iterate Over Array From First Element
        for (let i = 0; i < ordersArray.length; i++) {
            // Iterate Over Array From Succeeding Element
            for (let j = 1; j < ordersArray.length; j++) {
                //checks the time order was created at
                let first = new Date(ordersArray[j - 1].createdAt).getTime();
                let second = new Date(ordersArray[j].createdAt).getTime();
                if (first > second) {
                    // Swap Numbers
                    swapNumbers(ordersArray, j - 1, j);
                }
            }
        }
        return ordersArray;
    }

    const swapNumbers = (array, i, j) => {
        // Save Element Value (Because It Will Change When We Swap/Reassign)
        let temp = array[i];
        // Assign Element2 To Element1
        array[i] = array[j];
        // Assign Element1 To Element2
        array[j] = temp;
    };

    const showReceipt = (i, paymeToken) => {
        console.log('showreceipt approvedorder ', approvedOrders[i])
        axios
        .post(
            'https://preprod.paymeservice.com/api/documents',
            {
                "doc_type": 400,
                "buyer_name": approvedOrders[i].client.firstName + " " + approvedOrders[i].client.lastName,
                "pay_date": approvedOrders[i].updatedAt,
                //"pay_date": "2021-04-16T00:00:00.000Z",
                "currency": "USD",         
                "doc_title": "Receipt",           
                "total_paid": approvedOrders[i].cost,             
                "language": "en",
                "items": [
                    {
                    "description": approvedOrders[i].category + " training",
                    "unit_price": approvedOrders[i].cost,
                    "currency": "USD"
                    }
                ],
                "credit_card": {
                    "sum": approvedOrders[i].cost,
                    "buyer_key": paymeToken
                }
            },
            configPayme
        )
        .then(response => {
            //Alert.alert('payme receipt response url ', response.data.doc_url)
            console.log('payme receipt response data ', response.data)
            const url = response.data.doc_url
            setWebViewUri(url)
            setModalVisible(true)
            // axios
            // .get(
            //     'https://preprod.paymeservice.com/api/documents{job_id}',
            //     configPayme
            // )
            // .then(response => {
            //     console.log('payme query response data ', response.data)
            //     //const url = response.data.url            
            //     //setWebViewUri(url)
            //     setModalVisible(true)
            // })
            // .catch(err => {
            //     console.log('payme query catch error ', err.response.data)
            //     //Alert.alert('Cannot show receipt', JSON.stringify(err.response.data))
            // })
        })
        .catch(err => {
            console.log('payme receipt catch error ', err.response.data)
            //Alert.alert('Cannot create receipt', JSON.stringify(err.response.data))
        })
    }

    const getReceiptsViews = () => {
        let repeats = [];
        if (approvedOrders.length !== 0) {
            for(let i = 0; i < approvedOrders.length; i++) {
                console.log('approvedorderi ', approvedOrders[i])
                repeats.push(
                    <TouchableOpacity
                        key = {'ordersRow' + i}
                        onPress={() => getToken(i)}
                    >
                        <View style={styles.receiptRow}>
                            <Text style={styles.receiptText}>{approvedOrders[i].trainer.firstName + " " + approvedOrders[i].trainer.lastName }</Text>
                            <Text style={styles.receiptText}>{approvedOrders[i].trainingDate.startTime.slice(0, 10)}</Text>
                            <Text style={styles.receiptText}>{'$' + approvedOrders[i].cost}</Text>
                        </View>    
                    </TouchableOpacity>
                )
            }
        }
        return repeats;
    }

    return(
        <SafeAreaView style={styles.safeArea}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <WebView
                        originWhitelist={['*']}
                        style={styles.webView}
                        source={{ uri: webViewUri }}
                    />
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                    <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                </View>
                </View>
            </Modal>
            <View style={styles.header}>
                <Text style={styles.headerText}>Just You</Text>
            </View>
            <ArrowBackButton
                onPress={handleOnArrowPress}
            />
            <View style={styles.receiptsHistoryTitle}>
                <Text style={styles.receiptsHistoryText}>Receipts History</Text>
            </View>
            <ScrollView style={styles.receiptsContainer}>
                {
                    approvedOrders.length === 0 ?
                    <View style={{marginTop: 20}}>
                        <Text style={{textAlign: 'center'}}>There are no receipts</Text>
                    </View> :
                    getReceiptsViews()
                }
                {/* <View style={styles.receiptContainer}>
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
                </View> */}
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
        borderBottomColor: 'gainsboro',
        paddingRight: 20,
        paddingLeft: 20
    },
    receiptText: {
        fontSize: 18
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width,
        justifyContent: 'space-between'
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
      webView: {
        flex: 1,
        width: Dimensions.get('window').width * 0.8
      }
});

export default ReceiptsHistory;