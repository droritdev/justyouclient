import React from 'react';
import {StyleSheet ,Text, TouchableOpacity, Dimensions} from 'react-native';

//Common next button
const AppButton = (props) => {
    return(
        <TouchableOpacity
            style={styles.getStartedButton}
            onPress={props.onPress}
        >
            <Text style={styles.getStartedText}>{props.title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    getStartedButton: {
        width: Dimensions.get('window').width * .9,
        height: Dimensions.get('window').height * .065,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'deepskyblue',
        borderRadius: 20
    },
    getStartedText: {
        fontSize: Dimensions.get('window').height * .030,
        fontWeight: 'bold',
        color: 'white'
    }
});

export default AppButton;