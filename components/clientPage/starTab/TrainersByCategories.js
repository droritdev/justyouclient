import React, {useState, useReducer, useContext} from 'react';
import { Button, Text, View, StyleSheet, ScrollView, Dimensions, Image , FlatList} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';

import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';

import {CategoryContext} from '../../../context/CategoryContext';
import {TrainerContext} from '../../../context/TrainerContext';



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

//The client's search page
const TrainersByCategories = ({navigation, route}) => {
    const { dispatchTrainerObject,
                dispatchTrainerNumberOfStarComments,
                    dispatchFinalStarRating,
    } = useContext(TrainerContext);
    const { categoryFromStarPage } = route.params;

    const forceUpdate = useReducer(bool => !bool)[1];//Page refresh 

    const {category, dispatchCategory} = useContext(CategoryContext)
    const [doc, setDoc] = useState([]);

    var recentTrainerArray = [];
    var reviewsArray = [];
    var trainersByCategory = [];

    const [nameForImage, setnameForImage] = useState("");
    const {imageSource} = ''

    const [isLoadingCircle, setIsLoadingCircle] = useState(true);
    const [isTrainersAvailable, setIsTrainersAvailable] = useState(true);

    const config = {
        withCredentials: true,
        baseURL: 'http://localhost:3000/',
        headers: {
              "Content-Type": "application/json",
        },
    };

    // React.useEffect(() => {
    //     console.log(categoryFromStarPage);
    //         getAllTrainers(categoryFromStarPage);
        
    // },[]);

     React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            console.log(categoryFromStarPage);
            var imageName = categoryFromStarPage.toString();
            setnameForImage(switchImages(imageName.replace(" ",'')));

            getAllTrainers(categoryFromStarPage);
            
        });
        return unsubscribe;
      }, [navigation]);

      const switchImages = (category) => {
        switch(category) {
            case 'CLIMBING':
                return (require('../../../images/categoriesImages/CLIMBING.jpg'));
            case 'DANCING':
                return (require('../../../images/categoriesImages/DANCING.jpg'));
            case 'HIT':
                return (require('../../../images/categoriesImages/HIT.jpg'));     
            case 'KICKBOX':
                return (require('../../../images/categoriesImages/KICKBOX.jpg'));         
            case 'MARTIALARTS':
                return (require('../../../images/categoriesImages/MARTIALARTS.jpg'));  
            case 'PILATES':
                return (require('../../../images/categoriesImages/PILATES.jpg'));  
            case 'POWERLIFTING':
                return (require('../../../images/categoriesImages/POWERLIFTING.jpg'));
            case 'RUNNING':
                return (require('../../../images/categoriesImages/RUNNING.jpg'));   
            case 'STREETWORKOUT':
                return require('../../../images/categoriesImages/STREETWORKOUT.jpg');     
            case 'SWIMMING':
                return (require('../../../images/categoriesImages/SWIMMING.jpg'));                                
            case 'TRX':
                return (require('../../../images/categoriesImages/TRX.jpg'));
            
        }
      }


      const getAllTrainers = (category) => {
        
         axios  
           .get('/trainers/allTrainer',
           config)
           .then((doc) => {

               if(doc) {
                //    setDoc(doc.data);
                   // sortByCategory(doc.data);
                   getTrainersByCategory(doc.data, category);
                //    setDisplayCategories('flex');
                //    setDisplayRecentOrders('none');


               }
           })
           .catch((err) =>  {
               console.log(err)
           });
   }

   //get trainer by category by navigation from star page
   const getTrainersByCategory = (trainersArray, category) => {
        // setCategoryTitle(category)

        for (let index = 0; index < trainersArray.length; index++) {
            const trainer = trainersArray[index];
            if(trainer.categories.includes(category)){
                trainersByCategory.push(trainer);
                console.log(trainer);
                console.log('trainersByCategory ' + trainersByCategory);
                console.log(trainersByCategory);
            }
            setDoc(trainersByCategory);
            setIsLoadingCircle(false);
            if(trainersByCategory.length <= 0){
                setIsTrainersAvailable(false)
            }else{
                setIsTrainersAvailable(true)
 
            }
        }
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
        {...reviewsArray = (item.reviews)}
        {...console.log(`${item.name.first} ${item.name.last}`)}
        ></Item>
      );

      const Item = ({ trainerObject, name,media }) => (

        <View style={styles.trainerView}>
            <TouchableOpacity
                            onPress={() => handleOnTrainerPressed(trainerObject )}
                            >
                <View style={styles.trainerViewRow}>
                    <TouchableOpacity
                        onPress={() => handleOnTrainerPressed(trainerObject )}
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

    const handleArrowButton = () => {
        navigation.navigate('StarPage');
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
    

        navigation.navigate('TrainerOrderPage',{params: ''})
    }
    

    return(
        
        <SafeAreaView style={styles.safeArea}>
            
            <View style={styles.arrowAndHeaderContainer}>
                    <ArrowBackButton
                     onPress={handleArrowButton}
                    />
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Just You</Text>
                    </View>
                </View>
                <View style = {styles.imageContainer}
>

                    <Image
                            style = {styles.categoryImage}
                            // source = {require('../../../images/categoriesImages/'+'HIT'+'.jpg')}
                            source = {nameForImage}
                            
                        />
                </View>
            
            <View>
                <Text style={styles.recentOrdersTitle}>{categoryFromStarPage}</Text>
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
               {isTrainersAvailable? 
                    <View display = {'flex'}>
                        <FlatList
                                data={doc}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}   
                        />
                    </View>
                :
                    <View>
                        <Text style={styles.recentOrdersTitle}>{'No Any Trainers in that category yet..'}</Text>
                    </View>
                }
                
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
    arrowAndHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: Dimensions.get('window').width * .95,
        height: Dimensions.get('window').width * - .15,
        width: Dimensions.get('screen').width,
        marginLeft: Dimensions.get('window').width * -0.155
    },
    headerText: {
        fontSize: Dimensions.get('window').height * .04,
        fontWeight: 'bold'
    },
    imageContainer:{
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        
        elevation: 7,
    },

    categoryImage :{
        alignSelf: 'center',
        marginTop: Dimensions.get('window').height * .05,
        width: Dimensions.get('window').width * 1,
        height: Dimensions.get('window').height *  .15,
        
        // borderRadius: 17,
    },
    
    
    
    recentOrdersTitle: {
        alignSelf: 'center',
        // marginLeft: Dimensions.get('window').width * .02,
        marginTop: Dimensions.get('window').height * .03,
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .03
    },
    trainerView: {
        width: Dimensions.get('window').width,
        marginLeft: Dimensions.get('window').height * .03,
        marginTop: Dimensions.get('window').height * .03,
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
        marginLeft: Dimensions.get('window').width * .03,
    },
    trainerDetail1: {
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .025,
    },
    trainerDetail2: {
        fontSize: Dimensions.get('window').height * .02,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    trainerDetail3: {
        fontSize: Dimensions.get('window').height * .02
    },
    
    progressView: {
        marginTop : Dimensions.get('window').height * .1,
        alignSelf: 'center'
    },
});

export default TrainersByCategories;