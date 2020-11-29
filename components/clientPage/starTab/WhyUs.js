import React, {useContext, useState, useEffect} from 'react';
import { Button, Text, View, SafeAreaView, Image, StyleSheet, Dimensions, ImageBackground} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

const WhyUs = ({navigation}) => {

    //Navigates back to the profile page
    const handleOnArrowPress = () => {
        navigation.navigate('StarPage');
    }

    return(
        <SafeAreaView style={styles.safeArea}>
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
                <Text style={styles.headerTitle}>Why should you order from</Text>
                <Text style={styles.juustYouTitle}>Just You</Text>
                <Text style={styles.reasonsPreview}>Five reasons why you order from Just You:</Text>
            </View>
            <View style={styles.reasonsContainer}>
                <View style={styles.reasonRow}>
                    <Image
                        source={require('../../../images/whyUsBlowVi.png')}
                        style={styles.viImage}
                    />
                    <Text style={styles.reasonText}>Easy and quick search for personal trainer</Text>
                </View>
                <View style={styles.reasonRow}>
                    <Image
                        source={require('../../../images/whyUsBlowVi.png')}
                        style={styles.viImage}
                    />
                    <Text style={styles.reasonText}>Wide selection of personal trainers by category</Text>
                </View>
                <View style={styles.reasonRow}>
                    <Image
                        source={require('../../../images/whyUsBlowVi.png')}
                        style={styles.viImage}
                    />
                    <Text style={styles.reasonText}>Possibility of setting personal training ad hoc with no restriction to any location</Text>
                </View>
                <View style={styles.reasonRow}>
                    <Image
                        source={require('../../../images/whyUsBlowVi.png')}
                        style={styles.viImage}
                    />
                    <Text style={styles.reasonText}>Fast and easy payment</Text>
                </View>
                <View style={styles.reasonRow}>
                    <Image
                        source={require('../../../images/whyUsBlowVi.png')}
                        style={styles.viImage}
                    />
                    <Text style={styles.reasonText}>Quick synchronization of setting the training date to your personal calendar</Text>
                </View>
            </View>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'white',
        height: Dimensions.get('window').height
    },
    coverImage: {
        height: Dimensions.get('window').height * .3,
        width: Dimensions.get('window').width
    },
    arrowImage: {
        marginLeft: 20,
        marginTop: 20
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 25
    },
    juustYouTitle: {
        fontWeight: 'bold',
        fontSize: 25,
        color: 'deepskyblue'
    },
    reasonsPreview: {
        fontSize: 16,
        marginTop: 10
    },
    reasonsContainer: {
        marginTop: 20,
        width: Dimensions.get('window').width * .9,
        height: Dimensions.get('window').height * .275,
        justifyContent: 'space-between',
        alignSelf: 'center'
    },
    reasonRow: {
        flexDirection: 'row',
        width: Dimensions.get('window').width * .9,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viImage: {
        marginRight: 30
    },
    reasonText: {
        fontSize: 15,
        width: Dimensions.get('window').width * .8
    }
});

export default WhyUs;