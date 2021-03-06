import React, {useContext, useState, useEffect} from 'react';
import {
  Button,
  Text,
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Modal,
  Pressable
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import {TrainerContext} from '../../../context/TrainerContext';

//The question and answers page
const TrainerReviews = ({navigation}) => {
  const {trainerObject} = useContext(TrainerContext);

  const [age, setAge] = useState();
  const [clientsInfo, setClientsInfo] = useState([]);
  const [starRating, setStarRating] = useState();

  const [modalVisible, setModalVisible] = useState(false)

  const reviews = trainerObject.reviews;

  //server config
  const config = {
    withCredentials: true,
    baseURL: 'https://justyou.iqdesk.info:443/',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  //Calculate trainer age
  const calculateTrainerAge = () => {
    let array = trainerObject.birthday.split('/');
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let todayDay = today.getDate();
    let age = year - Number(array[2]);
    if (month < Number(array[0])) {
      age--;
    }
    if (Number(array[0]) === month && todayDay < Number(array[1])) {
      age--;
    }
    setAge(age);
  };

  //Load trainer star rating
  const loadStarRating = () => {
    if (reviews.length === 0) {
      setStarRating(0);
    } else {
      let sumStars = 0;
      for (let index = 0; index < reviews.length; index++) {
        const singleReviewStar = reviews[index].stars;
        sumStars += Number(singleReviewStar);
      }
      setStarRating((sumStars / reviews.length).toFixed(1));
    }
  };

  useEffect(() => {
    //Hide bottom navigation UI
    navigation.dangerouslyGetParent().setOptions({
      tabBarVisible: false,
    });
    console.log('Trainer reviews page');
    console.log(trainerObject);
    calculateTrainerAge();

    loadStarRating();

    getAllClientsInfo();
  }, []);

  //Navigates back to the profile page
  const handleArrowButton = () => {
    navigation.dangerouslyGetParent().setOptions({
      tabBarVisible: true,
    });
    navigation.navigate('TrainerOrderPage');
  };

  //Reterive from database the information of the users involved
  const getAllClientsInfo = async () => {
    //Array to to be filled with the ids of the clients that left reviews
    let idArray = [];

    //Push into the idArray all of the clientID
    for (let index = 0; index < reviews.length; index++) {
      const singleReviewUserID = reviews[index].userID;
      idArray.push(singleReviewUserID);
    }

    //fetch the client of all clients from mongodb using axios
    await axios
      .get('/clients/findMultipleClients/' + idArray, config)
      .then((doc) => {
        let allClientsInfo = doc.data;
        console.log('allClientsInfo ******', allClientsInfo)
        allClientsInfo.reverse();

        setClientsInfo(allClientsInfo);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Input the information retrived from database over the UI
  const getTrainerReviews = () => {
    console.log('in gettrainerreviews')
    let repeats = [];
    console.log('client length ', clientsInfo.length)
    console.log('review length ', reviews.length)
    console.log('clientsinfo ', clientsInfo)
    if (reviews.length !== 0 && clientsInfo.length > 0) {
      console.log('in if')
      for (let i = 0; i < reviews.length; i++) {
        let singleReview = reviews[i];
        console.log('single review ', i, singleReview)
        console.log('clientsinfoi ', i, clientsInfo[i])
        repeats.push(
          //row
          <View key={'row' + i} style={styles.reviewRowContainer}>
            <FastImage
              style={styles.reviewUserImage}
              source={{
                uri: clientsInfo[i].image,
                priority: FastImage.priority.normal,
              }}
              key={'image' + i}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View style={styles.reviewTextContainer}>
              <View style={{flexDirection: 'row'}}>
                {clientsInfo.length > 0 ? (
                  <Text style={styles.reviewTitle}>
                    {' '}
                    {clientsInfo[i].name.first +
                      ' ' +
                      clientsInfo[i].name.last +
                      ' - ' +
                      singleReview.stars}{' '}
                  </Text>
                ) : (
                  <Text style={styles.reviewTitle}>{''}</Text>
                )}
                <Image
                  key={'star' + i}
                  source={require('../../../images/starIconBlue.png')}
                  style={styles.starIconReview}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: Dimensions.get('window').width * 0.012,
                }}>
                <Text style={{width: Dimensions.get('window').width * 0.65}}>
                  {singleReview.reviewContent}
                </Text>
              </View>
            </View>
          </View>,
        );
      }
    }
    return repeats;
  };

  console.log('categories ', trainerObject.categories)

  return (
    <SafeAreaView style={styles.safeArea}>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{trainerObject.about_me}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <ArrowBackButton onPress={handleArrowButton} />

      <View style={styles.imageAndDetailsContainer}>
        <FastImage
          style={styles.profileImage}
          source={{
            uri: trainerObject.media.images[0],
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.nameRatingAgeContainer}>
          <Text style={styles.nameText}>
            {trainerObject.name.first + ' ' + trainerObject.name.last}
          </Text>
          <Text style={styles.personalTrainerText}>Personal Trainer</Text>
          <View style={styles.ratingAndAge}>
            <Text style={styles.ratingText}>{starRating} </Text>
            <Image
              source={require('../../../images/starIconBlue.png')}
              style={styles.starIcon}
            />
            <Text style={styles.ageText}> - Age {age}</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoView}>
        <Text style={styles.infoText}>
          <Text style={styles.titleText}>Categories: </Text>
          {trainerObject.categories.join()}
        </Text>
      </View>
      <View style={styles.infoView}>
        <Text style={styles.infoText}>
          <Text style={styles.titleText}>Trainer Certification: </Text>
          {trainerObject.certifications}
        </Text>
      </View>
      <View style={styles.infoView}>
        <Text style={styles.infoText}>
          <Text style={styles.titleText}>About Me: </Text>
          {trainerObject.about_me.length > 80
            ? trainerObject.about_me.slice(0, 80) + '...'
            : trainerObject.about_me}
        </Text>
      </View>
      {trainerObject.about_me.length > 80
          ? (<View style={{marginLeft: Dimensions.get('window').width * 0.0483, marginTop: 5}}>
              <Pressable
                style={{width: 100, height: 20, backgroundColor: 'deepskyblue', borderRadius: 15, justifyContent: 'center', alignItems: 'center'}}
                onPress={() => setModalVisible(true)}
             ><Text>Read More</Text>
             </Pressable>
             </View>)
          : null}

      <Text style={styles.pageTitle}>
        {' '}
        {'Customer Reviews (' + reviews.length + ')'}{' '}
      </Text>

      <View style={styles.greyBorder} />
      <ScrollView style={styles.scrollViewContainer}>
        {getTrainerReviews()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
    flex: 1,
  },
  imageAndDetailsContainer: {
    flexDirection: 'row',
    height: Dimensions.get('window').width * 0.265,
    marginLeft: Dimensions.get('window').width * 0.0483,
    marginTop: Dimensions.get('window').height * 0.02,
    marginBottom: Dimensions.get('window').height * 0.04
  },
  profileImage: {
    height: Dimensions.get('window').width * 0.265,
    width: Dimensions.get('window').width * 0.265,
    backgroundColor: 'white',
    borderRadius: 20,
    zIndex: 1,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 5,
  },
  nameRatingAgeContainer: {
    //justifyContent: 'center',
    marginLeft: Dimensions.get('window').width * 0.0483,
    justifyContent: 'space-between',
    height: Dimensions.get('window').height * 0.11,
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height * 0.033,
  },
  personalTrainerText: {
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height * 0.022,
    color: 'deepskyblue',
  },
  ratingAndAge: {
    flexDirection: 'row',
    height: Dimensions.get('window').height * 0.05,
  },
  ratingText: {
    fontSize: Dimensions.get('window').height * 0.02,
  },
  starIcon: {
    marginTop: Dimensions.get('window').height * 0.001,
    height: Dimensions.get('window').height * 0.022,
    width: Dimensions.get('window').height * 0.022,
  },
  starIconReview: {
    marginTop: Dimensions.get('window').height * 0.002,
    height: Dimensions.get('window').height * 0.022,
    width: Dimensions.get('window').height * 0.022,
  },
  ageText: {
    fontSize: Dimensions.get('window').height * 0.02,
  },
  pageTitle: {
    alignSelf: 'center',
    marginTop: Dimensions.get('window').height * 0.06,
    fontSize: Dimensions.get('window').height * 0.03,
    fontWeight: '600',
  },
  scrollViewContainer: {
    marginTop: Dimensions.get('window').height * 0.01,
  },
  greyBorder: {
    marginTop: Dimensions.get('window').height * 0.01,
    alignSelf: 'center',
    width: Dimensions.get('window').width * 0.7,
    borderTopWidth: 3,
    borderTopColor: 'lightgrey',
  },
  reviewRowContainer: {
    marginTop: Dimensions.get('window').height * 0.01,
    marginBottom: Dimensions.get('window').height * 0.03,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewUserImage: {
    marginLeft: Dimensions.get('window').width * 0.05,
    backgroundColor: 'transparent',
    height: Dimensions.get('window').height * 0.075,
    width: Dimensions.get('window').height * 0.075,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.5,
    elevation: 3,
  },
  reviewTextContainer: {
    marginLeft: Dimensions.get('window').width * 0.05,
    marginTop: Dimensions.get('window').height * 0.01,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  reviewTitleContainer: {
    flexDirection: 'row',
  },
  reviewTitle: {
    fontSize: Dimensions.get('window').height * 0.022,
    fontWeight: 'bold',
  },
  reviewText: {
    fontSize: Dimensions.get('window').height * 0.02,
    fontWeight: '300',
    width: Dimensions.get('window').width * 0.65,
  },
  infoView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: Dimensions.get('window').width * 0.0483,
    marginRight: Dimensions.get('window').width * 0.0483,
    marginTop: 5
  },
  titleText: {
    fontSize: Dimensions.get('window').height * 0.027,
    fontWeight: 'bold'
  },
  infoText: {
    fontSize: Dimensions.get('window').height * 0.02,
    flex: 1,
    flexWrap: 'wrap'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default TrainerReviews;
