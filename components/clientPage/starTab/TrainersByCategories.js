import React, {useState, useReducer, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';

import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';

import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';

import images from './CategoryImageManager';

import {TrainerContext} from '../../../context/TrainerContext';

//The client's search page
const TrainersByCategories = ({navigation, route}) => {
  const {
    dispatchTrainerObject,
    dispatchTrainerNumberOfStarComments,
    dispatchFinalStarRating,
  } = useContext(TrainerContext);
  const {categoryFromStarPage} = route.params;

  const [doc, setDoc] = useState([]);

  let reviewsArray = [];
  let trainersByCategory = [];

  const [nameForImage, setNameForImage] = useState('');

  const [isLoadingCircle, setIsLoadingCircle] = useState(true);
  const [isTrainersAvailable, setIsTrainersAvailable] = useState(true);

  const config = {
    withCredentials: true,
    baseURL: 'https://justyou.iqdesk.info:443/',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('categoryFromStarPage: ' + categoryFromStarPage.toString());
      let imageName = categoryFromStarPage.toString().replace(' ', '');
      setNameForImage(images[imageName]);
      getAllTrainers(categoryFromStarPage);
    });
    return unsubscribe;
  }, [navigation]);

  const getAllTrainers = async (category) => {
    await axios
      .get('/trainers/getAllTrainers', config)
      .then((doc) => {
        if (doc) {
          //    setDoc(doc.data);
          // sortByCategory(doc.data);
          getTrainersByCategory(doc.data, category);
          //    setDisplayCategories('flex');
          //    setDisplayRecentOrders('none');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //get trainer by category by navigation from star page
  const getTrainersByCategory = (trainersArray, category) => {
    // setCategoryTitle(category)

    for (let index = 0; index < trainersArray.length; index++) {
      const trainer = trainersArray[index];
      if (trainer.categories.includes(category)) {
        trainersByCategory.push(trainer);
        console.log(trainer);
        console.log('trainersByCategory ' + trainersByCategory);
        console.log(trainersByCategory);
      }
      setDoc(trainersByCategory);
      setIsLoadingCircle(false);
      if (trainersByCategory.length <= 0) {
        setIsTrainersAvailable(false);
      } else {
        setIsTrainersAvailable(true);
      }
    }
  };

  const getTrainerStarRating = () => {
    let starsCounter = 0;
    let finalStarRating;
    for (let index = 0; index < reviewsArray.length; index++) {
      const element = reviewsArray[index];
      starsCounter += Number(element.stars);
    }

    finalStarRating = (starsCounter / reviewsArray.length).toFixed(1);
    return finalStarRating;
  };

  const renderItem = ({item}) => (
    <Item
      name={`${item.name.first} ${item.name.last}`}
      media={item.media.images[0]}
      trainerObject={item}
      {...(reviewsArray = item.reviews)}
      {...console.log(`${item.name.first} ${item.name.last}`)}
    />
  );

  const Item = ({trainerObject, name, media}) => (
    <View style={styles.trainerView}>
      <TouchableOpacity onPress={() => handleOnTrainerPressed(trainerObject)}>
        <View style={styles.trainerViewRow}>
          <TouchableOpacity
            onPress={() => handleOnTrainerPressed(trainerObject)}
            style={styles.trainerImage}>
            <FastImage
              style={styles.trainerImage}
              source={{
                uri: media,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.stretch}
            />
          </TouchableOpacity>
          <View style={styles.trainerDetails}>
            <Text style={styles.trainerDetail1}>{name}</Text>
            <Text style={styles.trainerDetail2}>Personal Trainer</Text>
            <View style={styles.ratingRow}>
              {reviewsArray.length === 0 ? (
                <Text style={styles.trainerDetail3}>no reviews</Text>
              ) : (
                <Text style={styles.trainerDetail3}>
                  {getTrainerStarRating()}
                </Text>
              )}

              {reviewsArray.length === 0 ? (
                <View />
              ) : (
                <Image
                  source={require('../../../images/graystar.png')}
                  style={styles.starIcon}
                />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const handleArrowButton = () => {
    navigation.navigate('StarPage');
  };

  const handleOnTrainerPressed = (trainerObject) => {
    dispatchTrainerObject({
      type: 'SET_TRAINER_OBJECT',
      trainerObject: trainerObject,
    });
    dispatchTrainerNumberOfStarComments({
      type: 'SET_NUMBER_OF_STARS',
      trainerNumberOfStars: reviewsArray.length,
    });
    dispatchFinalStarRating({
      type: 'SET_FINAL_STAR_RATING',
      trainerFinalStarRating: getTrainerStarRating(),
    });

    navigation.navigate('TrainerOrderPage', {params: ''});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.arrowAndHeaderContainer}>
        <ArrowBackButton onPress={handleArrowButton} />
        <View style={styles.header}>
          <Text style={styles.headerText}>Just You</Text>
        </View>
      </View>
      <View style={styles.imageContainer}>
        <Image style={styles.categoryImage} source={nameForImage} />
      </View>

      <View>
        <Text style={styles.recentOrdersTitle}>{categoryFromStarPage}</Text>
      </View>

      {isLoadingCircle ? (
        <View>
          <View style={styles.progressView}>
            <Progress.Circle
              size={Dimensions.get('window').height * 0.25}
              indeterminate={true}
            />
          </View>
          {/* <View style={styles.loadingTextView}>
                    <Text style={styles.registeringText}>Creating account...</Text>
                </View> */}
        </View>
      ) : (
        <View>
          {isTrainersAvailable ? (
            <View display={'flex'}>
              <FlatList
                data={doc}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
              />
            </View>
          ) : (
            <View style={{marginTop: 20}}>
              <Text style={styles.noOrders}>
                {'No trainers in that category yet...'}
              </Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
  },
  container: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width,
  },
  arrowAndHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: Dimensions.get('window').width * 0.95,
    height: Dimensions.get('window').width * -0.15,
    // width: Dimensions.get('screen').width,
    marginLeft: Dimensions.get('window').width * -0.155,
  },
  header: {
    marginTop: 10
  },
  headerText: {
    fontSize: Dimensions.get('window').height * 0.04,
    fontWeight: 'bold',
  },
  imageContainer: {
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },

  categoryImage: {
    alignSelf: 'center',
    marginTop: Dimensions.get('window').height * 0.05,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.2,

    // borderRadius: 17,
  },

  recentOrdersTitle: {
    alignSelf: 'center',
    // marginLeft: Dimensions.get('window').width * .02,
    marginTop: Dimensions.get('window').height * 0.03,
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height * 0.04,
  },
  trainerView: {
    width: Dimensions.get('window').width,
    marginLeft: Dimensions.get('window').height * 0.03,
    marginTop: Dimensions.get('window').height * 0.03,
  },
  trainerViewRow: {
    flexDirection: 'row',
  },
  trainerImage: {
    height: Dimensions.get('window').height * 0.1,
    width: Dimensions.get('window').height * 0.1,
    borderRadius: 15,
    backgroundColor: 'gainsboro',
  },
  trainerDetails: {
    justifyContent: 'center',
    marginLeft: Dimensions.get('window').width * 0.03,
  },
  trainerDetail1: {
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height * 0.025,
  },
  trainerDetail2: {
    fontSize: Dimensions.get('window').height * 0.02,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trainerDetail3: {
    fontSize: Dimensions.get('window').height * 0.02,
  },
  starIcon: {
    marginTop: Dimensions.get('window').height * 0.001,
    height: Dimensions.get('window').height * 0.022,
    width: Dimensions.get('window').height * 0.022,
  },
  progressView: {
    marginTop: Dimensions.get('window').height * 0.1,
    alignSelf: 'center',
  },
  noOrders: {
    alignSelf: 'center',
    fontSize: 20
  }
});

export default TrainersByCategories;
