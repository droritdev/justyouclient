import React, {useContext, useState, useEffect} from 'react';
import { Text, View, SafeAreaView, Image, StyleSheet, Dimensions, TextInput, Button,FlatList} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Dialog from "react-native-dialog";
import {Accordion, Block, Radio} from 'galio-framework';
import FastImage from 'react-native-fast-image'
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';


import Geocoder from 'react-native-geocoding';
import axios from 'axios';




import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';
import {TrainerContext} from '../../../context/TrainerContext';
import {ClientContext} from '../../../context/ClientContext';
import {OrderContext} from '../../../context/OrderContext';

var API_KEY = 'AIzaSyAKKYEMdjG_Xc6ZuvyzxHBi1raltggDA2c'; // TODO: move api key to .env
Geocoder.init(API_KEY); // use a valid API key



//The question and answers page
const TrainerOrderPage = ({navigation}) => {

    const [dialogVisible, setDialogVisible] = useState(false);
    const [isSelected, setSelection] = useState(false);
    const [isOutdoorTraining,setIsOutdoorTraining] = useState("none");
    const [isAtTrainerTraining,setIsAtTrainerTraining] = useState("none");
    const [listData, setListData] = useState({});
    const [inputText, setInputText] = useState("");
    const [isAddressSelected,setIsAddressSelected] = useState("none");
    const [isSearchingForLocation,setIsSearchingForLocation] = useState("none");

    const [categorySelected, setCategorySelected] = useState("");
    const [typeOfTrainingSelected, setTypeOfTrainingSelected] = useState("");
    const [trainingSiteSelected, setTrainingSiteSelected] = useState("");
    const [locationCoordinates, setLocationCoordinates] = useState("");
    const [dateAndTimeSelected, setDateAndTimeSelected] = useState("");

    


    const {
        trainerFirstName , dispatchTrainerFirst,
            trainerMediaPictures, dispatchTrainerMediaPictures,
                trainerNumberOfStars,dispatchTrainerNumberOfStars,
                    trainerNumberOfStarComments, dispatchTrainerNumberOfStarComments,
                        trainerCategories, dispatchTrainerCategories,
                            trainerObject, dispatchTrainerObject}
         = useContext(TrainerContext);

    // const {clientObject} = useContext(ClientContext);


    const config = {
        withCredentials: true,
        baseURL: 'http://localhost:3000/',
        headers: {
              "Content-Type": "application/json",
        },
    };

    const starRating = (trainerNumberOfStars/trainerNumberOfStarComments).toFixed(1);
    const cleanedPrice = typeOfTrainingSelected.replace(/[^0-9]/g,'');

    const prices = trainerObject.prices   
    
    const locations = trainerObject.location

    const orderObject = [
        { 
            client: {
                id: 'a',
                firstName: 'a',
                lastName: 'a'
            },
            trainer:{
                id: trainerObject._id,
                firstName: trainerObject.name.first,
                lastName: trainerObject.name.last  
            },
            type: 'a', 
            category: categorySelected, 
            trainingDate: 'a', 
            cost: cleanedPrice,
            status: 'a',
            location: {
                address: 'a',
                latitude:'a',
                longitude:'a'
            }

    }

    ]

    const Item = ({ title }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{title}</Text>
        </View>
      );

    const renderItem = ({ item }) => (
        <Item title={item.title} />
      );

    // const PickerItems =  trainerCategories.map(i => {
    //         return  {value={i}, label={i}}
    //     });

    const pickerItems = []
    // trainerCategories.map(i => {
    //             pickerItems.push({
    //                 value: i,
    //                 label: i
    //             })
    //         });   
    // const PickerItemsaaa = trainerCategories.array.forEach(element => {
    //     return value = {element}, label = {element}
    // });


    

    // items = {[...trainerCategories.map(i => {
    //     return <DropDownPicker.Item value={i} label={i}> </DropDownPicker.Item>
    // })]}

    const searchLocation = async (text) =>{
        setInputText(text);
        if (!text.trim()){
            setIsAddressSelected('none');
            // setIsSearchingForLocation('none');
        }else{
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
    }


    const registerOrder = () => {
        
        axios
            .post('/clients/orders/book-order', {



                client: {
                    id: "b", 
                    firstName: "b",
                    lastName: "cc'"
                },
                trainer: {
                    id: 'b', 
                    firstName: 'a', 
                    lastName: 'a'
                }, 
                type: 'type', 
                category: 'a', 
                trainingDate: 'a', 
                cost: 12,
                status: 'a',
                location: {
                    address: 'a',
                    latitude:9,
                    longitude:2
                },



                // client: {
                //     id: req.body.client.id, 
                //     first_name: req.body.client.firstName, 
                //     last_name: req.body.client.lastName
                // }, 
                // trainer: {
                //     id: req.body.trainer.id, 
                //     first_name: req.body.trainer.firstName, 
                //     last_name: req.body.trainer.lastName
                // }, 
                // type: req.body.type, 
                // category: req.body.category, 
                // trainingDate: req.body.trainingDate, 
                // cost: req.body.cost,
                // status: req.body.status,
                // location: {
                //     address: req.body.location.address,
                //     latitude:req.body.location.latitude,
                //     longitude:req.body.location.longitude
                // },
            },
            config
            )
            .then((res) => {
            })
            .catch((err) => console.log(err));
    }


    const registerClient = () => {
        // navigation.navigate('WelcomeUser');
        axios
            .post('/clients/register', {
                name: {
                    first: "firstName",
                    last: "lastName"
                },
                birthday: "birthday",
                email: "emailAddress",
                password: "password",
                country: "country",
                image: "imageUrl",
                phone: {
                    areaCode: 123, 
                    phoneNumber: 123
                },
                location: {
                    type: 'Point',
                    coordinates: [32.123602, 34.875223]
                }
            },
            config
            )
            .then((res) => {
            })
            .catch((err) => alert(err.data));
    }


    //Handle when the user presses the yes button in the dialog
    const handleYesDialog = () => {
        setDialogVisible(false);
        navigation.navigate('StarPage');
    };

    //Handle when the user presses the no button in the dialog
    const handleNoDialog = () => {
        setDialogVisible(false);
    };

    //Navigates back to the profile page
    const handleOnArrowPress = () => {
    }

    const handleArrowButton = () => {
        setDialogVisible(true);
    }

    const handleOnCategoryPressed = (item) => {
        setCategorySelected(item.label)
        // registerOrder();
        // console.log(clientObject);
        // // registerClient();
        // makeBamba();
    }

    const handleOnTrainingTypePressed = (item) => {
        // navigation.navigate('ComingSoon');
        setTypeOfTrainingSelected(item.label);
        const atTrainer = 'at Trainer'
        const outdoor = 'outdoor'
        const itemLabel = new String(item.label)
        if(itemLabel.includes(outdoor)){
            setIsOutdoorTraining('flex');
            setIsAtTrainerTraining('none');
             // console.log('Life Is Good');
        }else {
            setIsOutdoorTraining('none');
            setIsAtTrainerTraining('flex');
        }
        // console.log(item.label);
    }

    const handleSearchBoxPressed = (item) => {
        setListData({});
        setInputText(item);
        setTrainingSiteSelected(item);
        setIsAddressSelected('flex');
        // setIsSearchingForLocation("none")

        Geocoder.from(item)
        .then(json => {
            var location = json.results[0].geometry.location;
            setLocationCoordinates([location.lat, location.lng]);
            // console.log(locationCoordinates);
        })
        .catch(error => console.warn(error));
    }
    

    const handleTrainingSiteSelected = (item) => {

    }

    const handleChooseDateAndTime = () => {
        dispatchTrainerObject({
            type: 'SET_TRAINER_OBJECT',
            trainerObject: trainerObject
        })
        navigation.navigate('ChooseDateAndTimePage');

    }

    //Handle when the client presses on Discount Code button
    const handleOnReviewsPressed = () => {

        console.log(trainerObject);
        // navigation.navigate('ComingSoon');
    }

    //Handle when the client presses on Customer Service button
    const handleOnChatPressed = () => {
    }

    //Handle when the client presses on gift card purchase button
    const handleOnCallPressed = () => {
        // navigation.navigate('ComingSoon');
    }  


    return(
        <SafeAreaView style={styles.safeArea}>
           
            <ScrollView style={styles.container} >
                <View style={styles.arrowAndHeaderContainer}>
                    <ArrowBackButton
                     onPress={handleArrowButton}
                    />
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Just You</Text>
                    </View>
                </View>
                    
                     <View style={styles.imageAndDetailsContainer}>
                        <View style={styles.trainerImageViewContainer}>
                            <FastImage
                            style={styles.trainerImageView}
                            source={{
                                uri: trainerMediaPictures.images[0],
                                priority: FastImage.priority.normal,
                                    }}
                            resizeMode={FastImage.resizeMode.stretch}
                                />
                            </View>
                        <View style={styles.trainerDetailsContainer} >
                            <Text style={styles.trainerNameTitle}> {trainerFirstName}</Text>


                            <View style={styles.trainerStarRatingContainer}>
                                    {trainerNumberOfStarComments === 0 ? 
                                    <Text style={styles.trainerStarRating}>no comments</Text> 
                                    :
                                    <Text style={styles.trainerStarRating}>{starRating}</Text>} 

                                    {trainerNumberOfStarComments === 0 ? 
                                    <Image 
                                        // source={require('../../../images/ratingStar.png')}
                                        style={styles.starIcon}/> 
                                        : 
                                        <Icon name="star" size={Dimensions.get('window').height * .02} color="black" />
                                    }
                                        
                                    
                                </View>
                            {/* <Text style={styles.categoryAndCertificationText}> Category: {trainerCategories.join(", ")} </Text> */}
                            <Text style={styles.categoryAndCertificationText}> Certifications: NSCA-CSCS </Text>

                        </View>

                     </View>

                     <View style={styles.categorySelectContainer}> 
                        <Text style={styles.pageMainTitles}> Category</Text>


                        <DropDownPicker 
                                        // items={[
                                            
                                        //     {label: 'USA', value: 'usa', icon: () => <Icon name="flag" size={18} color="#900" />, hidden: true},
                                        //     {label: 'UK', value: 'uk', icon: () => <Icon name="flag" size={18} color="#900" />},
                                        //     {label: 'France', value: 'france', icon: () => <Icon name="flag" size={18} color="#900" />},
                                        // ]}
                                        // items = {pickerItems}
                                        {...trainerCategories.map(i => {
                                            pickerItems.push({
                                                value: i,
                                                label: i,
                                                icon: () => <Icon name="arrow-right" size={Dimensions.get('window').height * .02} color="#00bfff" />,
                                            })
                                        }) } 
                                        items = {pickerItems} 

                                        // items = {PickerItems}
                                        // {...trainerCategories.map(i =>{
                                        //     return <DropDownPicker.Item value={i} label={i}> </DropDownPicker.Item>
                                        // })}

                                        // items = {[...trainerCategories.map(i => {
                                        //     return <DropDownPicker.Item value={i} label={i}> </DropDownPicker.Item>
                                        // })]}
                                        defaultValue={""}
                                        containerStyle={styles.innerContainerViewObject}
                                        style={styles.dropBoxA}
                                        itemStyle={{
                                            justifyContent: 'flex-start'
                                        }}
                                        dropDownStyle={{backgroundColor: '#fafafa'}}
                                        onChangeItem=
                                        {item => handleOnCategoryPressed(item)
                                            
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
                                            {label: 'Single at Trainer: $'+prices.single.singleAtTrainer+'/h' , value: prices.single.singleAtTrainer, icon: () => <Icon name="user" size={Dimensions.get('window').height * .02} color="#00bfff" />, hidden: true},
                                            {label: 'Single outdoor: $'+prices.single.singleOutdoor+'/h' , value: prices.single.singleOutdoor , icon: () => <Icon name="user" size={Dimensions.get('window').height * .02} color="#00bfff" />},
                                            {label: 'Couple at Trainer: $'+prices.couple.coupleAtTrainer+'/h'  , value: prices.couple.coupleAtTrainer, icon: () => <Icon name="users" size={Dimensions.get('window').height * .02} color="#00bfff" />},
                                            {label: 'Couple outdoor: $'+prices.couple.coupleOutdoor+'/h'  , value: prices.couple.coupleOutdoor, icon: () => <Icon name="users" size={Dimensions.get('window').height * .02} color="#00bfff" />},
                                        ]}
                                        defaultValue={""}
                                        containerStyle={styles.innerContainerViewObject}
                                        style={styles.dropBoxB}
                                        itemStyle={{
                                            justifyContent: 'flex-start'
                                        }}
                                        dropDownStyle={{backgroundColor: '#fafafa'}}
                                        onChangeItem={item => handleOnTrainingTypePressed(item)
                                            
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
                                <Icon name="map-pin" size={Dimensions.get('window').height * .02} color="#00bfff" style={styles.iconTextInput} />  
                            </View>          
                            <TextInput
                                    style={styles.textStyle}
                                    placeholder={'Search your address'}
                                    placeholderTextColor={'grey'}
                                    onChangeText={(text)=>searchLocation(text)}
                                    value={inputText}
                                />
                            </View>
                            {/* <View display={isSearchingForLocation}> */}
                            <FlatList
                                    data={listData}
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
                                />

                            {/* </View> */}
                        </View>
                        <View display={isAtTrainerTraining}>
                        <DropDownPicker
                                        items={[
                                            {label: locations.trainingSite1.address, value: 'usa', icon: () => <Icon name="map-pin" size={Dimensions.get('window').height * .02} color="#00bfff" />, hidden: true},
                                            {label: locations.trainingSite2.address, value: 'uk', icon: () => <Icon name="map-pin" size={Dimensions.get('window').height * .02} color="#00bfff" />},
                                            
                                        ]}
                                        defaultValue={""}
                                        containerStyle={styles.innerContainerViewObject}
                                        style={styles.dropBoxC}
                                        itemStyle={{
                                            justifyContent: 'flex-start'
                                        }}
                                        dropDownStyle={{backgroundColor: '#fafafa'}}
                                        onChangeItem={item => setTrainingSiteSelected(item.label)}
                                    />
                        </View>

                        
                
                    </View> 

                    <View style={styles.optionsSelectContainer}>
                        <Text style={styles.pageSubTitles}>Date</Text>
                        <View>
                        <TouchableOpacity
                            style={styles.chooseDateButton}
                            onPress={() => handleChooseDateAndTime()}
                        >
                            <Text style={styles.chooseDateText}>Choose date and time</Text>
                        </TouchableOpacity>
                        </View>
                        
                        
                    </View>  

                     <View style={styles.optionsSelectContainer}>
                         
                        <Text style={styles.pageSubTitles}>Cost</Text>
                         <View style={styles.rowCostContainer}>
                             <Icon name="dollar-sign" size={Dimensions.get('window').height * .02} color="black" 
                             style={styles.dollarSign}> </Icon>
                            {/* <Image 
                                source={require('../../../images/dollarSign.jpeg')}
                                style={styles.dollarSign}>
                                
                            </Image> */}
                            <TextInput 
                                
                                editable ={false} 
                                style={styles.costTextBox}>
                            {cleanedPrice}</TextInput>
                         </View>
                     </View>      

                <View style={styles.moreContainer}>
                    <Text style={styles.moreTitle}>More Links</Text>
                    <View style={styles.rowsContainer}></View>
                        <View style={styles.eachRowContainer}>
                            <View style={styles.navigationsRows}>
                                <TouchableOpacity
                                    onPress={() => handleOnReviewsPressed()}
                                >
                                    <Text style={styles.navigationsRowsTitle}>Reviews</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.discountCodeButton}
                                    onPress={() => handleOnReviewsPressed()}
                                >
                                    <Image
                                        source={require('../../../images/arrowButton.png')}
                                        style={styles.arrowImage}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    <View style={styles.eachRowContainer}>
                        <View style={styles.navigationsRows}>
                            <TouchableOpacity
                                onPress={() => handleOnChatPressed()}
                            >
                                <Text style={styles.navigationsRowsTitle}>Customer Service</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.arrowButton}
                                onPress={() => handleOnChatPressed()}
                            >
                                <Image
                                    source={require('../../../images/arrowButton.png')}
                                    style={styles.arrowImage}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.eachRowContainer}>
                        <View style={styles.navigationsRows}>
                            <TouchableOpacity
                                onPress={() => handleOnCallPressed()}
                            >
                                <Text style={styles.navigationsRowsTitle}>Call</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.arrowButton}
                                onPress={() => handleOnCallPressed()}
                            >
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
                    <Dialog.Button style={styles.cancelDialog} label="Cancel" onPress={(() => handleNoDialog())} />
                    <Dialog.Button style={styles.sureDialog} label="Sure" onPress={() => handleYesDialog()} />

                </Dialog.Container>
            </View>
{/*             
            <View style={styles.trainerHeaderContainer}>
                <View style={styles.trainerHeaderRow}>
                    <View style={styles.imageAndAbout}>
                        <Image
                            style={styles.trainerProfileImage}
                        />
                        <TouchableOpacity
                            style={styles.aboutMeButton}
                        >
                            <Text style={styles.aboutMeText}>About Me</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.nameRatingCategoryCertifications}>
                        <Text style={styles.trainerName}>Ivgeny Shatz</Text>
                        <View style={styles.ratingRow}>
                            <Text style={styles.ratingNumber}>8.7</Text>
                            <Image
                                style={styles.ratingImageStar}
                                source={require('../../../images/ratingStar.png')}
                            />
                        </View>
                        <View style={styles.categoryRow}>
                            <Text style={styles.categoryTitle}>Category: </Text>
                            <Text style={styles.categoryText}>Yoga, Pilatis</Text>
                        </View>
                        <View style={styles.certificationsRow}>
                            <Text style={styles.certificationsTitle}>Certifications: </Text>
                            <Text style={styles.certificationsText}>NSCA-CSCS</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.likeHeartButton}
                    >
                        <Image
                            style={styles.likeHeartImage}
                        />
                    </TouchableOpacity>
                </View>
            </View> */}
        </SafeAreaView>
    )
}   

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'white',
        flex: 1
    },
    container: {
        backgroundColor: 'white',
        width: Dimensions.get('window').width,
        // overflow: 'visible',
        // height: Dimensions.get('window').height
    },
    header: {
        alignSelf: 'center'
    },
    headerText: {
        fontSize: Dimensions.get('window').height * .04,
        fontWeight: 'bold'
    },
    arrowAndHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: Dimensions.get('window').width * .95,
        height: Dimensions.get('window').width * - .15,
        width: Dimensions.get('screen').width,
        marginLeft: Dimensions.get('window').width * -0.155
    },
    imageAndDetailsContainer:{
        flexDirection: 'row',
        marginTop: Dimensions.get('window').height * 0.03,

    },
    trainerImageViewContainer:{
        borderRadius: 16,
        backgroundColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2.5,
        elevation: 3 
    },
    trainerImageView: {
        width: Dimensions.get('window').width * .200,
        height: Dimensions.get('window').height * .095,
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
        shadowRadius: 16.00,

        elevation: 5,
    },
    trainerDetailsContainer:{
        marginLeft: Dimensions.get('window').height * 0.03,
        flexDirection: 'column',
    },
    trainerNameTitle:{
        fontSize: Dimensions.get('window').height * .025,
        fontWeight: 'bold'
    },
    trainerStarRatingContainer:{
        flexDirection: 'row',
        // justifyContent: 'space-between',
        marginTop: Dimensions.get('window').height * .020,

    },
    trainerStarRating:{
        fontSize: Dimensions.get('window').height * .015,
    },

    trainerCategoryAndCertification:{

    },
    categoryAndCertificationText:{

    },
    optionsSelectContainer:{
        marginTop: Dimensions.get('window').height * .020,
        marginLeft: Dimensions.get('window').width * .040,
        marginRight: Dimensions.get('window').width * .040,
    },
    categorySelectContainer:{
        marginTop: Dimensions.get('window').height * .020,
        marginLeft: Dimensions.get('window').width * .040,
        marginRight: Dimensions.get('window').width * .040,
        zIndex: 10,

    },
    typeOfTrainingSelectContainer:{
        marginTop: Dimensions.get('window').height * .020,
        marginLeft: Dimensions.get('window').width * .040,
        marginRight: Dimensions.get('window').width * .040,
        zIndex: 9,
    },
    trainingSiteSelectContainer:{
        marginTop: Dimensions.get('window').height * .020,
        marginLeft: Dimensions.get('window').width * .040,
        marginRight: Dimensions.get('window').width * .040,
        zIndex: 8,

    },
    searchResultsContainer: {
        width: Dimensions.get('window').width * 0.915,
        alignSelf: 'center',
        backgroundColor: '#fafafa',
        borderWidth:1,
        borderRadius:5,
        borderColor:'gainsboro',
        opacity: 0.8,
        zIndex: 1,
        shadowColor: "black",
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
    textInputContainer:{
        marginTop: Dimensions.get('window').height * .01,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center' ,
        borderWidth:1,
        borderRadius:5,
        borderColor:'gainsboro',
        backgroundColor: '#fafafa',
        height: Dimensions.get('window').height * .045,

    },
    textStyle: {
        
        height: Dimensions.get('window').height * .045,
        flex: 1,
        paddingLeft: Dimensions.get('window').width * .03,
        // marginTop: Dimensions.get('window').height * .01,
        fontSize: Dimensions.get('window').height * .02,
    },
    iconTextInput:{
        marginLeft:Dimensions.get('window').width * .025,
        // marginTop: Dimensions.get('window').height * .01,
    },
    itemText: {
        fontSize: Dimensions.get('window').height * .02,
    },



    pageMainTitles:{
        fontSize: Dimensions.get('window').height * .020,
        fontWeight: 'bold',
    },
    pageSubTitles:{
        fontSize: Dimensions.get('window').height * .017,
        fontWeight: 'bold',
    },
    innerContainerViewObject:{
        marginTop: Dimensions.get('window').height * .005,
        height: Dimensions.get('window').height * .045,
    },
    dropBoxA:{
        backgroundColor: '#fafafa',
        zIndex:10
    },
    dropBoxB:{
        backgroundColor: '#fafafa',
        zIndex:9
    },
    dropBoxC:{
        backgroundColor: '#fafafa',
        zIndex:8
    },

    trainingSiteContainer:{},
    trainingSiteContainerTitle:{},
    trainingSiteDropDownContainer:{},
    trainingSiteRowContainer:{},
    trainingSiteCheckBox:{},

    chooseDateButton: {
        marginTop: Dimensions.get('window').height * .005,
        width: Dimensions.get('window').width * .9,
        height: Dimensions.get('window').height * .04,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'deepskyblue',
        borderRadius: 20
    },
    chooseDateText: {
        fontSize: Dimensions.get('window').height * .020,
        fontWeight: 'bold',
        color: 'white'
    },
    rowCostContainer:{
    flexDirection: 'row',
    marginLeft: Dimensions.get('window').width * .03,
    },
    costTextBox:{
    marginTop: Dimensions.get('window').height * .005,
    marginRight: Dimensions.get('window').width * .05,
    width: Dimensions.get('window').width * .2,
    height: Dimensions.get('window').height * .04,
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: Dimensions.get('window').height * .02,
    opacity:0.8,
    borderWidth:1.5,
    borderRadius: 20,
    zIndex: 1

},

    dollarSign:{
        marginTop: Dimensions.get('window').height * .014,
        marginRight: Dimensions.get('window').width * -.08,
        // width: Dimensions.get('window').width * .017,
        // height: Dimensions.get('window').height * .02,
        zIndex: 2
    },
    costText:{
        marginTop: Dimensions.get('window').height * .005,
        marginLeft: Dimensions.get('window').width * .01,
        fontSize: Dimensions.get('window').height * .025,
        zIndex: 1

    },
    moreContainer: {
        marginTop: Dimensions.get('window').height * .035,
    },
    moreTitle: {
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .025,
        marginLeft: 20,
    },
    rowsContainer:{
        marginTop:Dimensions.get('window').height * .035,
    },
    eachRowContainer: {
        height: Dimensions.get('window').height * .04,
        justifyContent: 'center',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
    },
    arrowImage: {
        height: Dimensions.get('window').height * .015,
        marginTop: Dimensions.get('window').height * .005,
    },
    arrowButton: {
        
    },
    navigationsRows: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    navigationsRowsTitle: {
        fontSize: Dimensions.get('window').height * .02,
        marginLeft: Dimensions.get('window').width * .05,
    },




    dialogTitle: {
        fontWeight: 'bold',
        fontSize: 20
    },
    dialogContent: {
        fontSize: 18
    },
    cancelDialog: {
        color: 'black'
    },
    sureDialog: {
        color: 'red',
        fontWeight: 'bold'
    },
    titlesContainer: {
        alignItems: 'center',
    },
    justYouHeader: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    partnerText: {
        color: 'deepskyblue',
        fontWeight: 'bold',
        fontSize: 20
    },
    arrowBackButton: {
        alignItems: 'flex-start',
        marginLeft: 15
    },
});

export default TrainerOrderPage;