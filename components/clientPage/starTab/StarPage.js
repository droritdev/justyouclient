import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Modal, ScrollView, StyleSheet, Text, View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Feather';
import DropdownAlert from 'react-native-dropdownalert';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

import { TrainerContext } from '../../../context/TrainerContext';
import { CategoryContext } from '../../../context/CategoryContext';
import { OrderContext } from '../../../context/OrderContext';
import auth from '@react-native-firebase/auth';
import { ClientContext } from '../../../context/ClientContext';
import Alert from 'react-native/Libraries/Alert/Alert';

//The client's start area page
const StarPage = ({ navigation }) => {
  let reviewDialogAfterClickingYes = false;
  //in all the main pages
  //ref to show covid alert
  let dropDownAlertRef = useRef(null);
  //Modal to display for covid-19 alert tap
  const [covidModalVisible, setCovidModalVisible] = useState(false);
  const [showCovidOverlay, setShowCovidOverlay] = useState(true)

  const [doc, setDoc] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // const [reviewsArray,setReviewsArray] = useState([]);
  let reviewsArray = [];

  const [mainCategoryArray, setMainCategoryArray] = useState([]);
  const forceUpdate = useReducer((bool) => !bool)[1]; //Page refresh

  const { category, dispatchCategory } = useContext(CategoryContext);
  const [completedOrdersToPass, setCompletedOrdersToPass] = useState([]);
  const { trainerObject, dispatchTrainerObject } = useContext(TrainerContext);
  const { orderEndTime, dispatchOrderEndTime } = useContext(OrderContext);
  const [trainersInCategoryCount, setTrainersInCategoryCount] = useState(0);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [kickBoxArrayCount, setKickBoxArrayCount] = useState(0);
  const [martialArtsArrayCount, setMartialArtsArrayCount] = useState(0);
  const [pilatisArrayCount, setPilatisArrayCount] = useState(0);
  const [climbingArrayCount, setClimbingArrayCount] = useState(0);
  const [trxArrayCount, setTrxArrayCount] = useState(0);
  const [dancingArrayCount, setDancingArrayCount] = useState(0);
  const [swimmingArrayCount, setSwimmingArrayCount] = useState(0);
  const [runningArrayCount, setRunningArrayCount] = useState(0);
  const [powerLiftingArrayCount, setPowerLiftingArrayCount] = useState(0);
  const [aerobicArrayCount, setAerobicArrayCount] = useState(0);
  const [balanceArrayCount, setBalanceArrayCount] = useState(0);
  const [crossfitArrayCount, setCrossfitArrayCount] = useState(0);
  const [cyclingArrayCount, setCyclingArrayCount] = useState(0);
  const [enduranceArrayCount, setEnduranceArrayCount] = useState(0);
  const [flexibilityArrayCount, setFlexibilityArrayCount] = useState(0);
  const [horseArrayCount, setHorseArrayCount] = useState(0);
  const [muscleArrayCount, setMuscleArrayCount] = useState(0);
  const [strenthArrayCount, setStrenthArrayCount] = useState(0);
  const [yogaArrayCount, setYogaArrayCount] = useState(0);
  const [otherArrayCount, setOtherArrayCount] = useState(0);
  const [initializing, setInitializing] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');

  const { clientObject, dispatchClientObject } = useContext(ClientContext);
  const [clientObjectToPass, setClientObjectToPass] = useState([]);
  const [clientIdToPass, setClientIdToPass] = useState('[]');

  const [categoryTrainerCountArray, setCategoryTrainerCountArray] = useState(
    [],
  );

  const categories = [
        { id: 1, label: 'STRENGTH' },
        { id: 2, label: 'KICKBOXING' },
        { id: 3, label: 'MARTIAL ARTS' },
        { id: 4, label: 'PILATES' },
        { id: 5, label: 'CLIMBING' },
        { id: 6, label: 'TRX' },
        { id: 7, label: 'DANCING' },
        { id: 8, label: 'SWIMMING' },
        { id: 9, label: 'RUNNING' },
        { id: 10, label: 'AEROBIC' },
        { id: 11, label: 'CYCLING' },
        { id: 12, label: 'FLEXIBILITY' },
        { id: 13, label: 'YOGA' },
        { id: 14, label: 'MUSCLE BUILDING' },
        { id: 15, label: 'BALANCE AND STABILITY' },
        { id: 16, label: 'ENDURANCE' },
        { id: 17, label: 'POWERLIFTING' },
        { id: 18, label: 'CROSSFIT' },
        { id: 19, label: 'HORSEBACK RIDING' },
        { id: 20, label: 'OTHER' }
  ];

  const categoriesArray = [
        'STRENGTH',
        'KICKBOXING',
        'MARTIAL ARTS',
        'PILATES',
        'CLIMBING',
        'TRX',
        'DANCING',
        'SWIMMING',
        'RUNNING',
        'AEROBIC',
        'CYCLING',
        'FLEXIBILITY',
        'YOGA',
        'MUSCLE BUILDING',
        'BALANCE AND STABILITY',
        'ENDURANCE',
        'POWERLIFTING',
        'CROSSFIT',
        'HORSEBACK RIDING',
        'OTHER'
  ];
  const [nameForImage, setNameForImage] = useState('');

  let kickBoxArray = [];
  let martialArtsArray = [];
  let pilatisArray = [];
  let climbingArray = [];
  let trxArray = [];
  let dancingArray = [];
  let swimmingArray = [];
  let runningArray = [];
  let powerLiftingArray = [];
  let aerobicArray = [];
  let balanceArray = [];
  let crossfitArray = [];
  let cyclingArray = [];
  let enduranceArray = [];
  let flexibilityArray = [];
  let horseArray = [];
  let muscleArray = [];
  let strenthArray = [];
  let yogaArray = [];
  let otherArray = [];

  const config = {
    withCredentials: true,
    baseURL: 'https://justyou.iqdesk.info:443/',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Check if covid alert was dismissed
      setDialogVisible(false);
    
      getUserByFirebaseAuth();
      getAllTrainers().then(() => {

      });

    });
    return unsubscribe;
  }, [navigation]);

  const sortByCategory = (trainerArray) => {

    let categoryTrainerCountArray = [];
    for (let index = 0; index < trainerArray.length; index++) {
      const element = trainerArray[index];
      let categoryCount = 0;
      // categoryTrainerCountArray.push(categoryCount)

      for (let j = 0; j < categories.length; j++) {
        const category = categories[j];

        if (element.categories.includes(category.label)) {
          categoryCount += 1;

        }
      }
      if (element.categories.includes('KICK BOX')) {
        kickBoxArray.push(element);
      }
      if (element.categories.includes('MARTIAL ARTS')) {
        martialArtsArray.push(element);
      }
      if (element.categories.includes('PILATES')) {
        pilatisArray.push(element);
      }
      if (element.categories.includes('CLIMBING')) {
        climbingArray.push(element);
      }
      if (element.categories.includes('TRX')) {
        trxArray.push(element);
      }
      if (element.categories.includes('DANCING')) {
        dancingArray.push(element);
      }
      if (element.categories.includes('SWIMMING')) {
        swimmingArray.push(element);
      }
      if (element.categories.includes('RUNNING')) {
        runningArray.push(element);
      }
      if (element.categories.includes('POWERLIFTING')) {
        powerLiftingArray.push(element);
      }

      if (element.categories.includes('AEROBIC')) {
        aerobicArray.push(element);
      }
      if (element.categories.includes('BALANCE AND STABILITY')) {
        balanceArray.push(element);
      }
      if (element.categories.includes('CROSSFIT')) {
        crossfitArray.push(element);
      }
      if (element.categories.includes('CYCLING')) {
        cyclingArray.push(element);
      }
      if (element.categories.includes('ENDURANCE')) {
        enduranceArray.push(element);
      }
      if (element.categories.includes('FLEXIBILITY')) {
        flexibilityArray.push(element);
      }
      if (element.categories.includes('HORSEBACK RIDING')) {
        horseArray.push(element);
      }
      if (element.categories.includes('MUSCLE BUILDING')) {
        muscleArray.push(element);
      }
      if (element.categories.includes('STRENTH')) {
        strenthArray.push(element);
      }
      if (element.categories.includes('YOGA')) {
        yogaArray.push(element);
      }
      if (element.categories.includes('OTHER')) {
        otherArray.push(element);
      }
      
    }
    //    {/* MARK */}

    setKickBoxArrayCount(kickBoxArray.length);
    setMartialArtsArrayCount(martialArtsArray.length);
    setPilatisArrayCount(pilatisArray.length);
    setClimbingArrayCount(climbingArray.length);
    setTrxArrayCount(trxArray.length);
    setDancingArrayCount(dancingArray.length);
    setSwimmingArrayCount(swimmingArray.length);
    setRunningArrayCount(runningArray.length);
    setPowerLiftingArrayCount(powerLiftingArray.length);
    setAerobicArrayCount(aerobicArray.length);
    balanceArrayCount(balanceArray.length);
    setCrossfitArrayCount(crossfitArray.length);
    setCyclingArrayCount(cyclingArray.length);
    setEnduranceArrayCount(enduranceArray.length);
    setFlexibilityArrayCount(flexibilityArray.length);
    setHorseArrayCount(horseArray.length);
    setMuscleArrayCount(muscleArray.length);
    setStrenthArrayCount(strenthArray.length);
    setYogaArrayCount(yogaArray.length);
    setOtherArrayCount(otherArray.length);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getAllTrainers = async () => {
    setIsRefreshing(true);

    await axios
      .get('/trainers/getAllTrainers', config)
      .then((doc) => {
        if (doc) {
          setDoc(doc.data);
          setIsRefreshing(false);
          sortByCategory(doc.data);
          // getTrainersByCategory(doc.data);
        }
      })
      .catch((err) => {
      });
  };

  const getTrainerStarRating = () => {
    let starsCounter = 0;
    let finalStarRating = 0;
    if (reviewsArray.length === 0) {
      return 0;
    } else {
      for (let index = 0; index < reviewsArray.length; index++) {
        const element = reviewsArray[index];
        starsCounter += Number(element.stars);
      }
      finalStarRating = (starsCounter / reviewsArray.length).toFixed(1);
      return finalStarRating;
    }
  };

  const Item = ({
                  trainerObject,
                  name,
                  media,
                  categories,
                  trainerTrainingSite1,
                  trainerTrainingSite2,
                  date,
                  prices,
                }) => (
    <View style={styles.inSectionView}>
      <TouchableOpacity
        onPress={() =>
          handleOnTrainerPressed(
            trainerObject,
            name,
            media,
            categories,
            trainerTrainingSite1,
            trainerTrainingSite2,
            date,
            prices,
          )
        }>
        <View style={styles.inSectionImageViewContainer}>
          <FastImage
            style={styles.inSectionImageView}
            source={{
              uri: media.images[0],
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.stretch}
          />
        </View>
        <View style={styles.trainerPreviewText}>
          <Text style={styles.trainerText1}>{name}</Text>
          <Text style={styles.trainerText2}>Personal Trainer</Text>
          <View style={styles.ratingRow}>
            {/* if we want to change  */}
            {/* {reviewsArray.length === 0 ?
                 <Text style={styles.trainerText3}>no rating yet</Text>
                 :
                 <Text style={styles.trainerText3}>
                     {getTrainerStarRating()}
                     </Text>}

                 {reviewsArray.length === 0 ?
                 <Image
                    style={styles.starIcon}/>
                    :
                <Image
                    source={require('../../../images/ratingStar.png')}
                    style={styles.starIcon}
                />} */}
            <Text style={styles.trainerText3}>{getTrainerStarRating()}</Text>
            <Image
              source={require('../../../images/starIconBlue.png')}
              style={styles.starIcon}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item
      name={`${item.name.first} ${item.name.last}`}
      media={item.media}
      categories={item.categories}
      trainerObject={item}
      {...(reviewsArray = item.reviews)}
    />
  );

  //showing categories over ui
/*  const getTrainersByCategory = (category) => {
    if (doc !== []) {
      // categoriesArray.forEach(category => {
      let trainerCountForEachCategory = 0;
      let trainersByCategory = [];
      for (let index = 0; index < doc.length; index++) {
        const trainer = doc[index];
        if (trainer.categories.includes(category)) {
          trainersByCategory.push(trainer);
        }
        return trainersByCategory.length;
      }
      // });
    }
  };*/

  const switchImages = (category) => {
    switch (category) {
      case 'CLIMBING':
        return require('../../../images/categoriesImages/CLIMBING.jpg');
      case 'DANCING':
        return require('../../../images/categoriesImages/DANCING.jpg');
      case 'KICKBOXING':
        return require('../../../images/categoriesImages/KICKBOXING.jpg');
      case 'MARTIALARTS':
        return require('../../../images/categoriesImages/MARTIALARTS.jpg');
      case 'PILATES':
        return require('../../../images/categoriesImages/PILATES.jpg');
      case 'POWERLIFTING':
        return require('../../../images/categoriesImages/POWERLIFTING.jpg');
      case 'RUNNING':
        return require('../../../images/categoriesImages/RUNNING.jpg');
      case 'SWIMMING':
        return require('../../../images/categoriesImages/SWIMMING.jpg');
      case 'TRX':
        return require('../../../images/categoriesImages/TRX.jpg');
      case 'AEROBIC':
        return require('../../../images/categoriesImages/AEROBIC.jpg');
      case 'BALANCEANDSTABILITY':
        return require('../../../images/categoriesImages/BALANCEANDSTABILITY.jpg');
      case 'CROSSFIT':
        return require('../../../images/categoriesImages/CROSSFIT.jpg');
      case 'CYCLING':
        return require('../../../images/categoriesImages/CYCLING.jpg');
      case 'ENDURANCE':
        return require('../../../images/categoriesImages/ENDURANCE.jpg');
      case 'FLEXIBILITY':
        return require('../../../images/categoriesImages/FLEXIBILITY.jpg');
      case 'HORSEBACKRIDING':
        return require('../../../images/categoriesImages/HORSEBACKRIDING.jpg');
      case 'MUSCLEBUILDING':
        return require('../../../images/categoriesImages/MUSCLEBUILDING.jpg');
      case 'STRENTH':
        return require('../../../images/categoriesImages/STRENTH.jpg');
      case 'YOGA':
        return require('../../../images/categoriesImages/YOGA.jpg');
      case 'OTHER':
        return require('../../../images/categoriesImages/OTHER.jpg');
    }
  };

 /* const showCategoriesOnUi = () => {
    let repeats = [];
    for (let index = 0; index < categoriesArray.length; index++) {
      const category = categoriesArray[index];
      let imageName = category.toString();
      // setNameForImage(switchImages(imageName.replace(" ",'')));

      repeats.push(
        <View style={styles.inSectionView}>
          <View style={styles.inSectionImageViewContainer}>
            <TouchableOpacity
              style={styles.inSectionImageView}
              onPress={() => handleOnCategoryPressed(category)}>
              <Image style={styles.categoryImage} source={nameForImage} />
            </TouchableOpacity>
          </View>
          <View style={styles.categoryPreviewText}>
            <Text style={styles.categoryText1}>{category}</Text>
            <Text style={styles.categoryText2}>Amount of trainers: {1}</Text>
          </View>
        </View>,
      );
    }
  };*/

  //Handle when the client presses on a trainer button
  const handleOnTrainerPressed = (trainerObject) => {

    dispatchTrainerObject({
      type: 'SET_TRAINER_OBJECT',
      trainerObject: trainerObject,
    });
    dispatchOrderEndTime({
      type: 'SET_ORDER_END_TIME',
      orderEndTime: '',
    });

    navigation.navigate('TrainerOrderPage', {
      pageCameFrom: 'StarPage'
    });
  };

  // eslint-disable-next-line no-shadow
  const handleOnCategoryPressed = (category) => {
    dispatchCategory({
      type: 'SET_CATEGORY',
      category: category,
    });

    navigation.navigate('StarPageStack', {
      screen: 'TrainersByCategories',
      params: { categoryFromStarPage: category },
    });
  };

  //Handle when the client presses on Why Us button
  const handleOnWhyUsPressed = () => {
    navigation.navigate('WhyUs');
  };

  //Handle when the client presses on Q&As button
  const handleOnQandAsPressed = () => {
    navigation.navigate('QuestionsAndAnswers');
  };

  //Handle when the client presses on Discount Code button
  const handleOnDiscountCodePressed = () => {
    navigation.navigate('ComingSoon');
  };

  //Handle when the client presses on Customer Service button
  const handleOnCustomerSrvicePressed = () => {
    navigation.navigate('CustomerService');
  };

  //Handle when the client presses on gift card purchase button
  const handleOnGiftCardPurchasePressed = () => {
    navigation.navigate('ComingSoon');
  };

  //Update the covid alert var to false (will not display coivd alert anymore)
  const covidAlertCancel = () => {
    console.log('pressed x')
    global.covidAlert = false;
  };

  //Show the covid information modal
  const covidAlertTap = () => {
    console.log('covidtap ', global.covidAlert)
    setCovidModalVisible(true);
  };

  function handleMaybeLaterDialog() {
    setDialogVisible(false);
  }

  function handleTakeMeDialog() {
    reviewDialogAfterClickingYes = true;
    getUserByFirebaseAuth();
    setDialogVisible(false);
    navigation.navigate('ProfilePageStack', {
      screen: 'History',
      params: { ordersHistoryTrainerArray: completedOrdersToPass },
    });
  }

  const getClientCompletedOrders = async (clientId) => {
    await axios
      .get('/orders/by-client-id/' + clientId,
        config,
      )
      .then((doc) => {

        let allOrders = doc.data;
        let completedOrders = [];

        for (let index = 0; index < allOrders.length; index++) {
          const singleOrder = allOrders[index];
          if (singleOrder.status === 'completed') {
            completedOrders.push(singleOrder);
          }
        }
        setCompletedOrdersToPass(completedOrders);
        const id = clientId;
        getAllTrainersInfo(completedOrders, id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getUserByFirebaseAuth = () => {
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        setInitializing(true);
        axios
          .get('/clients/'
            + user.email.toLocaleLowerCase(),
            config,
          )
          .then((doc) => {
            if (doc) {
              const currectUserData = doc.data[0];
              setFirstName(currectUserData.name.first);
              setLastName(currectUserData.name.last);
              setProfileImageUrl(currectUserData.image);
              setClientIdToPass(doc.data[0]._id);
              setClientObjectToPass(doc.data[0]);

              dispatchClientObject({
                type: 'SET_CLIENT_OBJECT',
                clientObject: doc.data[0],
              });
              //for filling the recent orders scrollView
              getClientCompletedOrders(doc.data[0]._id).then();

            }
          })
          .catch((err) => console.log(err));
      } else {
        setInitializing(true);
      }
    });

    return subscriber; // unsubscribe on unmount
  };

  const getAllTrainersInfo = async (completedOrders, id) => {


    let idArray = [];
    if (completedOrders.length !== 0) {
      //Push into the idArray all of the clientID
      for (let index = 0; index < completedOrders.length; index++) {
        const singleTrainerID = completedOrders[index].trainer.id;
        idArray.push(singleTrainerID);
      }


      //fetch the trainer of all trainers from mongodb using axios
      await axios
        .get('/trainers/findMultipleTrainers/' + idArray,
          config,
        )
        .then((doc) => {
          const allTrainers = doc.data;
          for (let index = 0; index < completedOrders.length; index++) {
            const order = completedOrders[index];
            //for each loop on trainers that are in orders(by id)
            allTrainers.forEach(trainer => {
              //check for same trainer id in order and for trainer
              if (trainer._id === order.trainer.id) {
                //check if client ID is found in the trainer's reviews
                if (!(trainer.reviews.some(i => i.userID.includes(id)))) {
                  if (reviewDialogAfterClickingYes === false) {
                    setDialogVisible(true);
                  }
                }
              }
            });
          }


        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Start of covid alert part */}
      {showCovidOverlay && 
        <View style={styles.covidOverlay}>
        <TouchableWithoutFeedback onPress={covidAlertTap}>
        <View>
          <Text style={styles.covidOverlayText}>Latest information on COVID-19</Text>
          <Text style={styles.covidOverlayText}>Click here to learn more</Text>
        </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setShowCovidOverlay(false)}>
          <View style={styles.closeButton}><Text style={styles.xButton}>X</Text></View>
        </TouchableWithoutFeedback>
        </View>
      }
      <Modal
        animationType="slide"
        transparent={true}
        cancelable={true}
        visible={covidModalVisible}
        onRequestClose={() => {
        }}>
        <View style={styles.covidContainer}>
          <View style={styles.covidModalContainer}>
            <Icon
              name="x-circle"
              size={Dimensions.get('window').width * 0.05}
              style={styles.covidCloseIcon}
              onPress={() => {
                setCovidModalVisible(false);
                global.covidAlert = false;
                setShowCovidOverlay(false)
              }}
            />
            <Text style={styles.covidTitle}>COVID-19 Information</Text>
            <Text style={styles.covidMessage}>
              {
                'We at JustYou take care to follow the changing guidelines of the Ministry of Health regarding the coronavirus. Before ordering, the personal trainer and the client will fill out a statement that they do indeed meet the requirements of the law regarding the coronavirus. \nAs Everyone knows, the guidelines may change at any time and we will make the adujstments according to the changes to be determined by the Ministry of Health. Adherence to these requirments is for all of us for your health and safety and we will know better days'
              }
              .
            </Text>
          </View>
        </View>
      </Modal>

      <View style={styles.covidAlertView}>
        <DropdownAlert
          ref={(ref) => {
            if (ref) {
              dropDownAlertRef = ref;
            }
          }}
          containerStyle={styles.covidAlertContainer}
          showCancel={true}
          infoColor={'deepskyblue'}
          onCancel={covidAlertCancel}
          closeInterval={0}
          onTap={covidAlertTap}
          titleNumOfLines={1}
          messageNumOfLines={1}
        />
      </View>
      {/* End of covid alert part */}

      <ScrollView
        style={styles.container}
        contentContainerStyle={{justifyContent: 'space-between', paddingBottom: 70}}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Just You</Text>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Popular Trainers</Text>
          <View
            style={styles.sectionScrollView}
            // horizontal={true}
            showsHorizontalScrollIndicator={false}>
            <FlatList
              horizontal
              data={doc}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView
            style={styles.sectionScrollView}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            {/* {showCategoriesOnUi()} */}
            <View style={styles.inSectionView}>
              <View style={styles.inSectionImageViewContainer}>
                <TouchableOpacity
                  style={styles.inSectionImageView}
                  onPress={() => handleOnCategoryPressed('KICKBOXING')}>
                  <Image
                    style={styles.categoryImage}
                    source={require('../../../images/categoriesImages/KICKBOXING.jpg')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryPreviewText}>
                <Text style={styles.categoryText1}>KICKBOXING</Text>
                {/* <Text style={styles.categoryText2}>Amount of trainrs: {kickBoxArrayCount}</Text> */}
              </View>
            </View>

            <View style={styles.inSectionView}>
              <View style={styles.inSectionImageViewContainer}>
                <TouchableOpacity
                  style={styles.inSectionImageView}
                  onPress={() => handleOnCategoryPressed('MARTIAL ARTS')}>
                  <Image
                    style={styles.categoryImage}
                    source={require('../../../images/categoriesImages/MARTIALARTS.jpg')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryPreviewText}>
                <Text style={styles.categoryText1}>MARTIAL ARTS</Text>
                {/* <Text style={styles.categoryText2}>Amount of trainrs: {martialArtsArrayCount}</Text> */}
              </View>
            </View>

            <View style={styles.inSectionView}>
              <View style={styles.inSectionImageViewContainer}>
                <TouchableOpacity
                  style={styles.inSectionImageView}
                  onPress={() => handleOnCategoryPressed('PILATES')}>
                  <Image
                    style={styles.categoryImage}
                    source={require('../../../images/categoriesImages/PILATES.jpg')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryPreviewText}>
                <Text style={styles.categoryText1}>PILATES</Text>
                {/* <Text style={styles.categoryText2}>Amount of trainrs: {pilatisArrayCount}</Text> */}
              </View>
            </View>

            <View style={styles.inSectionView}>
              <View style={styles.inSectionImageViewContainer}>
                <TouchableOpacity
                  style={styles.inSectionImageView}
                  onPress={() => handleOnCategoryPressed('CLIMBING')}>
                  <Image
                    style={styles.categoryImage}
                    source={require('../../../images/categoriesImages/CLIMBING.jpg')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryPreviewText}>
                <Text style={styles.categoryText1}>CLIMBING</Text>
                {/* <Text style={styles.categoryText2}>Amount of trainrs: {climbingArrayCount}</Text> */}
              </View>
            </View>

            <View style={styles.inSectionView}>
              <View style={styles.inSectionImageViewContainer}>
                <TouchableOpacity
                  style={styles.inSectionImageView}
                  onPress={() => handleOnCategoryPressed('TRX')}>
                  <Image
                    style={styles.categoryImage}
                    source={require('../../../images/categoriesImages/TRX.jpg')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryPreviewText}>
                <Text style={styles.categoryText1}>TRX</Text>
                {/* <Text style={styles.categoryText2}>Amount of trainrs: {trxArrayCount}</Text> */}
              </View>
            </View>

            <View style={styles.inSectionView}>
              <View style={styles.inSectionImageViewContainer}>
                <TouchableOpacity
                  style={styles.inSectionImageView}
                  onPress={() => handleOnCategoryPressed('SWIMMING')}>
                  <Image
                    style={styles.categoryImage}
                    source={require('../../../images/categoriesImages/SWIMMING.jpg')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryPreviewText}>
                <Text style={styles.categoryText1}>SWIMMING </Text>

                {/* <Text style={styles.categoryText2}>Amount of trainrs: {swimmingArrayCount}</Text> */}
              </View>
            </View>
            <View style={styles.inSectionView}>
              <View style={styles.inSectionImageViewContainer}>
                <TouchableOpacity
                  style={styles.inSectionImageView}
                  onPress={() => handleOnCategoryPressed('RUNNING')}>
                  <Image
                    style={styles.categoryImage}
                    source={require('../../../images/categoriesImages/RUNNING.jpg')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryPreviewText}>
                <Text style={styles.categoryText1}>RUNNING </Text>
                {/* <Text style={styles.categoryText2}>Amount of trainrs: {runningArrayCount}</Text> */}
              </View>
            </View>

            <View style={styles.inSectionView}>
              <View style={styles.inSectionImageViewContainer}>
                <TouchableOpacity
                  style={styles.inSectionImageView}
                  onPress={() => handleOnCategoryPressed('DANCING')}>
                  <Image
                    style={styles.categoryImage}
                    source={require('../../../images/categoriesImages/DANCING.jpg')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryPreviewText}>
                <Text style={styles.categoryText1}>DANCING </Text>
                {/* <Text style={styles.categoryText2}>Amount of trainrs: {dancingArrayCount}</Text> */}
              </View>
            </View>

            <View style={styles.inSectionView}>
              <View style={styles.inSectionImageViewContainer}>
                <TouchableOpacity
                  style={styles.inSectionImageView}
                  onPress={() => handleOnCategoryPressed('POWERLIFTING')}>
                  <Image
                    style={styles.categoryImage}
                    source={require('../../../images/categoriesImages/POWERLIFTING.jpg')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryPreviewText}>
                <Text style={styles.categoryText1}>POWERLIFTING</Text>
                {/* <Text style={styles.categoryText2}>Amount of trainrs: {powerLiftingArrayCount}</Text> */}
              </View>
            </View>

            <View style={styles.inSectionView}>
              <View style={styles.inSectionImageViewContainer}>
                <TouchableOpacity
                  style={styles.inSectionImageView}
                  onPress={() => handleOnCategoryPressed('AEROBIC')}>
                  <Image
                    style={styles.categoryImage}
                    source={require('../../../images/categoriesImages/AEROBIC.jpg')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryPreviewText}>
                <Text style={styles.categoryText1}>AEROBIC</Text>
                {/* <Text style={styles.categoryText2}>Amount of trainrs: {trxArrayCount}</Text> */}
              </View>
            </View>

            <View style={styles.inSectionView}>
              <View style={styles.inSectionImageViewContainer}>
                <TouchableOpacity
                  style={styles.inSectionImageView}
                  onPress={() => handleOnCategoryPressed('BALANCE AND STABILITY')}>
                  <Image
                    style={styles.categoryImage}
                    source={require('../../../images/categoriesImages/BALANCEANDSTABILITY.jpg')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryPreviewText}>
                <Text style={styles.categoryText1}>BALANCE AND STABILITY</Text>
                {/* <Text style={styles.categoryText2}>Amount of trainrs: {trxArrayCount}</Text> */}
              </View>
            </View>

            <View style={styles.inSectionView}>
              <View style={styles.inSectionImageViewContainer}>
                <TouchableOpacity
                  style={styles.inSectionImageView}
                  onPress={() => handleOnCategoryPressed('CROSSFIT')}>
                  <Image
                    style={styles.categoryImage}
                    source={require('../../../images/categoriesImages/CROSSFIT.jpg')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryPreviewText}>
                <Text style={styles.categoryText1}>CROSSFIT</Text>
                {/* <Text style={styles.categoryText2}>Amount of trainrs: {trxArrayCount}</Text> */}
              </View>
            </View>

            <View style={styles.inSectionView}>
              <View style={styles.inSectionImageViewContainer}>
                <TouchableOpacity
                  style={styles.inSectionImageView}
                  onPress={() => handleOnCategoryPressed('CYCLING')}>
                  <Image
                    style={styles.categoryImage}
                    source={require('../../../images/categoriesImages/CYCLING.jpg')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryPreviewText}>
                <Text style={styles.categoryText1}>CYCLING</Text>
                {/* <Text style={styles.categoryText2}>Amount of trainrs: {trxArrayCount}</Text> */}
              </View>
            </View>

            <View style={styles.inSectionView}>
              <View style={styles.inSectionImageViewContainer}>
                <TouchableOpacity
                  style={styles.inSectionImageView}
                  onPress={() => handleOnCategoryPressed('ENDURANCE')}>
                  <Image
                    style={styles.categoryImage}
                    source={require('../../../images/categoriesImages/ENDURANCE.jpg')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryPreviewText}>
                <Text style={styles.categoryText1}>ENDURANCE</Text>
                {/* <Text style={styles.categoryText2}>Amount of trainrs: {trxArrayCount}</Text> */}
              </View>
            </View>

            <View style={styles.inSectionView}>
              <View style={styles.inSectionImageViewContainer}>
                <TouchableOpacity
                  style={styles.inSectionImageView}
                  onPress={() => handleOnCategoryPressed('FLEXIBILITY')}>
                  <Image
                    style={styles.categoryImage}
                    source={require('../../../images/categoriesImages/FLEXIBILITY.jpg')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryPreviewText}>
                <Text style={styles.categoryText1}>FLEXIBILITY</Text>
                {/* <Text style={styles.categoryText2}>Amount of trainrs: {trxArrayCount}</Text> */}
              </View>
            </View>

            <View style={styles.inSectionView}>
              <View style={styles.inSectionImageViewContainer}>
                <TouchableOpacity
                  style={styles.inSectionImageView}
                  onPress={() => handleOnCategoryPressed('HORSEBACK RIDING')}>
                  <Image
                    style={styles.categoryImage}
                    source={require('../../../images/categoriesImages/HORSEBACKRIDING.jpg')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryPreviewText}>
                <Text style={styles.categoryText1}>HORSEBACK RIDING</Text>
                {/* <Text style={styles.categoryText2}>Amount of trainrs: {trxArrayCount}</Text> */}
              </View>
            </View>

            <View style={styles.inSectionView}>
              <View style={styles.inSectionImageViewContainer}>
                <TouchableOpacity
                  style={styles.inSectionImageView}
                  onPress={() => handleOnCategoryPressed('MUSCLE BUILDING')}>
                  <Image
                    style={styles.categoryImage}
                    source={require('../../../images/categoriesImages/MUSCLEBUILDING.jpg')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryPreviewText}>
                <Text style={styles.categoryText1}>MUSCLE BUILDING</Text>
                {/* <Text style={styles.categoryText2}>Amount of trainrs: {trxArrayCount}</Text> */}
              </View>
            </View>

            <View style={styles.inSectionView}>
              <View style={styles.inSectionImageViewContainer}>
                <TouchableOpacity
                  style={styles.inSectionImageView}
                  onPress={() => handleOnCategoryPressed('STRENTH')}>
                  <Image
                    style={styles.categoryImage}
                    source={require('../../../images/categoriesImages/STRENTH.jpg')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryPreviewText}>
                <Text style={styles.categoryText1}>STRENTH</Text>
                {/* <Text style={styles.categoryText2}>Amount of trainrs: {trxArrayCount}</Text> */}
              </View>
            </View>

            <View style={styles.inSectionView}>
              <View style={styles.inSectionImageViewContainer}>
                <TouchableOpacity
                  style={styles.inSectionImageView}
                  onPress={() => handleOnCategoryPressed('YOGA')}>
                  <Image
                    style={styles.categoryImage}
                    source={require('../../../images/categoriesImages/YOGA.jpg')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryPreviewText}>
                <Text style={styles.categoryText1}>YOGA</Text>
                {/* <Text style={styles.categoryText2}>Amount of trainrs: {trxArrayCount}</Text> */}
              </View>
            </View>

            <View style={styles.inSectionView}>
              <View style={styles.inSectionImageViewContainer}>
                <TouchableOpacity
                  style={styles.inSectionImageView}
                  onPress={() => handleOnCategoryPressed('OTHER')}>
                  <Image
                    style={styles.categoryImage}
                    source={require('../../../images/categoriesImages/OTHER.jpg')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryPreviewText}>
                <Text style={styles.categoryText1}>OTHER </Text>

                {/* <Text style={styles.categoryText2}>Amount of trainrs: {otherArrayCount}</Text> */}
              </View>
            </View>

          </ScrollView>
        </View>

        <View style={styles.whyShareQandAUpdatesButtonsView}>
          <View style={styles.whyShareQandAUpdatesButtonsRow}>
            <TouchableOpacity
              style={styles.whyUsButton}
              onPress={() => handleOnWhyUsPressed()}>
              <Text style={styles.whyUsTitle}>WHY US</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.qAndaButton}
              onPress={() => handleOnQandAsPressed()}>
              <Text style={styles.qAndaTitle}>Q&A</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.updatesButton}
              onPress={() => handleOnGiftCardPurchasePressed()}>
              <Text style={styles.updatesTitle}>UPDATES</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.moreContainer}>
          <Text style={styles.moreTitle}>More Links</Text>
          <View style={styles.rowsContainer} />
          <View style={styles.eachRowContainer}>
              <TouchableOpacity onPress={() => handleOnDiscountCodePressed()}>
              <View style={styles.navigationsRows}>
                <View style={styles.bottomLinks}>
                  <Text style={styles.navigationsRowsTitle}>Discount Code</Text>
                </View>
                <Image
                  source={require('../../../images/arrowButton.png')}
                  style={styles.arrowImage}
                />
                </View>
              </TouchableOpacity>
          </View>

          <View style={styles.eachRowContainer}>
              <TouchableOpacity
                onPress={() => handleOnGiftCardPurchasePressed()}>
                <View style={styles.navigationsRows}>
                  <View style={styles.bottomLinks}>
                    <Text style={styles.navigationsRowsTitle}>
                      Gift Card Purchase
                    </Text>
                  </View>
                  <Image
                    source={require('../../../images/arrowButton.png')}
                    style={styles.arrowImage}
                  />
                </View>
              </TouchableOpacity>
          </View>
        </View>
        <View style={{height: 50}}>
        </View>
      </ScrollView>
      {/*If a user did not give a score or feedback on a coach  */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={dialogVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.subtitleText}>You have completed your training successfully</Text>
            <Text style={styles.subtitleText}>Please rate your training experience</Text>

            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleMaybeLaterDialog()}
              >
                <View>
                  <Text style={styles.cancelTextStyle}>Maybe later</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  handleTakeMeDialog();
                }}
              >
                <View>
                  <Text style={styles.submitTextStyle}>Yes</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/*<View>
        <Dialog.Container visible={dialogVisible}>
          <Dialog.Title style={styles.dialogTitle}>Are You Sure?</Dialog.Title>
          <Dialog.Button
            style={styles.cancelDialog}
            label="Maybe later"
            onPress={() => handleMaybeLaterDialog()}
          />
          <Dialog.Button
            style={styles.sureDialog}
            label="Take me"
            onPress={() => handleTakeMeDialog()}
          />
        </Dialog.Container>
      </View>*/}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
  },
  container: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  header: {
    alignSelf: 'center',
    marginTop: 10
  },
  headerText: {
    fontSize: Dimensions.get('window').height * 0.04,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginTop: Dimensions.get('window').height * 0.035,
    marginLeft: Dimensions.get('window').width * 0.025,
  },
  sectionTitle: {
    fontSize: Dimensions.get('window').height * 0.025,
    fontWeight: 'bold',
  },
  sectionScrollView: {
    marginTop: Dimensions.get('window').height * 0.015,
  },
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
  trainerImage: {},
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
  },
  categoryImage: {
    height: Dimensions.get('window').height * 0.1,
    width: Dimensions.get('window').width * 0.29,
    backgroundColor: 'gainsboro',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    // height: Dimensions.get('window').height * .08,
    // width: Dimensions.get('window').width * .29,
  },
  categoryPreviewText: {
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.3,
  },
  categoryText1: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  categoryText2: {
    fontSize: Dimensions.get('window').height * 0.0112,
    textAlign: 'center',
  },
  placesSectionContainer: {
    marginTop: 35,
    marginLeft: Dimensions.get('window').width * 0.0112,
  },
  placesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placesScrollView: {},
  placeView: {
    marginTop: 10,
    marginRight: 5,
    height: Dimensions.get('window').height * 0.125,
    width: Dimensions.get('window').width * 0.3,
    borderWidth: 2,
    borderColor: 'gainsboro',
    borderRadius: 20,
  },
  placeImageViewContainer: {
    height: '60%',
  },
  placeImageView: {
    height: '100%',
    backgroundColor: 'gainsboro',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  placeImage: {},
  placePreviewText: {
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.3,
  },
  placeText1: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  placeText2: {
    fontSize: 10,
    textAlign: 'center',
  },
  whyShareQandAUpdatesButtonsView: {
    marginTop: Dimensions.get('window').height * 0.06,
    width: Dimensions.get('window').width,
  },
  whyShareQandAUpdatesButtonsRow: {
    flexDirection: 'row',
    width: Dimensions.get('window').width * 0.95,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  whyUsButton: {
    width: Dimensions.get('window').width * 0.3,
    height: Dimensions.get('window').height * 0.065,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'gainsboro'
  },
  whyUsTitle: {
    color: 'deepskyblue',
    fontWeight: 'bold',
    fontSize: 18,
  },
  shareAndEarnButton: {
    width: Dimensions.get('window').width * 0.23,
    height: Dimensions.get('window').height * 0.065,
    backgroundColor: 'deepskyblue',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareAndEarnTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  qAndaButton: {
    width: Dimensions.get('window').width * 0.3,
    height: Dimensions.get('window').height * 0.065,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'gainsboro'
  },
  qAndaTitle: {
    color: 'deepskyblue',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  updatesButton: {
    width: Dimensions.get('window').width * 0.3,
    height: Dimensions.get('window').height * 0.065,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'gainsboro'
  },
  updatesTitle: {
    color: 'deepskyblue',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  socialButtons: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    marginTop: 20,
    alignSelf: 'center',
  },
  facebookButton: {
    width: Dimensions.get('window').width * 0.5,
    height: 60,
  },
  instegramImage: {
    width: Dimensions.get('window').width * 0.5,
    height: 60,
  },
  moreContainer: {
    marginTop: Dimensions.get('window').height * 0.1,
  },
  moreTitle: {
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height * 0.025,
    marginLeft: 20,
  },
  rowsContainer: {
    marginTop: Dimensions.get('window').height * 0.001,
  },

  eachRowContainer: {
    height: Dimensions.get('window').height * 0.06,
    justifyContent: 'center',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
  },
  arrowImage: {
    height: Dimensions.get('window').height * 0.015,
    marginTop: Dimensions.get('window').height * 0.01,
  },
  arrowButton: {},
  navigationsRows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navigationsRowsTitle: {
    // marginTop: Dimensions.get('window').height * .0020,
    fontSize: Dimensions.get('window').height * 0.02,
    marginLeft: Dimensions.get('window').width * 0.05,
  },
  discountCodeButton: {},
  customerServicesButton: {},
  giftCardButton: {},
  deadAreaBottom: {
    backgroundColor: 'whitesmoke',
    height: 30,
  },
  customerServicePanel: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').height * 0.8,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  covidAlertView: {
    zIndex: 2,
    opacity: 0.9,
  },
  covidAlertContainer: {
    backgroundColor: 'deepskyblue',
  },
  covidContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  covidModalContainer: {
    backgroundColor: 'white',
    height: Dimensions.get('window').height * 0.45,
    width: Dimensions.get('window').width * 0.9,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  covidTitle: {
    marginTop: Dimensions.get('window').height * 0.01,
    alignSelf: 'center',
    fontSize: Dimensions.get('window').height * 0.0278,
    fontWeight: 'bold',
  },
  covidMessage: {
    flex: 1,
    marginTop: Dimensions.get('window').height * 0.013,
    alignSelf: 'center',
    marginLeft: Dimensions.get('window').width * 0.02,
    fontSize: Dimensions.get('window').height * 0.02,
  },
  covidCloseIcon: {
    marginTop: Dimensions.get('window').height * 0.015,
    marginRight: Dimensions.get('window').width * 0.015,
    alignSelf: 'flex-end',
  },
  covidOverlay: {
    zIndex: 2,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.9,
    backgroundColor: 'deepskyblue',
    width: Dimensions.get('window').width,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  covidOverlayText: {
    color: 'white',
    fontSize: 20
  },
  closeButton:{
    height: 40,
    width: 40,
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  xButton: {
    color: 'white',
    fontSize: 24
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
  }, centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    height: Dimensions.get('window').height * .25,
    width: Dimensions.get('window').width * .86,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginTop: Dimensions.get('window').height * .01,
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').height * .027,
    textAlign: 'center',
  },
  subtitleText: {
    marginTop: Dimensions.get('window').height * .02,
    fontSize: Dimensions.get('window').height * .023,
    textAlign: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Dimensions.get('window').height * .020,

  },
  cancelButton: {
    marginLeft: Dimensions.get('window').width * .04,
    backgroundColor: 'lightgrey',
    width: Dimensions.get('window').width * .25,
    height: Dimensions.get('window').height * .05,
    borderRadius: 20,
    justifyContent: 'center',
  },
  cancelTextStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButton: {
    marginRight: Dimensions.get('window').width * .04,
    backgroundColor: 'deepskyblue',
    width: Dimensions.get('window').width * .25,
    height: Dimensions.get('window').height * .05,
    borderRadius: 20,
    justifyContent: 'center',
  },
  submitTextStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressView: {
    alignSelf: 'center',
  },
  bottomLinks: {
    width: Dimensions.get('window').width * 0.85
  },
  containerWelcome: {
    height: Dimensions.get('window').height,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainerWelcome: {
      justifyContent: 'space-between',
      height: Dimensions.get('window').height * .15,
      alignItems: 'center'
  },
  justYouTextWelcome: {
      fontWeight: 'bold',
      color: 'deepskyblue',
      fontSize: 80
  },
  welcomeUserTextWelcome: {
      marginTop: 20,
      fontWeight: 'bold',
      color: 'steelblue',
      fontSize: 40,
      textAlign: 'center'
  }
});

export default StarPage;
