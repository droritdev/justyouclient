import React, {useContext, useState, useEffect} from 'react';
import {Alert, Text, View, SafeAreaView, Image, StyleSheet, Dimensions} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import {OrderContext} from '../../../context/OrderContext';
import FastImage from 'react-native-fast-image';
import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';

import Icon from 'react-native-vector-icons/Feather';
import Dialog from 'react-native-dialog';


//The trainer's order page - pennding + approved
const PendingApprovalOrderDetails = ({navigation, route}) => {

    // const {orderObject} = useContext(OrderContext);
    const { orderObject } = route.params;

    const [orderStatus, setOrderStatus] = useState('');
    const [approveClicked, setApproveClicked] = useState(false);
    const [declineClicked, setDeclineClicked] = useState(false);
    // const [timeOccupiedMessage, setTimeOccupiedMessage] = useState(false);

    //Format the categories list to lower case with first letter upper case
    const textDisplayFormat = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    //Hide bottom navgation UI
    useEffect(() => {

       navigation.dangerouslyGetParent().setOptions({
        tabBarVisible: false
       })
       setOrderStatus(orderObject.status)
    }, []);


    //Axios post config
    const config = {
        withCredentials: true,
        baseURL: 'http://localhost:3000/',
        headers: {
          "Content-Type": "application/json",
        },
    };


    //Show bottom navgation UI
    const handleArrowButton = () => {
        navigation.dangerouslyGetParent().setOptions({
            tabBarVisible: true
        })
        navigation.navigate('PendingApprovalOrders');
    }


    const handleChatPressed = () => {
        // navigation.navigate('Chat', orderObject.trainer.id);
        navigation.navigate('ProfilePageStack', {
            screen: 'Chat' ,
            params: { trainerID: orderObject.trainer.id}});

    }


    //Dismiss pop-up
    const handleDismiss = () => {
        setDeclineClicked(false);
        setApproveClicked(false);
    }

    return(
        <SafeAreaView style={styles.safeArea}>
            <View>
                <Dialog.Container visible={approveClicked}>
                    <Dialog.Title>Approve Order</Dialog.Title>
                    <Dialog.Description>Do you want to approve this order ?</Dialog.Description>
                    <Dialog.Button label="No" onPress={()=>handleDismiss()} />
                    <Dialog.Button label="Yes" onPress={()=>handleApproveClicked()} />
                </Dialog.Container>
            </View>

            <View>
                <Dialog.Container visible={declineClicked}>
                    <Dialog.Title>Decline Order</Dialog.Title>
                    <Dialog.Description>Do you want to decline this order ?</Dialog.Description>
                    <Dialog.Button label="No" onPress={()=>handleDismiss()} />
                    <Dialog.Button label="Yes" onPress={()=>handleDeclineClicked()} />
                </Dialog.Container>
            </View>

            <ScrollView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.justYouHeader}>Just You</Text>
                </View>
                <ArrowBackButton
                onPress={handleArrowButton}
                />
                <Text style={styles.pendingTitle}>Order pending for approval</Text>

                <View style={styles.imageNameRowContainer}>
                        <FastImage
                                    style={styles.profileImage}
                                    source={{
                                    uri: orderObject.trainer.profilePic,
                                    priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.stretch}
                        />
                        <View style={styles.nameButtonsColumContainer}>
                            <View style={styles.nameBox}>
                                <Text style={styles.nameText}>{orderObject.trainer.firstName + " " + orderObject.trainer.lastName}</Text>
                            </View>

                            <View style={styles.buttonsRowContaier}>
                                <View style={styles.buttonsRow}>
                                    {/* <View style={styles.buttonAndTitle}>
                                        <TouchableOpacity style={styles.iconBackStyle}>
                                            <Icon name="phone-call" size={30} style={styles.phoneCallIcon}/>

                                        </TouchableOpacity>
                                        <Text style={styles.buttonTitle}>Call</Text>
                                    </View>
                                    <View style={styles.buttonAndTitle}>
                                        <TouchableOpacity
                                        style={styles.iconBackStyle}
                                        onPress={()=> handleChatPressed()}>
                                            <Icon name="message-circle" size={30} style={styles.messageIcon}/>
                                        </TouchableOpacity>

                                        <Text style={styles.buttonTitle}>Chat</Text>
                                    </View> */}
                                    <View style={styles.buttonsRowContaier}>
                                        <TouchableOpacity
                                            onPress={()=>handleChatPressed()}
                                            style={styles.chatButton}
                                        >
                                            <Icon name="message-circle" size={30} style={styles.messageIcon}/>
                                            {orderObject.trainer.name!==undefined?
                                                <Text style={styles.approveButtonText}>{'Contact ' + orderObject.trainer.name.first}</Text>
                                            :
                                            <Text style={styles.approveButtonText}>{'Contact'}</Text>
                                            }
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                        </View>

                </View>






                <View style={styles.orderInformationContainer}>
                    <View style={styles.orderRow}>
                        <Text style={styles.title}>Date:</Text>
                        <View style={styles.informationView}>
                            <Text style={styles.informationText}>{orderObject.trainingDate.startTime.slice(0, 10)}</Text>
                        </View>
                    </View>
                    <View style={styles.orderRowSecond}>
                        <Text style={styles.title}>Time:</Text>
                        <View style={styles.informationView}>
                            <Text style={styles.informationText}>{orderObject.trainingDate.startTime.slice(11, 16) + ' - ' + orderObject.trainingDate.endTime.slice(11, 16)}</Text>
                        </View>
                    </View>
                    <View style={styles.orderRow}>
                        <Text style={styles.title}>Address:</Text>
                        <View style={styles.addressView}>
                            <Text style={styles.informationText}>{orderObject.location.address}</Text>
                        </View>
                    </View>
                    <View style={styles.orderRowSecond}>
                        <Text style={styles.title}>Type of training:</Text>
                        <View style={styles.informationView}>
                            <Text style={styles.informationText}>{textDisplayFormat(orderObject.type)}</Text>
                        </View>
                    </View>
                    <View style={styles.orderRow}>
                        <Text style={styles.title}>Category:</Text>
                        <View style={styles.informationView}>
                            <Text style={styles.informationText}>{textDisplayFormat(orderObject.category)}</Text>
                        </View>
                    </View>
                    <View style={styles.orderRowSecond}>
                        <Text style={styles.title}>Cost:</Text>
                        <View style={styles.informationView}>
                            <Text style={styles.informationText}>{orderObject.cost + '$'}</Text>
                        </View>
                    </View>
                </View>







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
        fontSize: Dimensions.get('window').height * .027,
        fontWeight: 'bold'
    },
    pendingTitle: {
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: Dimensions.get('window').height * .03,
        marginLeft: Dimensions.get('window').width * .0483,
    },
    imageNameRowContainer: {
        marginTop: Dimensions.get('window').height * .04,
        flexDirection: 'row',
        width: Dimensions.get('window').width * .9,
        alignSelf: 'center',

    },
    profileImage: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2.5,
        elevation: 3,
        width: Dimensions.get('window').height * .09,
        height: Dimensions.get('window').height * .09,
        borderRadius: 40
    },
    nameAndButtonsContainer: {

    },
    nameTitle: {
        fontSize: Dimensions.get('window').height * .0278,
        fontWeight: 'bold',
    },
    buttonsRow: {
        flexDirection: 'row',
        marginTop: Dimensions.get('window').height * .011,
        justifyContent: 'space-between'
    },
    buttonAndTitle: {
        alignItems: 'center'
    },
    buttonTitle: {
        marginTop: Dimensions.get('window').height * .005,
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .011
    },
    buttonsRowContaier: {
        width: Dimensions.get('window').width * .35,
        alignSelf: 'center'
    },
    chatButton: {
        flexDirection: 'row',
        marginLeft: Dimensions.get('window').width * .020,
        marginTop: Dimensions.get('window').height * .015,
        height: Dimensions.get('window').height * .035,
        width: Dimensions.get('window').width * .65,
        alignSelf: 'center',
        backgroundColor: 'deepskyblue',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    approveButton: {
        flex: 1,
        marginTop: Dimensions.get('window').height * .15,
        height: Dimensions.get('window').height * .055,
        width: Dimensions.get('window').width * .85,
        alignSelf: 'center',
        backgroundColor: 'deepskyblue',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    declineButton: {
        flex: 1,
        marginTop: Dimensions.get('window').height * .15,
        height: Dimensions.get('window').height * .055,
        width: Dimensions.get('window').width * .85,
        alignSelf: 'center',
        backgroundColor: '#2eb82e',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    approveButtonText: {
        fontSize: Dimensions.get('window').height * .022,
        color: 'white',
        fontWeight: 'bold'
    },
    topBorder: {
        borderTopWidth: 2,
        borderTopColor: 'lightgrey',
    },
    orderInformationContainer: {
        borderTopWidth: 2,
        borderTopColor: 'lightgrey',
        marginTop: Dimensions.get('window').height * .040,
        height: Dimensions.get('window').height * .3,
        width: Dimensions.get('window').width *.85,
        alignSelf: 'center'
    },
    orderRow: {
        backgroundColor: 'whitesmoke',
        flexDirection: 'row',
        width: Dimensions.get('window').width * .85,
        height: Dimensions.get('window').height * .07,
        alignSelf: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        borderBottomColor: 'lightgrey',

    },
    orderRowSecond: {
        backgroundColor: 'white',
        flexDirection: 'row',
        width: Dimensions.get('window').width *.85,
        height: Dimensions.get('window').height * .07,
        alignSelf: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        borderBottomColor: 'lightgrey',
    },
    title: {
        marginTop: Dimensions.get('window').height * .02,
        fontSize: Dimensions.get('window').height * .020,
    },
    informationView: {
        width: Dimensions.get('window').width * .4,
        marginTop: Dimensions.get('window').height * .02,
        alignItems: 'center',
        height: Dimensions.get('window').height * .05,
        borderRadius: 10
    },
    addressView: {
        width: Dimensions.get('window').width * .4,
        marginTop: Dimensions.get('window').height * .01,
        alignItems: 'center',
        height: Dimensions.get('window').height * .05,
    },
    informationText: {
        fontSize: Dimensions.get('window').height * .02,
    },
    addressText: {
        fontSize: Dimensions.get('window').height * .02,
        marginBottom: Dimensions.get('window').height * .01,
    },
    nameBox: {
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width * .7
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
    phoneCallIcon: {
        marginLeft: Dimensions.get('window').width * .01,
        marginTop: Dimensions.get('window').width * .02,
        width: Dimensions.get('window').width * .09,
        height: Dimensions.get('window').height * .04,
        color: 'white'
    },
    messageIcon: {
        marginLeft: Dimensions.get('window').width * .015,
        marginTop: Dimensions.get('window').width * .015,
        width: Dimensions.get('window').width * .09,
        height: Dimensions.get('window').height * .04,
        color: 'white'
    },
    iconBackStyle: {
        backgroundColor: 'deepskyblue',
        borderRadius: 40,
        width: Dimensions.get('window').width * .1,
        height: Dimensions.get('window').height * .05,
    }

});

export default PendingApprovalOrderDetails;
