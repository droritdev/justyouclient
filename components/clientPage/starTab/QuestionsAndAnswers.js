import React, {useContext, useState, useEffect} from 'react';
import { Button, Text, View, SafeAreaView, Image, StyleSheet, Dimensions, ImageBackground} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import {Accordion, Block} from 'galio-framework';

//The questions and answers content
const SECTIONS = [
    {
        title: 'Do I need to provide equipment?',
        content: 'No. Your trainer will bring all required equipment for the type of training session.'
    },
    {
        title: 'Can I Train in the park?',
        content: 'JustYou is a service that allows you to train in the comfort of your own home, or on-the-go. In the park, at a hotel or in your office. Wherever you are, or will be.'
    },
    {
        title: 'Can I book a session at a gym',
        content: 'Of course. You can choose any gym or studio you want for a training session. Note that there may be an additional charge for entering the complex.'
    },
    {
        title: 'If my partner is late, do I steel get the full session?',
        content: 'Definitely. The JustYou trainer obligated to be punctual and will always provide you with a full session. Please feel free to contact us at service@justyou.com with any issues.'
    },
    {
        title: 'What if I need to cancel a session?',
        content: 'Up to 24 hours in advance you can cancel free of charge. In case of a last-minute cancellation (less than 24 hours) we charge for the session to protect our JustYou trainers.'
    },
    {
        title: 'Can I contact my trainer before the session?',
        content: 'Yes. you have the ability to chat or call with your trainer through the JustYou app.'
    },
    {
        title: 'Is there an easy way to rebbok past trainers?',
        content: 'Yes, just open the JustYou app and tap "Order History".'
    },
    {
        title: 'What do I do if I have an emergency during the session?',
        content: 'If you have a medical emergency, call 911 immediately.'
    },
    {
        title: 'What do I do if I have an emergency during the session?',
        content: 'If you have a medical emergency, call 911 immediately.'
    },
];


//The question and answers page
const QuestionsAndAnswers = ({navigation}) => {

    //Navigates back to the profile page
    const handleOnArrowPress = () => {
        navigation.navigate('StarPage');
    }

    return(
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <ImageBackground
                    source={require('../../../images/Q&As.jpg')}
                    style={styles.coverImage} 
                >
                    <TouchableOpacity
                            onPress={() => handleOnArrowPress()}
                        >
                        <Image
                            source={require('../../../images/blackArrow.png')}
                            style={styles.arrowImage}
                        />
                    </TouchableOpacity>
                </ImageBackground>
                <View style={styles.headerContainer}>
                    <Text style={styles.justYouTitle}>Just You Partner</Text>
                    <Text style={styles.qA}>Q & A</Text>
                </View>
                <View>
                    <Block style={styles.block}>
                        <Accordion 
                            dataArray={SECTIONS} 
                            opened={null} 
                            listStyle={{
                                width: Dimensions.get('window').width * .95
                            }}
                            style={{
                                width: Dimensions.get('window').width,
                                backgroundColor: 'white',
                                borderRadius: 0
                            }}
                            headerStyle={{
                                marginTop: 5
                            }}
                            contentStyle={{
                                color: 'deepskyblue'
                            }}
                        />
                    </Block>
                </View>
            </View>
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
        flexDirection: 'column',
        height: Dimensions.get('window').height,
    },
    coverImage: {
        height: Dimensions.get('window').height * .3,
        width: Dimensions.get('window').width,
    },
    arrowImage: {
        marginLeft: 20,
        marginTop: 20
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    justYouTitle: {
        color: 'deepskyblue',
        fontWeight: 'bold',
        fontSize: 30
    },
    qA: {
        fontWeight: 'bold',
        fontSize: 25
    },
    acordionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    block: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
});

export default QuestionsAndAnswers;