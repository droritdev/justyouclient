import React, {useState, useReducer, useContext, useRef} from 'react';
import { Button, Text, View, StyleSheet, ScrollView, Dimensions, Image , FlatList, Modal} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import DropdownAlert from 'react-native-dropdownalert';

import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';

import TagSelect from '../../GlobalComponents/tagSelect/TagSelect';



import {CategoryContext} from '../../../context/CategoryContext';
import {TrainerContext} from '../../../context/TrainerContext';






import PickCategories from '../../GlobalComponents/PickCategories';

const categoriesData = [
    { id: 1, label: 'HIT' },
    { id: 2, label: 'KICK BOX' },
    { id: 3, label: 'MARTIAL ARTS' },
    { id: 4, label: 'PILATIS' },
    { id: 5, label: 'CLIMBING' },
    { id: 6, label: 'TRX' },
    { id: 7, label: 'DANCING' },
    { id: 8, label: 'SWIMMING' },
    { id: 9, label: 'RUNNING' },
    { id: 10,label: 'POWERLIFTING' },
    { id: 11,label: 'STREET' }

];

//The claint's search page
const SearchPage = ({navigation, route}) => {

    //in all the main pages
     //ref to show covid alert
     let dropDownAlertRef = useRef(null);
     //Modal to display for covid-19 alert tap
     const [covidModalVisible, setCovidModalVisible] = useState(false);
    // const { categoryFromStarPage } = route.params

    const tagSelectRef = useRef(null);

    const forceUpdate = useReducer(bool => !bool)[1];//Page refresh 

    const {category, dispatchCategory} = useContext(CategoryContext);
    const { dispatchTrainerObject,
                dispatchTrainerNumberOfStarComments,
                    dispatchFinalStarRating,
            } = useContext(TrainerContext);


    const [selectedItems, setSelectedItems] = useState([]);
    // const [clientID, setClientID] = useState("");
    const [items, setItems] = useState(categoriesData);
    const [doc, setDoc] = useState([]);
    // const [recentOrders, setRecentOrders] = useState([]);
    var recentTrainerArray = [];
    // const [reviewsArray,setReviewsArray] = useState([]);
    var reviewsArray = [];

    var trainersByCategory = [];
    const [categoryTitle, setCategoryTitle] = useState('');
    const [isCategoryMode, setIsCategoryMode] = useState(false);
    const [displayCategories, setDisplayCategories] = useState('none');
    const [displayRecentOrders, setDisplayRecentOrders] = useState('flex');


    const [isLoadingCircle, setIsLoadingCircle] = useState(true);
    const [isThereAreTrainersInCategory, setIsThereAreTrainersInCategory] = useState('none');

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
        if(global.covidAlert) {
            if(dropDownAlertRef.state.isOpen === false) {
                //Show covid alert
                dropDownAlertRef.alertWithType('info', 'Latest information on CVOID-19', 'Click here to learn more.');
            }
        } else {
            dropDownAlertRef.closeAction();
        }
        //clear the tag selected and title
        clearTagAndTitle()
            getClientFromMongoDB();
        });
        return unsubscribe;
      }, [navigation]);


    const config = {
        withCredentials: true,
        baseURL: 'http://localhost:3000/',
        headers: {
              "Content-Type": "application/json",
        },
    };
    
    const getClientFromMongoDB =  () => {
        const user = auth().currentUser;
        console.log(user.email);
             axios
                        .get('/clients/'
                        +user.email.toLocaleLowerCase(),
                        config
                    )
                    .then((doc) => {
                        if(doc) {
                            const clientID = doc.data[0]._id;
                        getClientOrders(clientID)
                        
                          if(doc.data[0].email!=null){
                            
                          }
                        }
                      })
                    .catch((err) => console.log(err));
    }

    //Get all orders by Client ID, sort by time created, assaign to designated const
    const getClientOrders = (clientID) => {
    
        axios
        .get('/orders/by-client-id/'+clientID, 
        config
        )
        .then((doc) => {
                var allOrders = doc.data;    
                allOrders = sortOrders(allOrders);
    
                getTrainerFromRecentOrders(allOrders)
                
            })
            .catch((err) => {
                console.log(err);
            });
    }

         //Sort orders by time created
         const sortOrders = (ordersArray) => {
            // Iterate Over Array From First Element
            for (let i = 0; i < ordersArray.length; i++) {
                // Iterate Over Array From Succeeding Element
                for (let j = 1; j < ordersArray.length; j++) {
                    //checks the time order was created at
                    var first = new Date(ordersArray[j - 1].createdAt).getTime();
                    var second = new Date(ordersArray[j].createdAt).getTime();
                    if (first > second) {
                        // Swap Numbers
                        swapNumbers(ordersArray, j - 1, j);
                    }
                }
            }
            return ordersArray;
        }
    
        const swapNumbers = (array, i, j) => {
            // Save Element Value (Because It Will Change When We Swap/Reassign)
            let temp = array[i];
            // Assign Element2 To Element1
            array[i] = array[j];
            // Assign Element1 To Element2
            array[j] = temp;
        };

    const getTrainerFromRecentOrders = (allOrders) => {
        
        //limit recent orders to 5
        var limit = 5
        if (allOrders.length < limit){
            limit = allOrders.length
        }
        for (let index = 0; index < limit; index++) {
            const trainerID = allOrders[index].trainer.id;
            getTrainerFromMongoDB(trainerID);
        }
        console.log('DOCDOCDOC');

        console.log(recentTrainerArray);
        setDoc(recentTrainerArray);
        if(doc){
            setIsLoadingCircle(false);
            forceUpdate();

        }
        
    }

    const getTrainerFromMongoDB = async (trainerID) => {
            await axios
                        .get('/trainers/id/'
                        +trainerID,
                        config
                    )
                    .then((doc) => {
                        if(doc) {
                            
                            //for no duplicates
                            if(!recentTrainerArray.includes(doc.data)){
                                
                                recentTrainerArray.push(doc.data);
                                forceUpdate();
                            }else{
                            }                
                        }
                      })
                    .catch((err) => console.log(err));
    }

    const getTrainerStarRating = () => {
        var starsCounter = 0
        var finalStarRating = 0
        if(reviewsArray.length === 0){
            return 0
        }else{
            for (let index = 0; index < reviewsArray.length; index++) {
                const element = reviewsArray[index];
                starsCounter += Number(element.stars)
            }
    
            finalStarRating = (starsCounter/(reviewsArray.length)).toFixed(1);
            return finalStarRating;
        }
        
    }

   

    const renderItem = ({ item }) => (
        <Item 
        name = {`${item.name.first} ${item.name.last}`}
        media = {item.media.images[0]}
        trainerObject = {item}        
        // {...setReviewsArray(item.reviews)}
        {...reviewsArray = (item.reviews)}
        {...console.log(`${item.name.first} ${item.name.last}`)}
        ></Item>
      );

      const Item = ({ trainerObject, name,media }) => (
       
        <View style={styles.trainerView}>
             <TouchableOpacity
                            onPress={() => handleOnTrainerPressed(trainerObject)}
                            >
                <View style={styles.trainerViewRow}>
                    <TouchableOpacity
                        style={styles.trainerImage}
                    >
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
                        <Text style={styles.trainerDetail1}> {name}</Text>
                        <Text style={styles.trainerDetail2}>Personal Trainer</Text>
                        <View style={styles.ratingRow}>
                            <Text style={styles.trainerDetail3}>{getTrainerStarRating()} </Text>
                            <Image
                                source={require('../../../images/ratingStar.png')}
                                
                            />
                        </View>
                    </View>
                </View>
        </TouchableOpacity>
    </View>
        
      )

    const getAllTrainers = async (category) => {
        
         await axios  
            .get('/trainers/getAllTrainers',
            config)
            .then((doc) => {
                if(doc) {
                    
                    getTrainersByCategory(doc.data, category);
                    setDisplayCategories('flex');
                    setDisplayRecentOrders('none');
                }
            })
            .catch((err) =>  {
                console.log(err)
            });
    }

    //get trainer by category by navigation from star page
    const getTrainersByCategory = (trainersArray, category) => {
        setCategoryTitle(category)

        for (let index = 0; index < trainersArray.length; index++) {
            const trainer = trainersArray[index];
            if(trainer.categories.includes(category)){
                trainersByCategory.push(trainer);
                
            }
            console.log('trainersByCategory');
            console.log(trainersByCategory);
            setDoc(trainersByCategory);
            setIsLoadingCircle(false);
            forceUpdate();
        }
        if(trainersByCategory.length === 0){
            setIsThereAreTrainersInCategory('flex');
        }else{setIsThereAreTrainersInCategory('none');}
    }
    //MARK
    //When the user chooses category it whill be displayed on the input bellow
    const handleOnItemPress = (item) => {
        //TODO: show to user the recent orders if no any choice selected
        // if(categoryTitle === item.label){
        //     clearTagAndTitle()
        // }
        // console.log('itemLabel: ' +item.label)
        // if(selectedItems.includes(item.label)){
        //     let index = selectedItems.indexOf(item.label);
        //     selectedItems.splice(index, 1);
        //     setSelectedItems(selectedItems.filter(element => element !== item.label));
        //     console.log('selectedItemsTop: ' + item.label)
        // }
        // else{
        //     setSelectedItems(selectedItems => [...selectedItems, item.label]);
        //     console.log('selectedItemsbuttom: ' + item.label);
        //     console.log('sendTOMONGO: ' + item.label);
        //     if(selectedItems){
        //         getAllTrainers(item.label);
        //     }else{
        //         setCategoryTitle('select category ')

        //     }
        // }
        getAllTrainers(item.label);

    }

    const clearTagAndTitle = () => {
        tagSelectRef.current.setState({ value: {} });
        setCategoryTitle('Recent orders');


    }

    const handleOnInputChange = (text) => {
        if(text.length > 0){
            console.log('text '+ text)
            setItems(items.filter(item => item.label.toLowerCase().includes(text.toLowerCase())));
        }
        else{
            setItems(categoriesData);
        }
    }

    const handleOnTrainerPressed = (trainerObject ) => {

        dispatchTrainerObject({
            type: 'SET_TRAINER_OBJECT',
            trainerObject: trainerObject
        })
        dispatchTrainerNumberOfStarComments({
            type:'SET_NUMBER_OF_STARS',
            trainerNumberOfStars:reviewsArray.length
        })
        dispatchFinalStarRating({
            type: 'SET_FINAL_STAR_RATING',
            trainerFinalStarRating: getTrainerStarRating()
        })


        navigation.navigate('StarPageStack',
             { screen: 'TrainerOrderPage'  });
    // navigation.navigate('StarPageStack',{params: ''})
    }

    //Update the covid alert var to false (will not display coivd alert anymore)
    const covidAlertCancel = () => {
        global.covidAlert = false;
        
    }


    //Show the covid information modal
    const covidAlertTap = () => {
        setCovidModalVisible(true);
    }

    return(
        <SafeAreaView style={styles.safeArea}>

            {/* Start of covid alert part */}

            <Modal
                
                animationType="slide"
                transparent={true}
                cancelable={true}
                visible={covidModalVisible}
                onRequestClose={()=>{}}
            >
                <View style={styles.covidContainer}>
                    
                    <View style={styles.covidModalContainer}>
                        <Icon
                            name="x-circle" 
                            size={Dimensions.get('window').width * .05} 
                            style={styles.covidCloseIcon} 
                            onPress={()=> {setCovidModalVisible(false)}}
                        />
                        <Text style={styles.covidTitle}>COVID-19 Information</Text>
                        <Text style={styles.covidMessage}>{"We at JustYou take care to follow the changing guidelines of the Ministry of Health regarding the coronavirus. Before ordering, the personal trainer and the client will fill out a statement that they do indeed meet the requirements of the law regarding the coronavirus. \nAs Everyone knows, the guidelines may change at any time and we will make the adujstments according to the changes to be determined by the Ministry of Health. Adherence to these requirments is for all of us for your health and safety and we will know better days"}.</Text>
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
                        infoColor ={'deepskyblue'}
                        onCancel={covidAlertCancel}
                        closeInterval = {0}
                        onTap={covidAlertTap}
                        titleNumOfLines={1}
                        messageNumOfLines={1}
                />
            </View>
            {/* End of covid alert part */}


            <View style={styles.header}>
                <Text style={styles.headerText}>Just You</Text>
            </View>
            <View style={styles.searchContainer}>
                <View
                    style={styles.searchIcon}>
                    <Icon name="search" size={Dimensions.get('window').height * .04} color="deepskyblue" />
                </View>
                
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by category"
                    onChangeText={(text) => handleOnInputChange(text)}
                />

            </View>
            <View style={styles.categoryPickerContainer}>
                <View style={styles.categorySelect}>
                    {/* <PickCategories
                        data={items}
                        onItemPress={(item) => handleOnItemPress(item)}
                    /> */}
                    <TagSelect
                        data={items}
                        ref={tagSelectRef}
                        onItemPress={(item) => handleOnItemPress(item)}
                        itemStyle={styles.item}
                        itemLabelStyle={styles.label}
                        itemStyleSelected={styles.itemSelected}
                    ></TagSelect>
                </View>
            </View>
            <View display = {displayCategories}>
                <Text style={styles.recentOrdersTitle}>{categoryTitle}</Text>
            </View>

            <View display = {displayRecentOrders}>
                <Text style={styles.recentOrdersTitle}>Recent Orders</Text>
            </View>
                       
            {isLoadingCircle?            
             <View>
                <View style={styles.progressView}>
                    <Progress.Circle size={Dimensions.get('window').height * .25} indeterminate={true} />
                </View>
                {/* <View style={styles.loadingTextView}>
                    <Text style={styles.registeringText}>Creating account...</Text>
                </View> */}
             </View>
            : 
            <View>
                {/* recent orders */}
                <View display = {displayRecentOrders}>
                    <FlatList
                            
                            data={doc}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}   
                    />
                </View>
                
                <View display = {displayCategories}>
                    <FlatList
                            data={doc}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}   
                    />
                </View>
                
                <View 
                    display={isThereAreTrainersInCategory}
                    style={styles.listIsEmptyContainer}> 
                    <Text style={styles.recentOrdersTitle}> No any Trainers in that category yet.. </Text>
                </View>
                 
                 
                

                
                {/* <View style={styles.trainerView}>
                    <View style={styles.trainerViewRow}>
                        <TouchableOpacity
                            style={styles.trainerImage}
                        >
                            <Image

                            />
                        </TouchableOpacity>
                        <View style={styles.trainerDetails}>
                            <Text style={styles.trainerDetail1}>Ivgeni no Shatz</Text>
                            <Text style={styles.trainerDetail2}>Personal Trainer</Text>
                            <View style={styles.ratingRow}>
                                <Text style={styles.trainerDetail3}>8.7 </Text>
                                <Image
                                    source={require('../../../images/ratingStar.png')}
                                    
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.trainerView}>
                    <View style={styles.trainerViewRow}>
                        <TouchableOpacity
                            style={styles.trainerImage}
                        >
                            <Image

                            />
                        </TouchableOpacity>
                        <View style={styles.trainerDetails}>
                            <Text style={styles.trainerDetail1}>Koby Lamar</Text>
                            <Text style={styles.trainerDetail2}>Personal Trainer</Text>
                            <View style={styles.ratingRow}>
                                <Text style={styles.trainerDetail3}>9.1 </Text>
                                <Image
                                    source={require('../../../images/ratingStar.png')}
                                    
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.trainerView}>
                    <View style={styles.trainerViewRow}>
                        <TouchableOpacity
                            style={styles.trainerImage}
                        >
                            <Image

                            />
                        </TouchableOpacity>
                        <View style={styles.trainerDetails}>
                            <Text style={styles.trainerDetail1}>Judi Woods</Text>
                            <Text style={styles.trainerDetail2}>Personal Trainer</Text>
                            <View style={styles.ratingRow}>
                                <Text style={styles.trainerDetail3}>7.9 </Text>
                                <Image
                                    source={require('../../../images/ratingStar.png')}
                                    
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.trainerView}>
                    <View style={styles.trainerViewRow}>
                        <TouchableOpacity
                            style={styles.trainerImage}
                        >
                            <Image

                            />
                        </TouchableOpacity>
                        <View style={styles.trainerDetails}>
                            <Text style={styles.trainerDetail1}>Omer Ohana</Text>
                            <Text style={styles.trainerDetail2}>Personal Trainer</Text>
                            <View style={styles.ratingRow}>
                                <Text style={styles.trainerDetail3}>8.0 </Text>
                                <Image
                                    source={require('../../../images/ratingStar.png')}
                                    
                                />
                            </View>
                        </View>
                    </View> 
                 </View> */}
            </View>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'white',
        height: Dimensions.get('window').height,
    },
    container: {
        backgroundColor: 'white',
        width: Dimensions.get('window').width,
    },
    header: {
        alignSelf: 'center'
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    categoryPickerContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    categorySelect: {
        width: Dimensions.get('window').width * .9,
        marginTop: 30
    },
    searchContainer: {
        flexDirection: 'row',
        height: Dimensions.get('window').height * .065,
        width: Dimensions.get('window').width * .9,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: 'lightgrey',
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 30
    },
    searchIcon: {
        height: Dimensions.get('window').height * .035,
        width: Dimensions.get('window').height * .035,
        alignSelf: 'center',
        marginLeft: 10
    },
    searchInput: {
        marginLeft: 30,
        fontSize: 20,
        alignSelf: 'center'
    },
    item: {
        borderWidth: 1,
        borderColor: 'deepskyblue',    
        backgroundColor: '#FFF'
    },
    label: {
        color: '#333',
        fontWeight: 'bold'
    },
    itemSelected: {
        backgroundColor: 'deepskyblue',
    },
    recentOrdersTitle: {
        marginLeft: 15,
        marginTop: 30,
        fontWeight: 'bold',
        fontSize: 20
    },
    trainerView: {
        width: Dimensions.get('window').width,
        marginLeft: 15,
        marginTop: 20
    },
    trainerViewRow: {
        flexDirection: 'row',
    },
    trainerImage: {
        height: Dimensions.get('window').height * .1,
        width: Dimensions.get('window').height * .1,
        borderRadius: 15,
        backgroundColor: 'gainsboro'
    },
    trainerDetails: {
        justifyContent: 'center',
        marginLeft: 20
    },
    trainerDetail1: {
        fontWeight: 'bold',
        fontSize: 23
    },
    trainerDetail2: {
        fontSize: 18
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    trainerDetail3: {
        fontSize: 18
    },
    ratingIcon: {

    },
    progressView: {
        alignSelf: 'center'
    },
    covidAlertView: {
        zIndex: 2,
        opacity: 0.9
    },
    covidAlertContainer: {
        backgroundColor: 'deepskyblue',
    },
    covidContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    covidModalContainer: {
        backgroundColor: "white",
        height: Dimensions.get('window').height * .45,
        width: Dimensions.get('window').width * .9,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    covidTitle: {
        marginTop: Dimensions.get('window').height * .01,
        alignSelf: 'center',
        fontSize: Dimensions.get('window').height * .0278,
        fontWeight: 'bold'
    },
    covidMessage: {
        flex: 1,
        marginTop: Dimensions.get('window').height * .013,
        alignSelf: 'center',
        marginLeft: Dimensions.get('window').width * .020,
        fontSize: Dimensions.get('window').height * .02,
    },
    covidCloseIcon: {
        marginTop: Dimensions.get('window').height * .015,
        marginRight: Dimensions.get('window').width * .015,
        alignSelf: 'flex-end',
    },
});

export default SearchPage;