import React, {useContext, useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  Button,
  FlatList,
  Modal,
  Linking,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Dialog from 'react-native-dialog';
import {Accordion, Block, Radio} from 'galio-framework';
import FastImage from 'react-native-fast-image';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import {WebView} from 'react-native-webview';

import auth from '@react-native-firebase/auth';

import Geocoder from 'react-native-geocoding';
import axios from 'axios';

import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';
import {TrainerContext} from '../../../context/TrainerContext';
import {OrderContext} from '../../../context/OrderContext';

let API_KEY = 'AIzaSyAKKYEMdjG_Xc6ZuvyzxHBi1raltggDA2c'; // TODO: move api key to .env
Geocoder.init(API_KEY); // use a valid API key

//The question and answers page
const TrainerOrderPage = ({navigation}) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isSelected, setSelection] = useState(false);
  const [isOutdoorTraining, setIsOutdoorTraining] = useState('none');
  const [isAtTrainerTraining, setIsAtTrainerTraining] = useState('none');
  const [listData, setListData] = useState({});
  const [inputText, setInputText] = useState('');
  const [isAddressSelected, setIsAddressSelected] = useState('none');
  const [isSearchingForLocation, setIsSearchingForLocation] = useState('none');
  const [isTrainerHasOneLocation, setIsTrainerHasOneLocation] = useState(true);

  const [categorySelected, setCategorySelected] = useState('');
  const [typeOfTrainingSelected, setTypeOfTrainingSelected] = useState('');
  const [trainingSiteSelected, setTrainingSiteSelected] = useState('');
  const [locationLatitudeCoordinate, setLocationLatitudeCoordinate] = useState(
    '',
  );
  const [
    locationLongitudeCoordinate,
    setLocationLongitudeCoordinate,
  ] = useState('');

  let isDateSelected = 'none';
  let isDateSelectedForButtonShow = 'flex';

  const [clientID, setClientID] = useState('');
  const [clientFirstName, setClientFirstName] = useState('');
  const [clientLastName, setClientLastName] = useState('');
  const [clientProfilePic, setClientProfilePic] = useState('');

  const {
    orderObejct,
    dispatchOrderObject,
    orderTrainingSiteAddress,
    dispatchOrderTrainingSiteAddress,
    orderTrainingCategory,
    dispatchOrderTrainingCategory,
    orderDate,
    orderStartTime,
    dispatchOrderStartTime,
    orderEndTime,
    dispatchOrderEndTime,
  } = useContext(OrderContext);

  const {trainerObject, dispatchTrainerObject} = useContext(TrainerContext);

  //paypal modal
  const [modalVisible, setModalVisible] = useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getClientFromMongoDB();
      checkForLocationsCount();
    });

    return unsubscribe;
  }, [checkForLocationsCount, getClientFromMongoDB, navigation]);

  //paypal payment
  const paypalPayment = () => {
    axios
      .get('/paypal/', config)
      .then((doc) => {
        if (doc) {
          console.log('PAYPAL DOC');
          console.log(doc);
        }
      })
      .catch((err) => console.log(err));
  };
  //handle paypal response
  const handleResponse = (data) => {
    console.log("data" +data);
    if (data === 'success') {
      setModalVisible(!modalVisible);
    } else if (data === 'cancel') {
      setModalVisible(modalVisible);
    } else {
      return;
    }
  };

  const config = {
    withCredentials: true,
    baseURL: 'http://localhost:3000/',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  //setting trainer details at page:

  //trainer reviews array
  const trainerReviewsArray = trainerObject.reviews;

  //for trainer star count
  const getTrainerStarRating = () => {
    let starsCounter = 0;
    let finalStarRating = 0;
    if (trainerReviewsArray.length === 0) {
      return 0;
    } else {
      for (let index = 0; index < trainerReviewsArray.length; index++) {
        const element = trainerReviewsArray[index];
        starsCounter += Number(element.stars);
      }
      finalStarRating = (starsCounter / trainerReviewsArray.length).toFixed(1);
      return finalStarRating;
    }
  };

  const cleanedPrice = typeOfTrainingSelected.replace(/[^0-9]/g, '');
  //get price from trainer object
  const prices = trainerObject.prices;
  //get location from trainer object

  const typeOfTrainingSelectedWithoutPrice = typeOfTrainingSelected.split(
    ':',
  )[0];
  const locations = trainerObject.location;

  //check for location count in trainer
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkForLocationsCount = () => {
    console.log('MYMARK');
    console.log(locations.trainingSite2.coordinates);
    //if there is no second training site
    //don't show dropDownPicker
    if (locations.trainingSite2.coordinates.length === 0) {
      setIsTrainerHasOneLocation(true);
      setLocationLongitudeCoordinate(locations.trainingSite1.coordinates[0]);
      setLocationLatitudeCoordinate(locations.trainingSite1.coordinates[1]);
      setTrainingSiteSelected(locations.trainingSite1.address);
    } else {
      //there are two training sites => showing dropDownPicker
      setIsTrainerHasOneLocation(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getClientFromMongoDB = () => {
    const user = auth().currentUser;
    console.log(user.email);
    axios
      .get('/clients/' + user.email.toLocaleLowerCase(), config)
      .then((doc) => {
        if (doc) {
          const currectUserData = doc.data[0];
          setClientID(currectUserData._id);
          setClientFirstName(currectUserData.name.first);
          setClientLastName(currectUserData.name.last);
          setClientProfilePic(currectUserData.image);

          if (doc.data[0].email != null) {
          }
        }
      })
      .catch((err) => console.log(err));
  };

  let orderDateClean = orderDate;
  console.log('orderDateClean' + orderDateClean);
  let startTime = orderDate + ' ' + orderStartTime;
  let endTime = orderDate + ' ' + orderEndTime;

  console.log('orderDate' + orderDateClean);
  console.log('orderStartTime: ' + startTime);
  console.log('orderEndTime: ' + endTime);

  //array for the picker labels
  const pickerItems = [];

  const searchLocation = async (text) => {
    setInputText(text);
    if (!text.trim()) {
      setIsAddressSelected('none');
      // setIsSearchingForLocation('none');
    } else {
      // setIsSearchingForLocation('flex');
    }
    axios
      .request({
        method: 'post',
        url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}&input=${text}`,
      })
      .then((response) => {
        setListData(response.data.predictions);
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  const getLocationsFromSearch = () => {
    let repeats = [];
    if (listData !== []) {
      for (let i = 0; i < listData.length; i++) {
        console.log('listData[i]');
        console.log(listData[i]);
        console.log(listData[i].title);
        //pushing each trainer UI into the array
        repeats.push(
          <TouchableOpacity
            onPress={() => handleSearchBoxPressed(listData[i].description)}
            key={'listData' + i}>
            <View style={styles.resultItem}>
              <Text style={styles.itemText}>{listData[i].description}</Text>
            </View>
          </TouchableOpacity>,
        );
      }
    }
    return repeats;
  };

  const registerOrder = () => {
    axios
      .post(
        '/clients/orders/book-order',
        {
          client: {
            id: clientID,
            firstName: clientFirstName,
            lastName: clientLastName,
            profilePic: clientProfilePic,
          },
          trainer: {
            id: trainerObject._id,
            firstName: trainerObject.name.first,
            lastName: trainerObject.name.last,
            profilePic: trainerObject.media.images[0],
          },
          type: typeOfTrainingSelectedWithoutPrice,
          category: categorySelected,
          trainingDate: {
            startTime: startTime,
            endTime: endTime,
          },
          cost: cleanedPrice,
          location: {
            address: trainingSiteSelected,
            latitude: locationLatitudeCoordinate,
            longitude: locationLongitudeCoordinate,
          },
        },
        config,
      )
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  //for show/hide chooseDateAndTimeButton
  if (orderEndTime === '') {
    let isDateSelectedForButtonShow = 'flex';
  } else {
    // setIsDateSelected('flex');
    isDateSelected = 'flex';
    isDateSelectedForButtonShow = 'none';
  }

  //Handle when the user presses the yes button in the dialog
  const handleYesDialog = () => {
    setDialogVisible(false);
    navigation.goBack();
  };

  //Handle when the user presses the no button in the dialog
  const handleNoDialog = () => {
    setDialogVisible(false);
  };

  const handleArrowButton = () => {
    setDialogVisible(true);
  };

  const handleOnCategoryPressed = (item) => {
    setCategorySelected(item.label);
  };

  const handleOnTrainingTypePressed = (item) => {
    setTypeOfTrainingSelected(item.label);
    // const atTrainer = 'at Trainer';
    const outdoor = 'outdoor';
    const itemLabel = String(item.label);
    if (itemLabel.includes(outdoor)) {
      setIsOutdoorTraining('flex');
      setIsAtTrainerTraining('none');
    } else {
      setIsOutdoorTraining('none');
      setIsAtTrainerTraining('flex');
    }
  };

  const handleSearchBoxPressed = (item) => {
    setListData({});
    setInputText(item);
    setTrainingSiteSelected(item);
    setIsAddressSelected('flex');
    console.log(trainingSiteSelected);

    Geocoder.from(item)
      .then((json) => {
        let location = json.results[0].geometry.location;
        setLocationLatitudeCoordinate(location.lat);
        setLocationLongitudeCoordinate(location.lng);

        console.log(locationLongitudeCoordinate);
      })
      .catch((error) => console.warn(error));
  };

  const handleOnTrainingSiteSelected = (item) => {
    setTrainingSiteSelected(item.label);
    if (item.label === locations.trainingSite1.address) {
      setLocationLongitudeCoordinate(locations.trainingSite1.coordinates[0]);
      setLocationLatitudeCoordinate(locations.trainingSite1.coordinates[1]);

      console.log('locationLatitudeCoordinate' + locationLatitudeCoordinate);
    } else {
      setLocationLongitudeCoordinate(locations.trainingSite2.coordinates[0]);
      setLocationLatitudeCoordinate(locations.trainingSite2.coordinates[1]);
    }
  };

  const handleChooseDateAndTime = () => {
    dispatchTrainerObject({
      type: 'SET_TRAINER_OBJECT',
      trainerObject: trainerObject,
    });
    dispatchOrderTrainingSiteAddress({
      type: 'SET_ORDER_TRAINING_SITE_ADDRESS',
      orderTrainingSiteAddress: categorySelected,
    });
    dispatchOrderTrainingCategory({
      type: 'SET_ORDER_TRAINING_CATEGORY',
      orderTrainingCategory: trainingSiteSelected,
    });

    navigation.navigate('ChooseDateAndTimePage');
  };

  const handleOnPayPalButtonPressed = async () => {
    console.log("PayPalButtonPressed: go out");
    //Listener to when the client returns to the application
    Linking.addEventListener('url', (responseUrl) => {
      if(responseUrl.url.includes('cancel')){
        handleResponse('cancel');
      }
      else {
        handleResponse('success');
      }
    });

    //The price selected
    let price = typeOfTrainingSelected.replace(/[^0-9]/g, '');

    //The training type selected (without cost)
    let trainingType = typeOfTrainingSelected.split(':')[0];

    //Default paypal url
    let defaultUrl = 'http://localhost:3000/paypal';

    //Symbols for the query
    let querySymbol = '?';
    let querySeprator = '&';

    //Parameters for the query
    // var clientIdQuery = 'clientID='+clientID
    let priceQuery = 'price=' + price;
    let trainingTypeQuery = 'trainingType=' + trainingType;
    let categoryQuery = 'category=' + categorySelected;

    //The finished url with all the parameters and symbols required.
    let finishedUrl =
      defaultUrl +
      querySymbol +
      priceQuery +
      querySeprator +
      trainingTypeQuery +
      querySeprator +
      categoryQuery;

    //Check if the url is safe to open
    const canOpen = await Linking.canOpenURL(finishedUrl);

    if (canOpen) {
      //Open the url using linking (open browser)
      await Linking.openURL(finishedUrl);
    }
  };

  //Handle when the client presses on Discount Code button
  const handleOnReviewsPressed = () => {
    // registerOrder();
    navigation.navigate('TrainerReviews');

    // navigation.navigate('ComingSoon');
  };

  //Handle when the client presses on Customer Service button
  const handleOnChatPressed = () => {};

  //Handle when the client presses on gift card purchase button
  const handleOnCallPressed = () => {
    // navigation.navigate('ComingSoon');
  };

  /*const getHeader = () => {
    return;
  };*/

  /* const getFooter = () => {
    if (this.state.loading) {
      return null;
    }
    return <Text>{'Loading...'}</Text>;
  };*/

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.arrowAndHeaderContainer}>
          <ArrowBackButton onPress={handleArrowButton} />
          <View style={styles.header}>
            <Text style={styles.headerText}>Just You</Text>
          </View>
        </View>

        <View style={styles.imageAndDetailsContainer}>
          <View style={styles.trainerImageViewContainer}>
            <FastImage
              style={styles.trainerImageView}
              source={{
                uri: trainerObject.media.images[0],
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.stretch}
            />
          </View>
          <View style={styles.trainerDetailsContainer}>
            <Text style={styles.trainerNameTitle}>
              {' '}
              {trainerObject.name.first + ' ' + trainerObject.name.last}
            </Text>

            <View style={styles.trainerStarRatingContainer}>
              {/*     In case we want show message if no any rating yet */}
              {/* {trainerReviewsArray.length === 0 ?
                                    <Text style={styles.trainerStarRating}>no comments</Text>
                                    :
                                    <Text style={styles.trainerStarRating}>{getTrainerStarRating()}</Text>}

                                    {trainerReviewsArray.length === 0 ?
                                    <Image
                                        // source={require('../../../images/ratingStar.png')}
                                        style={styles.starIcon}/>
                                        :
                                        <Icon name="star" size={Dimensions.get('window').height * .02} color="black" />
                                    } */}
              <Text style={styles.trainerStarRating}>
                {getTrainerStarRating()}
              </Text>
              <Image
                source={require('../../../images/starIconBlue.png')}
                style={styles.starIcon}
              />

              {/* <Icon name="star" size={Dimensions.get('window').height * .02} color="black" /> */}
            </View>
            <Text style={styles.categoryAndCertificationText}>
              {' '}
              Certifications: NSCA-CSCS{' '}
            </Text>
          </View>
        </View>

        <View style={styles.categorySelectContainer}>
          <Text style={styles.pageMainTitles}> Category</Text>

          <DropDownPicker
            {...trainerObject.categories.map((i) => {
              pickerItems.push({
                value: i,
                label: i,
                icon: () => (
                  <Icon
                    name="arrow-right"
                    size={Dimensions.get('window').height * 0.02}
                    color="#00bfff"
                  />
                ),
              });
            })}
            items={pickerItems}
            defaultValue={''}
            containerStyle={styles.innerContainerViewObject}
            style={styles.dropBoxA}
            itemStyle={{
              justifyContent: 'flex-start',
            }}
            dropDownStyle={{backgroundColor: '#fafafa'}}
            onChangeItem={
              (item) => handleOnCategoryPressed(item)

              //     this.setState({
              //     country: item.value
              // })
            }
          />
        </View>

        <View style={styles.typeOfTrainingSelectContainer}>
          <Text style={styles.pageMainTitles}> Type of Training</Text>

          <DropDownPicker
            items={[
              {
                label:
                  'Single at Trainer: $' + prices.single.singleAtTrainer + '/h',
                value: prices.single.singleAtTrainer,
                icon: () => (
                  <Icon
                    name="user"
                    size={Dimensions.get('window').height * 0.02}
                    color="#00bfff"
                  />
                ),
                hidden: true,
              },
              {
                label: 'Single outdoor: $' + prices.single.singleOutdoor + '/h',
                value: prices.single.singleOutdoor,
                icon: () => (
                  <Icon
                    name="user"
                    size={Dimensions.get('window').height * 0.02}
                    color="#00bfff"
                  />
                ),
              },
              {
                label:
                  'Couple at Trainer: $' + prices.couple.coupleAtTrainer + '/h',
                value: prices.couple.coupleAtTrainer,
                icon: () => (
                  <Icon
                    name="users"
                    size={Dimensions.get('window').height * 0.02}
                    color="#00bfff"
                  />
                ),
              },
              {
                label: 'Couple outdoor: $' + prices.couple.coupleOutdoor + '/h',
                value: prices.couple.coupleOutdoor,
                icon: () => (
                  <Icon
                    name="users"
                    size={Dimensions.get('window').height * 0.02}
                    color="#00bfff"
                  />
                ),
              },
            ]}
            defaultValue={''}
            containerStyle={styles.innerContainerViewObject}
            style={styles.dropBoxB}
            itemStyle={{
              justifyContent: 'flex-start',
            }}
            dropDownStyle={{backgroundColor: '#fafafa'}}
            onChangeItem={
              (item) => handleOnTrainingTypePressed(item)

              //     this.setState({
              //     country: item.value
              // })
            }
          />
        </View>

        <View style={styles.trainingSiteSelectContainer}>
          <Text style={styles.pageSubTitles}>Training Site</Text>

          <View display={isOutdoorTraining}>
            <View style={styles.textInputContainer}>
              <View display={isAddressSelected}>
                <Icon
                  name="map-pin"
                  size={Dimensions.get('window').height * 0.02}
                  color="#00bfff"
                  style={styles.iconTextInput}
                />
              </View>
              <TextInput
                style={styles.textStyle}
                placeholder={'Search your address'}
                placeholderTextColor={'grey'}
                onChangeText={(text) => searchLocation(text)}
                value={inputText}
              />
            </View>
            {/* <View display={isSearchingForLocation}> */}
            <View>
              {getLocationsFromSearch()}
              {/* <FlatList
                                        vertical
                                        showsVerticalScrollIndicator = {true}
                                        data={listData}
                                        keyExtractor={item => item._id}
                                        renderItem={({item, index}) => {
                                        return (
                                            <TouchableOpacity
                                            style={styles.resultItem}
                                            onPress={() => handleSearchBoxPressed(item.description)}
                                            >
                                            <Text  style={styles.itemText}>{item.description}</Text>
                                            </TouchableOpacity>
                                        );
                                        }}
                                        keyExtractor={(item) => item.id}
                                        style={styles.searchResultsContainer}
                                /> */}
            </View>

            {/* </View> */}
          </View>
          <View display={isAtTrainerTraining}>
            {isTrainerHasOneLocation ? (
              <View style={styles.onlyOneLocationContainer}>
                <View style={styles.onlyOneLocationIcon}>
                  <Icon
                    name="map-pin"
                    size={Dimensions.get('window').height * 0.02}
                    color="#00bfff"
                  />
                </View>
                <Text style={styles.onlyOneLocationText}>
                  {locations.trainingSite1.address}
                </Text>
              </View>
            ) : (
              <DropDownPicker
                items={[
                  {
                    label: locations.trainingSite1.address,
                    value: 'usa',
                    icon: () => (
                      <Icon
                        name="map-pin"
                        size={Dimensions.get('window').height * 0.02}
                        color="#00bfff"
                      />
                    ),
                    hidden: true,
                  },
                  {
                    label: locations.trainingSite2.address,
                    value: 'uk',
                    icon: () => (
                      <Icon
                        name="map-pin"
                        size={Dimensions.get('window').height * 0.02}
                        color="#00bfff"
                      />
                    ),
                  },
                ]}
                // ]}
                defaultValue={''}
                containerStyle={styles.innerContainerViewObject}
                style={styles.dropBoxC}
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                dropDownStyle={{backgroundColor: '#fafafa'}}
                onChangeItem={(item) => handleOnTrainingSiteSelected(item)}
              />
            )}
          </View>
        </View>

        <View style={styles.optionsSelectContainer}>
          <Text style={styles.pageSubTitles}>Date</Text>
          <View display={isDateSelectedForButtonShow}>
            <TouchableOpacity
              style={styles.chooseDateButton}
              onPress={() => handleChooseDateAndTime()}>
              <Text style={styles.chooseDateText}>Choose date and time</Text>
            </TouchableOpacity>
          </View>

          <View display={isDateSelected} style={styles.dateSelectedContainer}>
            <View style={styles.dateSelectedInnerContainer}>
              <View style={styles.dateSelectedIcon}>
                <Icon
                  name="calendar"
                  size={Dimensions.get('window').height * 0.07}
                  color="#00bfff"
                  strokeWidth="12"
                />
              </View>

              <View>
                <View style={styles.dateSelectedDetailsContainer}>
                  <View style={styles.dateSelectedDetails}>
                    <Text style={styles.dateSelectedDetailsText}>Date: </Text>
                    <Text style={styles.dateSelectedDetailsText}>
                      Start time:{' '}
                    </Text>
                    <Text style={styles.dateSelectedDetailsText}>
                      End Time:{' '}
                    </Text>
                  </View>
                  <View style={styles.dateSelectedDetails}>
                    <Text style={styles.dateSelectedDetailsText}>
                      {orderDateClean + ''.slice(0, 10)}
                    </Text>
                    <Text style={styles.dateSelectedDetailsText}>
                      {orderStartTime}
                    </Text>
                    <Text style={styles.dateSelectedDetailsText}>
                      {orderEndTime}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.changeDateButton}
                  onPress={() => handleChooseDateAndTime()}>
                  <Text style={styles.chooseDateText}>
                    Change date and time
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.optionsSelectContainer}>
          <Text style={styles.pageSubTitles}>Cost</Text>
          <View style={styles.rowCostContainer}>
            <Icon
              name="dollar-sign"
              size={Dimensions.get('window').height * 0.02}
              color="black"
              style={styles.dollarSign}
            />

            <TextInput editable={false} style={styles.costTextBox}>
              {cleanedPrice}
            </TextInput>
          </View>
        </View>

        <View style={styles.payContainer}>
          <TouchableOpacity onPress={handleOnPayPalButtonPressed}>
            <Image
              style={styles.paypalImage}
              source={require('../../../images/paypalbutton.png')}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.moreContainer}>
          <Text style={styles.moreTitle}>More Links</Text>
          <View style={styles.rowsContainer} />
          <View style={styles.eachRowContainer}>
            <View style={styles.navigationsRows}>
              <TouchableOpacity onPress={() => handleOnReviewsPressed()}>
                <Text style={styles.navigationsRowsTitle}>Reviews</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.discountCodeButton}
                onPress={() => handleOnReviewsPressed()}>
                <Image
                  source={require('../../../images/arrowButton.png')}
                  style={styles.arrowImage}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.eachRowContainer}>
            <View style={styles.navigationsRows}>
              <TouchableOpacity onPress={() => handleOnChatPressed()}>
                <Text style={styles.navigationsRowsTitle}>
                  Customer Service
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={() => handleOnChatPressed()}>
                <Image
                  source={require('../../../images/arrowButton.png')}
                  style={styles.arrowImage}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.eachRowContainer}>
            <View style={styles.navigationsRows}>
              <TouchableOpacity onPress={() => handleOnCallPressed()}>
                <Text style={styles.navigationsRowsTitle}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={() => handleOnCallPressed()}>
                <Image
                  source={require('../../../images/arrowButton.png')}
                  style={styles.arrowImage}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View>
        <Dialog.Container visible={dialogVisible}>
          <Dialog.Title style={styles.dialogTitle}>Are You Sure?</Dialog.Title>
          <Dialog.Button
            style={styles.cancelDialog}
            label="Cancel"
            onPress={() => handleNoDialog()}
          />
          <Dialog.Button
            style={styles.sureDialog}
            label="Sure"
            onPress={() => handleYesDialog()}
          />
        </Dialog.Container>
      </View>

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <WebView
          source={{uri: 'http://localhost:3000/'}}
          // onNavigationStateChange={(data) => handleResponse(data)}
          injectedJavaScript={'document.f1.sumbit()'}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
    flex: 1,
  },
  container: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width,
    // overflow: 'visible',
    // height: Dimensions.get('window').height
  },
  header: {
    alignSelf: 'center',
  },
  headerText: {
    fontSize: Dimensions.get('window').height * 0.04,
    fontWeight: 'bold',
  },
  arrowAndHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: Dimensions.get('window').width * 0.95,
    height: Dimensions.get('window').width * -0.15,
    marginLeft: Dimensions.get('window').width * -0.155,
  },
  imageAndDetailsContainer: {
    flexDirection: 'row',
    marginTop: Dimensions.get('window').height * 0.03,
  },
  trainerImageViewContainer: {
    borderRadius: 16,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.5,
    elevation: 3,
  },
  trainerImageView: {
    width: Dimensions.get('window').width * 0.2,
    height: Dimensions.get('window').height * 0.095,
    marginLeft: Dimensions.get('window').width * 0.04,
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
  trainerDetailsContainer: {
    marginLeft: Dimensions.get('window').height * 0.03,
    flexDirection: 'column',
  },
  trainerNameTitle: {
    fontSize: Dimensions.get('window').height * 0.025,
    fontWeight: 'bold',
  },
  trainerStarRatingContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginTop: Dimensions.get('window').height * 0.02,
  },
  trainerStarRating: {
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height * 0.02,
  },
  starIcon: {
    height: Dimensions.get('window').height * 0.022,
    width: Dimensions.get('window').height * 0.022,
  },

  trainerCategoryAndCertification: {},
  categoryAndCertificationText: {},
  optionsSelectContainer: {
    marginTop: Dimensions.get('window').height * 0.02,
    marginLeft: Dimensions.get('window').width * 0.04,
    marginRight: Dimensions.get('window').width * 0.04,
  },
  categorySelectContainer: {
    marginTop: Dimensions.get('window').height * 0.02,
    marginLeft: Dimensions.get('window').width * 0.04,
    marginRight: Dimensions.get('window').width * 0.04,
    zIndex: 10,
  },
  typeOfTrainingSelectContainer: {
    marginTop: Dimensions.get('window').height * 0.02,
    marginLeft: Dimensions.get('window').width * 0.04,
    marginRight: Dimensions.get('window').width * 0.04,
    zIndex: 9,
  },
  trainingSiteSelectContainer: {
    marginTop: Dimensions.get('window').height * 0.02,
    marginLeft: Dimensions.get('window').width * 0.04,
    marginRight: Dimensions.get('window').width * 0.04,
    zIndex: 8,
  },
  onlyOneLocationContainer: {
    height: Dimensions.get('window').height * 0.05,
    width: Dimensions.get('window').width * 0.915,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gainsboro',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  onlyOneLocationIcon: {
    marginLeft: Dimensions.get('window').width * 0.02,
  },
  onlyOneLocationText: {
    marginLeft: Dimensions.get('window').width * 0.015,
  },
  searchResultsContainer: {
    width: Dimensions.get('window').width * 0.915,
    alignSelf: 'center',
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gainsboro',
    opacity: 0.8,
    zIndex: 1,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  resultItem: {
    height: Dimensions.get('window').height * 0.05,
  },
  textInputContainer: {
    marginTop: Dimensions.get('window').height * 0.01,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gainsboro',
    backgroundColor: '#fafafa',
    height: Dimensions.get('window').height * 0.045,
  },
  textStyle: {
    height: Dimensions.get('window').height * 0.045,
    flex: 1,
    paddingLeft: Dimensions.get('window').width * 0.03,
    // marginTop: Dimensions.get('window').height * .01,
    fontSize: Dimensions.get('window').height * 0.02,
  },
  iconTextInput: {
    marginLeft: Dimensions.get('window').width * 0.025,
    // marginTop: Dimensions.get('window').height * .01,
  },
  itemText: {
    fontSize: Dimensions.get('window').height * 0.02,
  },

  pageMainTitles: {
    fontSize: Dimensions.get('window').height * 0.02,
    fontWeight: 'bold',
  },
  pageSubTitles: {
    fontSize: Dimensions.get('window').height * 0.017,
    fontWeight: 'bold',
  },
  innerContainerViewObject: {
    marginTop: Dimensions.get('window').height * 0.005,
    height: Dimensions.get('window').height * 0.045,
  },
  dropBoxA: {
    backgroundColor: '#fafafa',
    zIndex: 10,
  },
  dropBoxB: {
    backgroundColor: '#fafafa',
    zIndex: 9,
  },
  dropBoxC: {
    backgroundColor: '#fafafa',
    zIndex: 8,
  },

  trainingSiteContainer: {},
  trainingSiteContainerTitle: {},
  trainingSiteDropDownContainer: {},
  trainingSiteRowContainer: {},
  trainingSiteCheckBox: {},

  chooseDateButton: {
    marginTop: Dimensions.get('window').height * 0.005,
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'deepskyblue',
    borderRadius: 20,
  },
  chooseDateText: {
    fontSize: Dimensions.get('window').height * 0.02,
    fontWeight: 'bold',
    color: 'white',
  },
  orderInformationContainer: {
    borderTopWidth: 2,
    borderTopColor: 'lightgrey',
    marginTop: Dimensions.get('window').height * 0.04,
    height: Dimensions.get('window').height * 0.3,
    width: Dimensions.get('window').width * 0.85,
    alignSelf: 'center',
  },
  orderRow: {
    backgroundColor: 'whitesmoke',
    flexDirection: 'row',
    width: Dimensions.get('window').width * 0.85,
    height: Dimensions.get('window').height * 0.07,
    alignSelf: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: 'lightgrey',
  },
  orderRowSecond: {
    backgroundColor: 'white',
    flexDirection: 'row',
    width: Dimensions.get('window').width * 0.85,
    height: Dimensions.get('window').height * 0.07,
    alignSelf: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: 'lightgrey',
  },
  dateSelectedContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'lightgrey',
    alignSelf: 'center',
    backgroundColor: 'whitesmoke',
    marginTop: Dimensions.get('window').height * 0.008,
  },
  dateSelectedInnerContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignContent: 'center',
    marginLeft: Dimensions.get('window').width * 0.06,
    justifyContent: 'space-between',
    marginRight: Dimensions.get('window').width * 0.06,
  },
  dateSelectedIcon: {
    marginTop: Dimensions.get('window').height * 0.02,
  },
  dateSelectedDetailsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',

    marginTop: Dimensions.get('window').height * 0.008,
  },
  dateSelectedDetails: {
    flexDirection: 'column',
    marginLeft: Dimensions.get('window').width * 0.03,

    marginRight: Dimensions.get('window').width * 0.03,
  },
  dateSelectedDetailsText: {
    fontSize: Dimensions.get('window').height * 0.018,
  },
  changeDateButton: {
    marginTop: Dimensions.get('window').height * 0.005,
    marginBottom: Dimensions.get('window').height * 0.005,
    marginRight: Dimensions.get('window').width * 0.055,
    marginLeft: Dimensions.get('window').width * 0.065,
    width: Dimensions.get('window').width * 0.53,
    height: Dimensions.get('window').height * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'deepskyblue',
    borderRadius: 20,
  },
  rowCostContainer: {
    flexDirection: 'row',
    marginLeft: Dimensions.get('window').width * 0.03,
  },
  costTextBox: {
    marginTop: Dimensions.get('window').height * 0.005,
    marginRight: Dimensions.get('window').width * 0.05,
    width: Dimensions.get('window').width * 0.2,
    height: Dimensions.get('window').height * 0.04,
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: Dimensions.get('window').height * 0.02,
    opacity: 0.8,
    borderWidth: 1.5,
    borderRadius: 17,
    zIndex: 1,
  },

  dollarSign: {
    marginTop: Dimensions.get('window').height * 0.014,
    marginRight: Dimensions.get('window').width * -0.08,
    // width: Dimensions.get('window').width * .017,
    // height: Dimensions.get('window').height * .02,
    zIndex: 2,
  },
  payTextBox: {
    marginTop: Dimensions.get('window').height * 0.005,
    marginRight: Dimensions.get('window').width * 0.05,
    width: Dimensions.get('window').width * 0.2,
    height: Dimensions.get('window').height * 0.04,
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: Dimensions.get('window').height * 0.02,
    opacity: 0.8,
    borderWidth: 1.5,
    borderRadius: 17,
    zIndex: 1,
  },

  payContainer: {
    marginTop: Dimensions.get('window').height * 0.02,
    alignSelf: 'center',
  },
  paypalImage: {
    width: Dimensions.get('window').width * 0.4,
    height: Dimensions.get('window').height * 0.04,
    borderRadius: 17,
  },
  costText: {
    marginTop: Dimensions.get('window').height * 0.005,
    marginLeft: Dimensions.get('window').width * 0.01,
    fontSize: Dimensions.get('window').height * 0.025,
    zIndex: 1,
  },
  moreContainer: {
    marginTop: Dimensions.get('window').height * 0.035,
  },
  moreTitle: {
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height * 0.025,
    marginLeft: 20,
  },
  rowsContainer: {
    marginTop: Dimensions.get('window').height * 0.035,
  },
  eachRowContainer: {
    height: Dimensions.get('window').height * 0.04,
    justifyContent: 'center',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 2,
  },
  arrowImage: {
    height: Dimensions.get('window').height * 0.015,
    marginTop: Dimensions.get('window').height * 0.005,
  },
  arrowButton: {},
  navigationsRows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navigationsRowsTitle: {
    fontSize: Dimensions.get('window').height * 0.02,
    marginLeft: Dimensions.get('window').width * 0.05,
  },

  dialogTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  dialogContent: {
    fontSize: 18,
  },
  cancelDialog: {
    color: 'black',
  },
  sureDialog: {
    color: 'red',
    fontWeight: 'bold',
  },
  titlesContainer: {
    alignItems: 'center',
  },
  justYouHeader: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  partnerText: {
    color: 'deepskyblue',
    fontWeight: 'bold',
    fontSize: 20,
  },
  arrowBackButton: {
    alignItems: 'flex-start',
    marginLeft: 15,
  },
});

export default TrainerOrderPage;
