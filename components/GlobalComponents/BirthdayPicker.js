import React from 'react';
import {StyleSheet ,Text, TouchableOpacity, Dimensions, View, Image} from 'react-native';

import DateTimePickerModal from "react-native-modal-datetime-picker";

//Common birthday picker object
const BirthdayPicker = (props) => {
    return(
        <View>
            <View style={styles.calendarContainer}>
            <TouchableOpacity
                style={styles.birthdayBox}
                onPress={props.onPress}
                birthdaySelected={props.birthdaySelected}
            >
            <Text style={props.isBirthdaySelected ? styles.birthdayPicked : styles.birthdayUnPicked}>{props.birthdaySelected}</Text>
            <Image
                source={require('../../images/calendarIcon.png')}
                style={styles.calendarIcon}
            />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={props.onPress}
            >
            </TouchableOpacity>
            </View>
            <DateTimePickerModal
                isVisible={props.isVisible}
                mode="date"
                onConfirm={props.onConfirm}
                onCancel={props.onCancel}
                maximumDate={new Date((props.maximumDate))}
                minimumDate={new Date((props.minimumDate))}
                headerTextIOS="Pick a date - minimum 18"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    calendarContainer: {
        flexDirection: 'row'
      },
      birthdayBox: {
        borderWidth: 2,
        borderColor: 'deepskyblue',
        borderRadius: 17,
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height * .01,
        alignItems: 'center',
        flexDirection : 'row',
        justifyContent: 'space-between',
        height: Dimensions.get('window').height * .065,
        width: Dimensions.get('window').width * .9,
        marginLeft: Dimensions.get('window').width * 0.0483
      },
      birthdayUnPicked: {
        textAlign: 'center',
        color: 'grey',
        fontSize: Dimensions.get('window').height * 0.025,
        marginLeft: Dimensions.get('window').width * 0.25,
      },
      birthdayPicked: {
        textAlign: 'center',
        marginLeft: Dimensions.get('window').width * 0.3,
        fontSize: Dimensions.get('window').height * 0.025,
      },
      calendarIcon: {
        height: Dimensions.get('window').height * 0.045,
        width: Dimensions.get('window').height * 0.045,
        marginRight: Dimensions.get('window').width * + 0.01
      }
});

export default BirthdayPicker;