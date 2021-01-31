import React, {useContext, useState, useEffect, useReducer} from 'react';
import {Modal, Dimensions,Button, Text, View, SafeAreaView, Image, StyleSheet} from 'react-native';
import EventCalendar from '../../GlobalComponents/calendar/EventCalendar';
import Dialog from "react-native-dialog";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from '@react-native-community/datetimepicker';

import Icon from 'react-native-vector-icons/Feather';

import { TouchableOpacity } from 'react-native-gesture-handler';

import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';
import {TrainerContext} from '../../../context/TrainerContext';
import {ClientContext} from '../../../context/ClientContext';
import {OrderContext} from '../../../context/OrderContext';

import axios from 'axios';

//The settings page
const ChooseDateAndTimePage = ({navigation}) => {

    

    const {
            dispatchOrderDate,
                 dispatchOrderStartTime,
                     dispatchOrderEndTime}
        = useContext(OrderContext);

    const {trainerObject } = useContext(TrainerContext);

        
    
    const [unavailableDialogVisible, setUnavailableDialogVisible] = useState(false);
    const [datePickerVisible, setDatePickerVisible] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [currentDisplayedDate, setCurrentDisplayedDate] = useState("");


    const [allEvents, setAllEvents] = useState([]);
  
    var startTimeToPass = ''
    var endTimeToPass = ''
    var orderDateToPass =  ''
    const forceUpdate = useReducer(bool => !bool)[1];//Page refresh 

    var trainerMongoDB = {};
    
    

    useEffect(() => {
        navigation.dangerouslyGetParent().setOptions({
            tabBarVisible: false
        })
        
        setCurrentDisplayedDate(getCurrentDate());

        getTrainerFromMongoDB();    
    },[]);

    const config = {
        withCredentials: true,
        baseURL: 'http://localhost:3000/',
        headers: {
              "Content-Type": "application/json",
        },
    };     

    //get trainer again from mongo to check if any changes happend during the dispatch Passes
    const getTrainerFromMongoDB = async () => {
        // console.log('🚨click')
             await axios
            .get('/trainers/email/'+trainerObject.email.toLowerCase(),config)
            .then((doc) => {
              if(doc) {
                // setTrainerObjectMongoDB(doc.data[0]);
                trainerMongoDB = doc.data[0];
              }
              getAllEventAfterModify();
            })
            .catch((err) => {
             
            })
            
          
    }



    var async = require("async");

    const getAllEventAfterModify = async() =>{
        await getAllEvents();
            
            setAvailabele();
    }
    const getAllEvents = async () => {
        var events = allEvents;

        //extract events from calendar array
       for (let index = 0; index < trainerMongoDB.calendar.length; index++) {
            var element = trainerMongoDB.calendar[index].event;
            

            if( element.color === 'deepskyblue'){
                element = Object.assign({}, element, {color: 'lightgrey'},{title: 'UNAVAILABLE'},{summary: ''},{start: element.start},{end: element.end});

            }
            events.push(element);
            
        }

        setAllEvents(events);
       
    }

    const getOccupiedHours = (events) => {
        var occupiedHours = [];


        for (let index = 0; index < events.length; index++) {
            const singleEvent = events[index];            
            const startTime = singleEvent.start.slice(11);
            const endTime = singleEvent.end.slice(11);
            occupiedHours.push(startTime+'-'+endTime);
         }

        return occupiedHours;
    }


    //Blocks the entire calendar for the picked date, only on available times
    const setAvailabele = () => {
        setDatePickerVisible(false);
        var events = allEvents;
        // var events = [];
        var addAbleEvent = {};

        var date = new Date();

        
        



        // A loop that ran day after day on the calendar(30 days max as setted in the for loop)
        for (let index = 0; index < 30; index++) {
                var date = new Date();
                date.setDate(date.getDate() + index);
                var minute = date.getMinutes();
                var hour = date.getHours();
                var day = date.getDate() ; 
                var month = date.getMonth() + 1; 
                var year = date.getFullYear(); 

                day = day <10 ? "0"+day : day; 
                month = month < 9 ? "0"+(month) : (month) ; 
                var fullDate = year + '-' + month + '-' + day;

                var occupiedHours = getOccupiedHours(getEventsFromDate(fullDate));

                ///***PART ONE IF NO ANY OCCUPIED HOURS AT THAT DAY***
                if (occupiedHours === undefined || occupiedHours.length == 0) {

                    //when occupiedHours empty or does not exist
                    //inserting to the events array an event which set as AVAILABLE for all day
                    addAbleEvent = {start: fullDate+ ' 00:00:00', end: fullDate + ' 24:00:00', title: 'AVAILABLE', color: 'deepskyblue'};
                    events.push(addAbleEvent);

                }else if(occupiedHours){
                    //if there are occupied event in that day
                    var sortedArray = occupiedHours.sort();
                    //if there is only one occupied event:
                    if (sortedArray.length === 1) {
                        var startTimeForNewEvent = sortedArray[0].slice(0,8);
                        var endTimeForNewEvent = sortedArray[0].slice(9,17);
                        //check if there is any event in the beginning of the day
                        //if there is no event - first available event will be from '00:00:00'
                        if(sortedArray[0].slice(0,8) != '00:00:00'){
                            if (startTimeForNewEvent != '00:00:00') {
                                addAbleEvent = {start: fullDate+ ' '+'00:00:00', end: fullDate + ' '+ startTimeForNewEvent, title: 'AVAILABLE', color: 'deepskyblue'};
                                events.push(addAbleEvent);
                            }
                            
                        }
                        //check if there is any event in the end of the day
                        //if there is no event - last available event will be until '24:00:00'
                        if (sortedArray[0].slice(9,17) != '24:00:00'){
                            if (endTimeForNewEvent != '24:00:00') {
                                addAbleEvent = {start: fullDate+ ' '+endTimeForNewEvent, end: fullDate + ' '+ '24:00:00', title: 'AVAILABLE', color: 'deepskyblue'};
                                events.push(addAbleEvent);
                            }
                        }
                    //***PART TWO IF THERE ARE OCCUPIED HOURS AT THAT DAY***       
                    }else if(sortedArray.length > 1){
                        //first fill the empty start of the day
                        //if day got no any '00:00:00' start time
                        // sortedArray[0].slice(0,8) == first event in the day
                        if (sortedArray[0].slice(0,8) != '00:00:00') {
                            var startTimeForNewEvent = sortedArray[0].slice(0,8);
                           if( startTimeForNewEvent != '00:00:00'){
                            addAbleEvent = {start: fullDate+ ' '+'00:00:00', end: fullDate + ' '+ startTimeForNewEvent, title: 'AVAILABLE', color: 'deepskyblue'};
                            events.push(addAbleEvent);
                           }
                            
                        }
                        //fill the end of the day:
                        //if day got no any '24:00:00' end time
                        //sortedArray[sortedArray.length-1] == last event in the day
                        if (sortedArray[sortedArray.length-1].slice(9,17) != '24:00:00'){
                            var endTimeForNewEvent = sortedArray[sortedArray.length-1].slice(9,17);
                            if (endTimeForNewEvent != '24:00:00') {
                                addAbleEvent = {start: fullDate+ ' '+endTimeForNewEvent, end: fullDate + ' '+ '24:00:00', title: 'AVAILABLE', color: 'deepskyblue'};
                                events.push(addAbleEvent);
                            }
                        }

                        //if day got no any '00:00:00' start time and '24:00:00' end time
                        for (let index = 0; index < sortedArray.length; index++) {
                            
                            if ((sortedArray[index+1] != undefined)) {
                                var startTimeForNewEvent = sortedArray[index+1].slice(0,8);
                                var endTimeForNewEvent = sortedArray[index].slice(9,17);
                                 //check that events won't create between no time in occupied hours
                                 // so we check start time of the next event isn't equal to current event
                                if(startTimeForNewEvent != endTimeForNewEvent){
                                    addAbleEvent = {start: fullDate+ ' '+endTimeForNewEvent, end: fullDate + ' '+ startTimeForNewEvent, title: 'AVAILABLE', color: 'deepskyblue'};
                                    events.push(addAbleEvent);
                                }
                            } 
                        }
                    }

                   
                }

        }
        
        forceUpdate();

    }

    

    
    
    //Hides the Date picker when user close/confirm
    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

     //Format given date to our desired format
     const getFullDateFormat = (date) => {
        var day = date.getDate(); 
        var month = date.getMonth() + 1; 
        var year = date.getFullYear(); 

        day = day <10 ? "0"+day : day; 
        month = month < 9 ? "0"+(month) : (month) ; 
        return year + '-' + month + '-' + day;
    }


    //Get current date
    const getCurrentDate = () => {
        var date = new Date();
        return getFullDateFormat(date);
    }



    

    //Get all events on a certain date
    const getEventsFromDate = (date) => {
        var events = allEvents;
        var eventsOnDate = [];
    
        for (let index = 0; index < events.length; index++) {
            const singleEvent = events[index];
            const eventDate = singleEvent.start.slice(0, 10);
    
            if (date === eventDate) {
                eventsOnDate.push(singleEvent);
            }
        }
    
        return eventsOnDate;
    }



    //Convert  2021-01-03 07:00:00 to 2021-01-03T07:00:00.000Z
    const getDateInFormat = (dateString) => {
        return ((dateString.replace(/ /g, 'T'))+ '.000Z');
    }

    //Remove all real events (deepskyblue events) from the array
    const removeCustomerEvents = (allDayEvents) => {
        for (let index = 0; index < allDayEvents.length; index++) {
            const singleEvent = allDayEvents[index];

            if (singleEvent.color === 'deepskyblue') {
                allDayEvents.splice(index, 1);
            }  
        }

        return allDayEvents;
    }

        // Swap Numbers
        const swapNumbers = (array, i, j) => {
            // Save Element Value (Because It Will Change When We Swap/Reassign)
            let temp = array[i];
            // Assign Element2 To Element1
            array[i] = array[j];
            // Assign Element1 To Element2
            array[j] = temp;
        };
    
        //Sort events array by time
        const bubbleSort = (array) => {
            // Iterate Over Array From First Element
            for (let i = 0; i < array.length; i++) {
                // Iterate Over Array From Succeeding Element
                for (let j = 1; j < array.length; j++) {
                    // Check If First Element Is Greater Proceeding Element
                    const firstEvent = new Date(getDateInFormat(array[j - 1].start));
                    const secondEvent = new Date(getDateInFormat(array[j].start));
        
                    if (firstEvent.getTime() > secondEvent.getTime()) {
                        // Swap Numbers
                        swapNumbers(array, j - 1, j);
                    }
                }
            }
            // Return Array
            return array;
        };
    
        const handleEventTapped = (event) => {
            if(event.color === 'lightgrey'){
                setUnavailableDialogVisible(true);
            }else{
                setModalVisible(true);
                
                
            }
        }

        //Save value from start time picker
    const onStartTimeChange = (event) => {
        var selectedTime = new Date(event.nativeEvent.timestamp);
        selectedTime.setHours(selectedTime.getHours()-selectedTime.getTimezoneOffset()/60);
        selectedTime = new Date(selectedTime.toISOString());

     
        var endTimeToPassInto = new Date(event.nativeEvent.timestamp);
        endTimeToPassInto.setHours(endTimeToPassInto.getHours()-endTimeToPassInto.getTimezoneOffset()/60);
        endTimeToPassInto = new Date(selectedTime.toISOString());
        endTimeToPassInto.setHours(endTimeToPassInto.getHours()+1);

      
        startTimeToPass = selectedTime.toISOString().toString();

        endTimeToPass = endTimeToPassInto.toISOString().toString();
        orderDateToPass = startTimeToPass.slice(0,10);
        startTimeToPass = startTimeToPass.slice(11,19);
        endTimeToPass = endTimeToPass.slice(11,19);
        console.log('date: ' + startTimeToPass.slice(0,10))
        console.log('startTimeToPass ' + startTimeToPass.slice(11,19));
        console.log('endTimeToPass ' + endTimeToPass.slice(11,19))


    }
   
   
    //passing selected order times to TrainerOrderPage
    const handleSubmitButton = () => {
        if(startTimeToPass === ''){
            alert('Please select start time for the training')
        }else{
            setModalVisible(false);
            console.log('startTimeToPass');
            console.log(startTimeToPass);
            dispatchOrderStartTime({
                type: 'SET_ORDER_START_TIME',
                orderStartTime : startTimeToPass
            });
            dispatchOrderEndTime({
                type: 'SET_ORDER_END_TIME',
                orderEndTime : endTimeToPass
            });
            dispatchOrderDate({
                type: 'SET_ORDER_DATE',
                orderDate : orderDateToPass
            });
            navigation.dangerouslyGetParent().setOptions({
                tabBarVisible: true
            })

            navigation.navigate('TrainerOrderPage' );
    
            setDatePickerVisible(false);

        }

        
    }

   

    //Update current displayed date
    const handleOnDateChange = (date) => {
        setCurrentDisplayedDate(date);
    }
    const handleArrowButton = () => {
        navigation.dangerouslyGetParent().setOptions({
            tabBarVisible: true
        })
        navigation.navigate('TrainerOrderPage' );
    }
    

    return(
        <SafeAreaView style={styles.safeArea}>
            <View>
            <View style={styles.arrowAndHeaderContainer}>
            <ArrowBackButton
                        onPress={handleArrowButton}
                        />
                <View style={styles.headerContainer}>
                        <Text style={styles.justYouHeader}>Just You</Text>
                        <Text style={styles.partnerText}>Calendar</Text>
                        
                </View>
               
            </View>
            


            <Modal

                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                }}
                >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Choose time range</Text>

                        <Text style={styles.subtitleText}>Training start time</Text>
                        <DateTimePicker
                            style={styles.pickerStyle}
                            testID="dateTimePicker"
                            minuteInterval={10}
                            value={new Date(currentDisplayedDate)}
                            mode={'time'}
                            is24Hour={true}
                            display="default"
                            onChange={(time) => onStartTimeChange(time)}
                        
                        />
                        
                        <View style={styles.buttonsRow}> 
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <Text style={styles.cancelTextStyle}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={() => {
                                    handleSubmitButton();
                                }}
                            >
                                <Text style={styles.submitTextStyle}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                </Modal>


                <Dialog.Container visible={unavailableDialogVisible}>
                    <Dialog.Title style={styles.dialogTitle}>The selected time is unavailable</Dialog.Title>
                    <Dialog.Button style={styles.signOutDialog} label="ok" onPress={() => setUnavailableDialogVisible(false)} />

                </Dialog.Container>

            <DateTimePickerModal
              isVisible={datePickerVisible}
              mode="time"
              onConfirm={(time) => handleAddEvent(time)}
              onCancel={hideDatePicker}
              headerTextIOS="Choose a time to start training        *training is one hour"
            />

            
            </View>
            <View style={styles.container}>
                
                        <EventCalendar
                            events={allEvents}
                            eventTapped={(event)=>handleEventTapped(event)}
                            width={Dimensions.get('window').width}
                            style ={styles.event}
                            initDate={getCurrentDate()}
                            dateChanged={(date)=> handleOnDateChange(date)}
                            upperCaseHeader
                            uppercase
                            scrollToFirst
                            format24h
                        />
               
            </View>
        </SafeAreaView>
    )
}   

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'white',
        flex: 1
    },
    arrowAndHeaderContainer:{
        marginRight: Dimensions.get('window').width * .35,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerContainer: {
        alignItems: 'center'
      },
    justYouHeader: {
        fontSize: Dimensions.get('window').height * .0278,
        fontWeight: 'bold'
    },
    partnerText: {
        color: 'deepskyblue',
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .018,
        
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
    container: {
        marginTop: Dimensions.get('window').height * .01,

        flex: 1
    },
    justYouHeader: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    event: {
        zIndex: -1,
        opacity: 0.5
    },
    addEventText:{
        color: 'deepskyblue',
        fontSize: Dimensions.get('window').height * .023,
        marginLeft : Dimensions.get('window').width * .03,
        marginTop: Dimensions.get('window').height * .01,
    },
    eventCalendarContainer:{
        marginTop:Dimensions.get('window').height * .01,
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        height: Dimensions.get('window').height * .25,
        width: Dimensions.get('window').width * .7,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      modalText: {
        marginTop:  Dimensions.get('window').height * .01,
        fontWeight: "bold",
        fontSize: Dimensions.get('window').height * .03,
        textAlign: "center"
      }, 
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      subtitleText: {
        marginTop:  Dimensions.get('window').height * .025,
        fontWeight: "bold",
        fontSize: Dimensions.get('window').height * .02,
        textAlign: "center"
      },
      buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      pickerStyle: {
        alignSelf: 'center',
        marginRight: Dimensions.get('window').width * -.25,
        width: Dimensions.get('window').width * .5,
        height: Dimensions.get('window').height * .10,
      },
      cancelButton: {
        marginLeft: Dimensions.get('window').width * .04,
        backgroundColor: "lightgrey",
        width: Dimensions.get('window').width * .25,
        height: Dimensions.get('window').height * .05,
        borderRadius: 20,
        justifyContent: 'center'
      },
      cancelTextStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
      },
      submitButton: {
        marginRight: Dimensions.get('window').width * .04,
        backgroundColor: "deepskyblue",
        width: Dimensions.get('window').width * .25,
        height: Dimensions.get('window').height * .05,
        borderRadius: 20,
        justifyContent: 'center'
      },
      submitTextStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
      },

});

export default ChooseDateAndTimePage;