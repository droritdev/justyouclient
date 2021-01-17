import React, {useState, useReducer, useContext} from 'react';
import { Button, Text, View, StyleSheet, ScrollView, Dimensions, Image , FlatList} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';


import {CategoryContext} from '../../../context/CategoryContext';





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
    { id: 10, label: 'POWERLIFTING' },
    { id: 11, label: 'STREET' }

];

//The claint's search page
const SearchPage = ({navigation}) => {

    const forceUpdate = useReducer(bool => !bool)[1];//Page refresh 

    const {category, dispatchCategory} = useContext(CategoryContext)


    const [selectedItems, setSelectedItems] = useState([]);
    // const [clientID, setClientID] = useState("");
    const [items, setItems] = useState(categoriesData);
    const [doc, setDoc] = useState();
    const [recentOrders, setRecentOrders] = useState([]);
    var recentTrainerArray = []
    const [reviewsArray,setReviewsArray] = useState([]);

    var trainersByCategory = []
    const [categoryTitle, setCategoryTitle] = useState('');
    const [isCategoryMode, setIsCategoryMode] = useState(false);
    const [displayCategories, setDisplayCategories] = useState('none');
    const [displayRecentOrders, setDisplayRecentOrders] = useState('none');


    const [isLoadingCircle, setIsLoadingCircle] = useState(true);





    // React.useEffect(() => {
    //     getClientFromMongoDB();
    //     console.log('🚨click')

    //     // getTrainersByCategory();
        
    // },[]);


    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getClientFromMongoDB();
            if(category != ''){
                setIsCategoryMode(true);
                setCategoryTitle(category);
                setDisplayCategories('flex');
                setDisplayRecentOrders('none');
                console.log('category')
                console.log(category)
            }
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
    
    const getClientFromMongoDB = () => {
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
                        // setClientID(clientID);
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
    
                setRecentOrders(allOrders);
                console.log(allOrders[0].trainer.id)
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
        
        //limit recent order to 5
        var limit = 5
        if (allOrders.length < limit){
            limit = allOrders.length
        }
        for (let index = 0; index < limit; index++) {
            const trainerID = allOrders[index].trainer.id;
            console.log(trainerID);
            getTrainerFromMongoDB(trainerID);
        }
        setDoc(recentTrainerArray);
        forceUpdate();
        if(doc){
            setIsLoadingCircle(false);
            forceUpdate();

        }
        
    }

    const getTrainerFromMongoDB = (trainerID) => {
        axios
                        .get('/trainers/id/'
                        +trainerID,
                        config
                    )
                    .then((doc) => {
                        if(doc) {
                            console.log(doc.data)
                            recentTrainerArray.push(doc.data);
                            setIsLoadingCircle(false);

                            forceUpdate();

                        }
                      })
                    .catch((err) => console.log(err));
    }

    const getTrainerStarRating = () => {
        var starsCounter = 0
        var finalStarRating = 0
        for (let index = 0; index < reviewsArray.length; index++) {
            const element = reviewsArray[index];
            starsCounter += Number(element.stars)

        }

        finalStarRating = (starsCounter/(reviewsArray.length)).toFixed(1);
        return finalStarRating;
    }

   

    const renderItem = ({ item }) => (
        <Item 
        name = {`${item.name.first} ${item.name.last}`}
        media = {item.media.images[0]}
        trainerObject = {item}        
        {...setReviewsArray(item.reviews)}
        {...console.log(`${item.name.first} ${item.name.last}`)}
        ></Item>
      );

      const Item = ({ trainerObject, name,media }) => (

        <View style={styles.trainerView}>
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
    </View>
        
      )

    const getAllTrainers = async () => {
        setIsRefreshing(true);
        
        await axios  
            .get('/trainers/getAllTrainers',
            config)
            .then((doc) => {

                if(doc) {
                    // setDoc(doc.data);
                    setIsRefreshing(false);
                    // sortByCategory(doc.data);


                }
            })
            .catch((err) =>  {
            });
    }

    //get trainer by category by navigation from star page
    const getTrainersByCategory = (trainersArray, category) => {
        setCategoryTitle(category)

        for (let index = 0; index < trainersArray.length; index++) {
            const trainer = trainersArray[index];
            if(trainer.categories.includes(category)){
                trainersByCategory.push(element);
            }
            
        }
    }

    //When the user chooses category it whill be displayed on the input bellow
    const handleOnItemPress = (item) => {
        if(selectedItems.includes(item.label)){
            let index = selectedItems.indexOf(item.label);
            selectedItems.splice(index, 1);
            setSelectedItems(selectedItems.filter(element => element !== item.label));
        }
        else{
            setSelectedItems(selectedItems => [...selectedItems, item.label]);
        }
    }

    const handleOnInputChange = (text) => {
        if(text.length > 0){
            setItems(items.filter(item => item.label.toLowerCase().includes(text.toLowerCase())));
        }
        else{
            setItems(categoriesData);
        }
    }

    return(
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Just You</Text>
            </View>
            <View style={styles.searchContainer}>
                <View
                    style={styles.searchIcon}>
                    <Icon name="search" size={Dimensions.get('window').height * .04} color="deepskyblue" />
                </View>
                {/* <Image
                    source={require('../../../images/searchFieldIcon.png')}
                    style={styles.searchIcon}
                /> */}
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by category"
                    onChangeText={(text) => handleOnInputChange(text)}
                />

            </View>
            <View style={styles.categoryPickerContainer}>
                <View style={styles.categorySelect}>
                    <PickCategories
                        data={items}
                        onItemPress={(item) => handleOnItemPress(item)}
                    />
                </View>
            </View>
            {isCategoryMode?
                <Text style={styles.recentOrdersTitle}>{categoryTitle}</Text>
            :            
                <Text style={styles.recentOrdersTitle}>Recent Orders</Text>
            }
            <Text style={styles.recentOrdersTitle}>Recent Orders</Text>
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
            <ScrollView>
                <View display = {'flex'}>
                    <FlatList
                            vertical
                            data={doc}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}   
                    />
                </View>
                <View display = {'none'}>
                    <FlatList
                            vertical
                            data={doc}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}   
                    />
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
                </View>
            </ScrollView>
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
});

export default SearchPage;