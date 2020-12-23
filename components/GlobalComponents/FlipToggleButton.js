import React, {useState, useContext, useEffect} from 'react';
import {StyleSheet, View, Text, Image, Dimensions, SafeAreaView} from 'react-native';
import FlipToggle from 'react-native-flip-toggle-button';

////Common Flip Toggle button
const FlipToggleButton = (props) => {
    return(
        <FlipToggle
        value={props.value}
        buttonHeight={30}
        buttonWidth={70}
        buttonRadius={40}
        sliderWidth={35}
        sliderHeight={30}
        sliderRadius={50}
        sliderOffColor={'slategray'}
        sliderOnColor={'white'}
        buttonOffColor={'lightgray'}
        buttonOnColor={'deepskyblue'}
        onToggle={props.onToggle}
      />
    )
}

const styles = StyleSheet.create({

});

export default FlipToggleButton;
