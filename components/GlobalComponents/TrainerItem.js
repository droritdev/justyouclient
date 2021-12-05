import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import FastImage from 'react-native-fast-image'

const TrainerItem = (props) => {
    const navigation = useNavigation()

    const getTrainerStarRating = () => {
        console.log('in gettrainerstarraiting props')
        console.log(props)
        let starsCounter = 0;
        let finalStarRating = 0;
        if (props.reviewsArray.length === 0) {
          return 0;
        } else {
          for (let index = 0; index < props.reviewsArray.length; index++) {
            const element = props.reviewsArray[index];
            starsCounter += Number(element.stars);
          }
          finalStarRating = (starsCounter / props.reviewsArray.length).toFixed(1);
          return finalStarRating;
        }
    }

    return (
        <View style={styles.inSectionView}>
            <TouchableOpacity
                onPress={() =>
                    props.handleOnTrainerPressed(props.trainerObject)
                }>
                <View style={styles.inSectionImageViewContainer}>
                <FastImage
                    style={styles.inSectionImageView}
                    source={{
                        uri: props.media.images[0],
                        priority: FastImage.priority.normal
                    }}
                    resizeMode={FastImage.resizeMode.stretch}
                />
                </View>
                <View style={styles.trainerPreviewText}>
                <Text style={styles.trainerText1}>{props.name}</Text>
                <Text style={styles.trainerText2}>Personal Trainer</Text>
                <View style={styles.ratingRow}>
                    <Text style={styles.trainerText3}>{getTrainerStarRating()}</Text>
                    <Image
                        source={require('../../images/starIconBlue.png')}
                        style={styles.starIcon}
                    />
                </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    inSectionView: {
        marginRight: Dimensions.get('window').width * 0.013,
        height: Dimensions.get('window').height * 0.17,
        width: Dimensions.get('window').width * 0.3,
        borderWidth: 2,
        borderColor: 'gainsboro',
        borderRadius: 17,
      },
      inSectionImageViewContainer: {
        height: Dimensions.get('window').height * 0.1,
      },
      inSectionImageView: {
        height: Dimensions.get('window').height * 0.1,
        backgroundColor: 'gainsboro',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
      },
      trainerPreviewText: {
        height: Dimensions.get('window').height * 0.051,
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width * 0.3,
        marginTop: 5
      },
      trainerText1: {
        fontWeight: 'bold',
        textAlign: 'center',
      },
      trainerText2: {
        fontSize: Dimensions.get('window').height * 0.0112,
        textAlign: 'center',
      },
      ratingRow: {
        flexDirection: 'row'
      },
      trainerText3: {
        fontSize: Dimensions.get('window').height * 0.0112,
        textAlign: 'center',
        fontWeight: 'bold',
      },
      starIcon: {
        height: Dimensions.get('window').height * 0.0112,
        width: Dimensions.get('window').width * 0.0245,
        alignSelf: 'center',
      }
})

export default TrainerItem

