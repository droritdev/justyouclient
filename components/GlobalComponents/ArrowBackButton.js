import React from 'react';
import {StyleSheet , TouchableOpacity, Image, Dimensions} from 'react-native';

//Common Arrow back button
const ArrowBackButton = (props) => {
    return(
        <TouchableOpacity
          onPress={props.onPress}
        >
          <Image
            source={require('../../images/leftArrow.png')}
            style={styles.arrowImage}
          />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    arrowImage: {
        marginLeft: Dimensions.get('window').width * .038,
        width: Dimensions.get('window').width * .080,
        height: Dimensions.get('window').height * .050,
    },
});

export default ArrowBackButton;