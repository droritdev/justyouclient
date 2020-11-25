import React from 'react';
import {StyleSheet ,Text, TouchableOpacity, Dimensions, View, Image} from 'react-native';

import DateTimePickerModal from "react-native-modal-datetime-picker";

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
            </TouchableOpacity>
            <TouchableOpacity
                onPress={props.onPress}
            >
            <Image
                source={require('../../images/calendarIcon.png')}
                style={styles.calendarIcon}
            />
            </TouchableOpacity>
            </View>
            <DateTimePickerModal
                isVisible={props.isVisible}
                mode="date"
                onConfirm={props.onConfirm}
                onCancel={props.onCancel}
                maximumDate={props.maximumDate}
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
        borderWidth: 3,
        borderColor: 'deepskyblue',
        borderRadius: 17,
        height: 60,
        justifyContent: 'center',
        marginTop: 10,
        width: Dimensions.get('window').width * .8,
        marginLeft: 15
      },
      birthdayUnPicked: {
        textAlign: 'center',
        color: 'grey',
        fontSize: 20,
        fontWeight: '300'
      },
      birthdayPicked: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
      },
      calendarIcon: {
        height: 60,
        width: 60,
        marginTop: 10
      }
});

export default BirthdayPicker;