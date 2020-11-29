import React, {useContext} from 'react'
import {StyleSheet, View, Text, Image, Dimensions} from 'react-native';
import axios from 'axios';

import {NameContext} from '../../context/NameContext';
import {CountryContext} from '../../context/CountryContext';
import {EmailContext} from '../../context/EmailContext';
import {BirthdayContext} from '../../context/BirthdayContext';
import {PasswordContext} from '../../context/PasswordContext';
import {PhoneContext} from '../../context/PhoneContext';
import {ProfileImageContext} from '../../context/ProfileImageContext';

const DonePopUp = ({navigation}) => {
    const {firstName} = useContext(NameContext);
    const {lastName} = useContext(NameContext);
    const {birthday} = useContext(BirthdayContext);
    const {emailAddress} = useContext(EmailContext);
    const {password} = useContext(PasswordContext);
    const {country} = useContext(CountryContext);
    const {areaCode} = useContext(PhoneContext);
    const {phoneNumber} = useContext(PhoneContext);

    const config = {
        withCredentials: true,
        baseURL: 'http://localhost:3000/',
        headers: {
          "Content-Type": "application/json",
        },
    };

    const registerClient = () => {
        //navigation.navigate('WelcomeUser');
        axios
            .post('/clients/register', {
                name: {
                    first: firstName,
                    last: lastName
                },
                birthday: birthday,
                email: emailAddress,
                password: password,
                country: country,
                phone: {
                    areaCode: areaCode, 
                    phoneNumber: phoneNumber
                },
                location: {
                    type: 'Point',
                    coordinates: [32.123602, 34.875223]
                }
            },
            config
            )
            .then((res) => {
                navigation.navigate('WelcomeUser');
            })
            .catch((err) => alert(err.data));
    }
    
    setTimeout(() => registerClient(), 2000);

    return(
        <View style={styles.container}>
            <Image 
                source={require('../../images/successfullyIcon.png')}
            />
            <Text style={styles.registeringText}>Done</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        justifyContent: 'center',
        alignItems: 'center'
    },
    registeringText: {
        fontWeight: 'bold',
        fontSize: 40,
        textAlign: 'center',
        marginTop: 25
    }
});

export default DonePopUp;