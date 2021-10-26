import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, Text, Dimensions, SafeAreaView, Alert} from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';

const MethodsOfPayment = ({navigation}) => {
    const [webViewUri, setWebViewUri] = useState('');
    const [updateMessage, setUpdateMessage] = useState('')

    let user = auth().currentUser
    let email = user.email

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
        axios
            .post(
                'https://preprod.paymeservice.com/api/generate-sale',
                {
                    "seller_payme_id": "MPL16286-62772S4F-0CPOKDFP-GIWMKI6U",
                    "sale_price": 500,
                    "currency": "USD",
                    "product_name": "Product",
                    "transaction_id": email,
                    "installments": 1,
                    "sale_callback_url": "http://justyou.iqdesk.info:8081/updatePaymeToken",
                //    "sale_return_url": "https://www.amazon.com/",
                    "sale_type": "token",
                    "language": "en"
                },
                configPayme
            )
            .then(response => {
                const url = response.data.sale_url + `?email=${email}`
                console.log('payme_sale_id ', response.data.payme_sale_id)
                setWebViewUri(url)
            })
            .catch(err => {
                console.log('in catch')
                console.log(err)
                console.log(err.response)
            })
    }, []);

    const handleArrowButton = () => {
        navigation.navigate('Settings');
    }

    return(
        <SafeAreaView style={styles.container}>
            <ArrowBackButton
                onPress={handleArrowButton}
            />
            <Text style={styles.paymentTitle}>CHANGE FORM OF PAYMENT</Text>
            <View style={styles.webViewContainer}>
                <WebView
                    originWhitelist={['*']}
                    style={styles.webView}
                    source={{ uri: webViewUri }}
                />
            </View>
            <View style={styles.updateMessage}>
                <Text>{updateMessage}</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    paymentTitle: {
        fontSize: Dimensions.get('window').height * 0.02,
        marginLeft: Dimensions.get('window').width * 0.077
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
    },
    updateMessage: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default MethodsOfPayment;