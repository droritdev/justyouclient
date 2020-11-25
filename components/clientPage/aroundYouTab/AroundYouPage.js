import React from 'react';
import { Button, Text, View, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

//The claint's around you area page
const ProfilePage = ({navigation}) => {
    return(
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Just You</Text>
            </View>
            <View style={styles.aroundYouTitle}>
                <Text style={styles.aroundYouText}>Around You</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'white',
        flex: 0
    },
    container: {
        backgroundColor: 'white',
        width: Dimensions.get('window').width,
        // height: Dimensions.get('window').height
    },
    header: {
        alignSelf: 'center'
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    aroundYouTitle: {
        marginLeft: 15,
        marginTop: 40
    },
    aroundYouText: {
        fontWeight: 'bold',
        fontSize: 25
    }
});

export default ProfilePage;