import React from 'react';
import {StyleSheet , TouchableOpacity, Image} from 'react-native';

//Common Arrow back button
const ArrowBackButton = (props) => {
    return(
        <TouchableOpacity
          onPress={props.onPress}
        >
          <Image
            source={require('../../images/arrowBack.png')}
            style={styles.arrowImage}
          />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    arrowImage: {
        marginTop: 10,
        marginLeft: 20
    },
});

export default ArrowBackButton;