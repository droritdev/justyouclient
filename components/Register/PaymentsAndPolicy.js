import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, Text, Image, TextInput, Dimensions, SafeAreaView, Alert} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Dialog from "react-native-dialog";
import { WebView } from 'react-native-webview';
import axios from 'axios';

import ArrowBackButton from '../GlobalComponents/ArrowBackButton';
import AppButton from '../GlobalComponents/AppButton';
import {NameContext} from '../../context/NameContext';
import {EmailContext} from '../../context/EmailContext';
import {PaymeTokenContext} from '../../context/PaymeTokenContext';

//Here the user enters his payment method
const PaymentsAndPolicy = ({navigation}) => {
    const [paymentsErrorText, setPaymentsErrorText] = useState("");
    const [visible, setDialogVisible] = useState(false);

    const [webViewUri, setWebViewUri] = useState('');

    const {firstName} = useContext(NameContext);
    const {lastName} = useContext(NameContext);
    const {emailAddress} = useContext(EmailContext);

    let interId = 0

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
        },
    };

    useEffect(() => {
        console.log('in useeffect')
        axios
            .post(
                'https://preprod.paymeservice.com/api/generate-sale',
                {
                    "seller_payme_id": "MPL16286-62772S4F-0CPOKDFP-GIWMKI6U",
                    "sale_price": 500,
                    "currency": "USD",
                    "product_name": "Product",
                    "transaction_id": emailAddress,
                    "installments": 1,
                    "sale_callback_url": "http://justyou.iqdesk.info:8081/addPaymeToken",
                //    "sale_return_url": "https://www.amazon.com/",
                    "sale_type": "token",
                    "language": "en"
                },
                configPayme
            )
            .then(response => {
            //    console.log('sale_url ', response)
                const url = response.data.sale_url + `?first_name=${firstName}&last_name=${lastName}&email=${emailAddress}`
                console.log('payme_sale_id ', response.data.payme_sale_id)
                // dispatchPaymeToken({
                //     type: 'SET_PAYMETOKEN',
                //     paymeToken: response.data.payme_sale_id
                // });
                setWebViewUri(url)
                interId = setInterval(() => handleNext(), 5000)
            })
            .catch(err => {
                console.log('in catch')
                console.log(err)
                console.log(err.response)
            })
    }, []);

    //Navigates back to the ProfileDetailsPage2
    const handleArrowButton = () => {
        navigation.navigate('ProfileDetailsPage2');
    }

    //Handle when user press ok in the dialod, then close it
    const handleOk = () => {
        setDialogVisible(false);
    };

    //Handle the approve button when pressed, if ok - navigates to RegisteringAccountPopUp
    const handleNext = () => {
        console.log('in handle next')
            axios
            .get('/getPaymeToken/' + emailAddress.toLowerCase(),
                config
            )
            .then((doc) => {
                if (doc.data.length !== 0) {
                    console.log('payment success docdata ', doc.data)
                    clearInterval(interId)
                    navigation.navigate('PhoneNumberVerification');
                } else {
                    // Alert.alert('Payment details process failed 1',
                    //             `${doc}`,
                    //             [{text: 'OK'}])
                    console.log('payment process failed 1')
                }
            })
            .catch((err) => {
                console.log(err)
                Alert.alert('Payment details process failed 2',
                                `${err}`,
                                [{text: 'OK'}])
            })
    }

    return(
        <SafeAreaView style={styles.container}>
            <ArrowBackButton
                onPress={handleArrowButton}
            />
            <Text style={styles.profileDetailesText}>Profile Details</Text>
            <Text style={styles.paymentTitle}>ADD FORM OF PAYMENT</Text>
            <View style={styles.webViewContainer}>
                <WebView
                    originWhitelist={['*']}
                    style={styles.webView}
                    source={{ uri: webViewUri }}
                />
            </View>
            {/* <View style={styles.nextButtonContainer}>
                <AppButton
                    title="Next"
                    onPress={handleNext}
                />
            </View> */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    profileDetailesText: {
        marginLeft: Dimensions.get('window').width * 0.0724,
        marginTop: Dimensions.get('window').height * 0.022,
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * 0.04
    },
    paymentTitle: {
        fontSize: Dimensions.get('window').height * 0.02,
        marginLeft: Dimensions.get('window').width * 0.077
    },
    paymentFormErrorText: {
        color: 'red',
        alignSelf: 'center',
        fontSize: Dimensions.get('window').height * 0.022,
        marginTop: Dimensions.get('window').height * 0.018
    },
    nextButtonContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 50
    },
    webViewContainer: {
        flex: 1,
        alignSelf: 'stretch',
        marginTop: 20,
        marginBottom: 20
    },
    webView: {
        flex: 1,
        width: '100%'
    }
});

export default PaymentsAndPolicy;