import React, {useContext, useState, useEffect} from 'react';
import { Button, Text, View, SafeAreaView, Image, StyleSheet, Dimensions} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';

import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';

import {OrderContext} from '../../../context/OrderContext';
import {ClientContext} from '../../../context/ClientContext';
import Icon from 'react-native-vector-icons/Feather';
import FastImage from 'react-native-fast-image';


//The clients's order page - pennding + approved
const PendingApprovalOrders = ({route, navigation}) => {
    // const { routeIsPending } = route.params.isPending;

    const {clientId} = useContext(ClientContext);
    const {orderObject, dispatchOrderObject} = useContext(OrderContext);


    const [isPending, setIsPending] = useState(true);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [approvedOrders, setApprovedOrders] = useState([]);


    const config = {
        withCredentials: true,
        baseURL: 'https://justyou.iqdesk.info:443/',
        headers: {
          "Content-Type": "application/json",
        },
    };


    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getClientOrders();
        });


        return unsubscribe;
      }, [navigation]);



    //Sets the single/couple flipToggle value
    const handleFlipToggle = () => {

        getClientOrders();
        setIsPending(!isPending);
    }


    //Get all orders by Client ID, sort by time created, assaign to designated const
    const getClientOrders = () => {
        axios
            .get('/orders/by-client-id/'+clientId,
            config
            )
            .then((doc) => {
                let allOrders = doc.data;
                let pendingOrders = [];
                let approvedOrders = [];
                console.log('****************doc.data*****************');
                console.log(doc.data);

                for (let index = 0; index < allOrders.length; index++) {
                    const singleOrder = allOrders[index];
                    if (singleOrder.status === "pending") {
                        pendingOrders.push(singleOrder);
                    } else if (singleOrder.status === "approved") {
                        approvedOrders.push(singleOrder);
                    }
                }

                pendingOrders = sortOrders(pendingOrders);
                approvedOrders = sortOrders(approvedOrders);

                setPendingOrders(pendingOrders);
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



    const getPendingOrdersPattern = () => {
        let repeats = [];
        if (pendingOrders !== []) {
            for(let i = 0; i < pendingOrders.length; i++) {
                repeats.push(
                    <TouchableOpacity
                    onPress={() => handleOnArrowPendingPressed(i)}
                    key = {'ordersRow' + i}

                    >
                        <View style={i % 2 === 0? styles.pendingOrder : styles.pendingOrderSecond}>
                            <FastImage
                                        style={styles.image}
                                        source={{
                                        uri: pendingOrders[i].trainer.profilePic,
                                        priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.stretch}
                            />
                            <View style={styles.nameBox}>
                                <Text style={styles.nameText}>{pendingOrders[i].trainer.firstName + " " + pendingOrders[i].trainer.lastName }</Text>
                            </View>
                            <View style={styles.dateBox}>
                                <Text style={styles.dateText}>{pendingOrders[i].trainingDate.startTime.slice(0, 10)}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.arrowButton}
                                onPress={() => handleOnArrowPendingPressed(i)}
                            >
                                {/* <Icon name="chevron-right" size={18} style={styles.arrow} /> */}
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )
            }
        }
        return repeats;
    };



    const getApprovedOrdersPattern = () => {
        let repeats = [];
        if (approvedOrders.length !== 0) {
            for(let i = 0; i < approvedOrders.length; i++) {
                repeats.push(
                    <TouchableOpacity
                        key = {'ordersRow' + i}
                        onPress={() => handleArrowApprovedPressed(i)}
                        >
                        <View style={i % 2 === 0? styles.pendingOrder : styles.pendingOrderSecond}>
                            <FastImage
                                        style={styles.image}
                                        source={{
                                        uri: approvedOrders[i].trainer.profilePic,
                                        priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.stretch}
                            />
                        <View style={styles.nameBox}>
                            <Text style={styles.nameText}>{approvedOrders[i].trainer.firstName + " " + approvedOrders[i].trainer.lastName }</Text>
                        </View>
                        <View style={styles.dateBox}>
                            <Text style={styles.dateText}>{approvedOrders[i].trainingDate.startTime.slice(0, 10)}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.arrowButton}
                            onPress={() => handleArrowApprovedPressed(i)}
                        >
                            <Icon name="chevron-right" size={18} style={styles.arrow} />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                )
            }
        }
        return repeats;
    };

    const handleArrowButton = () => {
        navigation.dangerouslyGetParent().setOptions({
            tabBarVisible: true
        })
        navigation.navigate('ProfilePage');
    }

    const handleOnArrowPendingPressed = (index) => {
        console.log('pendingOrders[index]')
        console.log(pendingOrders[index])

        dispatchOrderObject({
            type: 'SET_ORDER_OBJECT',
            orderObject: pendingOrders[index]
        });

        navigation.navigate('ProfilePageStack',
             { screen: 'PendingApprovalOrderDetails' ,
             params: { orderObject: pendingOrders[index]}
            });

    }


    const handleArrowApprovedPressed = (index) => {

        console.log('pendingOrders[index]')
        console.log(pendingOrders[index])
        dispatchOrderObject({
            type: 'SET_ORDER_OBJECT',
            orderObject: approvedOrders[index]
        });
        console.log('in press specific order ', index, approvedOrders[index])
        navigation.navigate('ProfilePageStack',
             { screen: 'PendingApprovalOrderDetails' ,
             params: { orderObject: approvedOrders[index]}
            });

    }

    return(
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.justYouHeader}>Just You</Text>

                    <View style={styles.backButton}>
                        <ArrowBackButton
                            onPress={handleArrowButton}
                        />
                    </View>

                </View>
                <View style={ styles.pendingOrApprovedContainer}>
                    <TouchableOpacity
                        style={isPending ? styles.pendingLabeld : styles.pendingNotLabeld}
                        onPress={() => handleFlipToggle()}
                    >
                        <Text style={isPending ? styles.pendingTextLabeld : styles.pendingTextNotLabeld}>PENDING</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={isPending ? styles.approvedLabeld : styles.approvedNotLabeld}
                        onPress={() => handleFlipToggle()}
                    >
                        <Text style={isPending ? styles.approvedTextNotLabeld : styles.approvedTextLabeld}>APPROVED</Text>
                    </TouchableOpacity>
                </View>
                {isPending ?
                    <View style={styles.pendingContainer}>
                        <View style={styles.pendingOrderView}>
                            {pendingOrders.length === 0 ?
                            <View>
                                    <Image
                                        source={require('../../../images/noOrders.png')}
                                        style={styles.noOrdersImage}
                                    />
                                  <Text style={styles.noOrdersTitle}>{"NO PENDING ORDERS"}</Text>
                                  <Text style={styles.noOrdersMessage}>{"Looks like you haven't received orders yet."}</Text>
                            </View>
                            :
                            getPendingOrdersPattern()}
                        </View>
                    </View>
                    :
                    <View style={styles.pendingContainer}>
                        <View style={styles.pendingOrderView}>
                            {approvedOrders.length === 0 ?
                            <View>
                                <Image
                                    source={require('../../../images/noOrders.png')}
                                    style={styles.noOrdersImage}
                                />
                                <Text style={styles.noOrdersTitle}>{"NO APPROVED ORDERS"}</Text>
                                <Text style={styles.noOrdersMessage}>{"Looks like you haven't approved orders yet."}</Text>
                            </View>
                            :
                            getApprovedOrdersPattern()}
                        </View>

                    </View>
                    }
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'white'
    },
    container: {
        backgroundColor: 'white',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    headerContainer: {
        alignItems: 'center',
    },
    justYouHeader: {
        fontSize: Dimensions.get('window').height * .025,
        fontWeight: 'bold'
    },
    backButton: {
        marginRight : Dimensions.get('window').width * .88
    },
    partnerText: {
        color: 'deepskyblue',
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .018
    },
    pendingOrApprovedContainer:{
        flexDirection: 'row',
        marginTop: Dimensions.get('window').height * .033,
        marginLeft: Dimensions.get('window').width * .225
    },
    pendingLabeld: {
        width: Dimensions.get('window').width * .275,
        height: Dimensions.get('window').height * .04,
        borderWidth: 3,
        borderColor: 'deepskyblue',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        alignItems: 'center',
        backgroundColor: 'deepskyblue',
        justifyContent: 'center'
    },
    pendingNotLabeld: {
        width: Dimensions.get('window').width * .275,
        height: Dimensions.get('window').height * .04,
        borderWidth: 3,
        borderColor: 'deepskyblue',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    pendingTextLabeld: {
        fontSize: Dimensions.get('window').height * .02,
        color: 'white',
        fontWeight: 'bold'
    },
    pendingTextNotLabeld: {
        fontSize: Dimensions.get('window').height * .02,
        color: 'deepskyblue',
        fontWeight: 'bold'
    },
    approvedLabeld: {
        width: Dimensions.get('window').width * .275,
        height: Dimensions.get('window').height * .04,
        borderWidth: 3,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderColor: 'deepskyblue',
        alignItems: 'center',
        justifyContent: 'center'
    },
    approvedNotLabeld: {
        width: Dimensions.get('window').width * .275,
        height: Dimensions.get('window').height * .04,
        borderWidth: 3,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderColor: 'deepskyblue',
        backgroundColor: 'deepskyblue',
        alignItems: 'center',
        justifyContent: 'center'
    },
    approvedTextNotLabeld: {
        fontSize: Dimensions.get('window').height * .02,
        color: 'deepskyblue',
        fontWeight: 'bold'
    },
    approvedTextLabeld: {
        fontSize: Dimensions.get('window').height * .02,
        color: 'white',
        fontWeight: 'bold'
    },
    pendingContainer: {
        marginTop: Dimensions.get('window').height * .033,
    },
    pendingOrderView: {
        borderTopWidth: 2,
        borderTopColor: 'lightgrey',
    },
    pendingOrder: {
        backgroundColor: 'whitesmoke',
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        alignSelf: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        borderBottomColor: 'lightgrey',
    },
    pendingOrderSecond: {
        backgroundColor: 'white',
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        alignSelf: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        borderBottomColor: 'lightgrey',
    },
    image: {
        marginTop: Dimensions.get('window').height * .010,
        marginBottom: Dimensions.get('window').height * .010,
        marginLeft: Dimensions.get('window').width * .050,
        backgroundColor: 'transparent',
        height: Dimensions.get('window').height * .066,
        width: Dimensions.get('window').height * .066,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2.5,
        elevation: 3
    },
    nameBox: {
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width * .375
    },
    nameText: {
        fontSize: Dimensions.get('window').height * .02,
        fontWeight: '500'
    },
    dateBox: {
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width * .275
    },
    dateText: {
        fontSize: Dimensions.get('window').height * .02,
        fontWeight: '500'
    },
    arrow: {
        marginTop: Dimensions.get('window').height * .034,
        marginRight: Dimensions.get('window').width * .02,
        width: 25,
        height: 25,
    },
    arrowButton: {
    },
    noOrdersTitle: {
        marginTop: Dimensions.get('window').height * .02,
        alignSelf: 'center',
        fontSize: Dimensions.get('window').height * .03,
        fontWeight: '600'
    },
    noOrdersMessage: {
        marginTop: Dimensions.get('window').height * .01,
        alignSelf: 'center',
        fontSize: Dimensions.get('window').height * .02,
    },
    noOrdersImage: {
        marginTop: Dimensions.get('window').height * .02,
        alignSelf: 'center',
        width: Dimensions.get('window').width * .9,
        height: Dimensions.get('window').height * .4,
    }
});

export default PendingApprovalOrders;






