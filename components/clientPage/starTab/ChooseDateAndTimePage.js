import React, {useContext, useState, useEffect, useReducer} from 'react';
import {Modal, Dimensions,Button, Text, View, SafeAreaView, Image, StyleSheet} from 'react-native';
import EventCalendar from '../../GlobalComponents/calendar/EventCalendar';
import Dialog from "react-native-dialog";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from '@react-native-community/datetimepicker';

import Icon from 'react-native-vector-icons/Feather';

import { TouchableOpacity } from 'react-native-gesture-handler';

import {TrainerContext} from '../../../context/TrainerContext';
import {ClientContext} from '../../../context/ClientContext';
import {OrderContext} from '../../../context/OrderContext';

import axios from 'axios';

//The settings page
const ChooseDateAndTimePage = ({navigation}) => {

    const {clientID, dispathClientID,
        clientEmail,dispathClientEmail,
            clientFirstName,dispathClientFirstName,
                clientlastName,dispathClientLastName } 
    = useContext(ClientContext);

    const {orderObejct, dispatchOrderObject,
        orderTrainingSiteAddress, dispatchOrderTrainingSiteAddress,
            orderTrainingCategory, dispatchOrderTrainingCategory,
                 dispatchOrderStartTime,
                     dispatchOrderEndTime}
        = useContext(OrderContext);

    const {trainerObject, dispatchTrainerObject} = useContext(TrainerContext);

        
    const [dialogVisible, setDialogVisible] = useState(false);
    const [timeSelectedDialogVisible, setTimeSelectedDialogVisible] = useState(false);
    const [unavailableDialogVisible, setUnavailableDialogVisible] = useState(false);
    const [trainerObjectMongoDB, setTrainerObjectMongoDB] = useState({});
    const [datePickerVisible, setDatePickerVisible] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [date, setDate] = useState(new Date(1598051730000));
    const [currentDisplayedDate, setCurrentDisplayedDate] = useState("");


    const [allEvents, setAllEvents] = useState([]);
    const [startTimeToPass, setStartTimeToPass] = useState('');
    const [endTimeToPass, setEndTimeToPass] = useState('');
    const forceUpdate = useReducer(bool => !bool)[1];//Page refresh 

    var trainerMongoDB = {};
    // var startTimeToPass = "";
    // var endTimeToPass = "";
    

    useEffect(() => {
        // for (let index = 0; index <= 60; index+10) {
        //     console.log(index);
        // }
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
        // forceUpdate();
        
        // setAvailabele();

            //change color of event to lightgrey for Unavailable mode
        // const eventsToPush = events
        // .map(event => {
        //     if (event.color === 'deepskyblue') {
        //     return Object.assign({}, event, {color: 'lightgrey'},{title: 'UNAVAILABLE'},{summary: ''});
        //     } 
        //     return event      
        //     });
                
        //     setAllEvents(eventsToPush);
        //     forceUpdate();
        //     console.log(allEvents);
    }

    // cleanTrainerUnavailable = () => {
    //     var events = allEvents;

    //     for (let index = 0; index < trainerObject.calendar.length; index++) {
    //         const element = trainerObject.calendar[index].event;
            
    //         events.splice(element, 1);
            
            
    //     }
    // }

        //Return if the addAbleEvent is on occupiedHours and can't add him
        const checkIfTimeIsOccupied = (event, occupiedHours) => {
            var isOccupied = false;
            
            if (occupiedHours === []) {
                return false;
            }

            //Full date + time of the start of the addAbleEvent
            var eventStartDate = new Date((event.start.replace(/ /g, 'T')) + '.000Z'); //2021-01-03T07:00:00.000Z
            //Full date + time of the end of the addAbleEvent
            var eventEndDate = new Date((event.end.replace(/ /g, 'T')) + '.000Z'); // 2021-01-03T08:00:00.000Z

            //Set time according to Timezone
            eventStartDate.setHours(eventStartDate.getHours()+eventStartDate.getTimezoneOffset()/60);
            eventEndDate.setHours(eventEndDate.getHours()+eventStartDate.getTimezoneOffset()/60);

            for (let index = 0; index < occupiedHours.length; index++) {
                const hoursRange = occupiedHours[index]; //example: "05:00:00-06:00:00"

                var occupiedEventStartDate = new Date(event.start.slice(0, 10));  // 2021-01-03T00:00:00.000Z
                var occupiedEventEndDate = new Date(event.start.slice(0, 10)); // 2021-01-03T00:00:00.000Z
                
                var startTime = hoursRange.slice(0, 8); //example: "05:00:00"
                var endTime = hoursRange.slice(9); //example: "06:00:00"

                //example: 2021-01-03T05:00:00.000Z
                occupiedEventStartDate.setHours(startTime.split(":")[0]);
                occupiedEventStartDate.setMinutes(startTime.split(":")[1]);
                occupiedEventStartDate.setSeconds(startTime.split(":")[2]);

                //example: 2021-01-03T06:00:00.000Z
                occupiedEventEndDate.setHours(endTime.split(":")[0]);
                occupiedEventEndDate.setMinutes(endTime.split(":")[1]);
                occupiedEventEndDate.setSeconds(endTime.split(":")[2]);

                //example 1609707700000 >=  1609707600000 && 1609711000000 <= 1609711200000 
                isOccupied = (eventStartDate.getTime() >= occupiedEventStartDate.getTime() && eventEndDate.getTime() <= occupiedEventEndDate.getTime())
                 || (eventStartDate.getTime() > occupiedEventStartDate.getTime() && eventStartDate.getTime() < occupiedEventEndDate.getTime())
                 || (eventEndDate.getTime() > occupiedEventStartDate.getTime() && eventEndDate.getTime() < occupiedEventEndDate.getTime());

                //Break loop and return answer if time is occupied (no need to continue)
                if (isOccupied) {
                    break;
                }
            }

            return isOccupied;
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

        
        // for (let index = 0; index <= 60; index+=10) {
        //     date.setHours(date.getHours(),date.getMinutes()+ 10,0,0);
        //     console.log('adding minutes:'+ date);

        // }
        //  addAbleEvent = {start: '2021-01-08 '+ '07:00:00', end: '2021-01-08 ' + '08:00:00', title: 'AVAILABLE', color: 'deepskyblue'};
        //  events.push(addAbleEvent);
        //  setAllEvents(events);
        //  forceUpdate();
        // console.log(events);



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

                // //unite UNAVILAVLE EVENTS
                // var todayEvents = getEventsFromDate(fullDate);
                // console.log('todayEvents: ' + todayEvents[0]);
                // todayEvents.sort()
                // console.log('todayEvents: ' +  + todayEvents[0]);

                // for (let index = 0; index < todayEvents.length; index++) {
                //     // const element = array[index];
                    
                // }


                
                



                        
            // for (let index = 0; index < 24; index++) {
            //     if(index<9) {
            //         addAbleEvent = {start: fullDate+' 0'+index+':00:00', end: fullDate+' 0'+(index+1)+':00:00', title: 'AVAILABLE', color: 'deepskyblue'};
            //         if (checkIfTimeIsOccupied(addAbleEvent, occupiedHours) === false) {

                        
            //             events.push(addAbleEvent);
                        
            //         }
            //         // else{
            //         //     //if trainer already has an event in that time 
            //         //     const unavailableEvent = {start: fullDate+' 0'+index+':00:00', end: fullDate+' 0'+(index+1)+':00:00', title: 'UNAVAILABLE', color: 'lightgrey'}
            //         //     events.push(unavailableEvent)
            //         // }
            //     } else if (index === 9) {
            //         addAbleEvent =  {start: fullDate+' 0'+index+':00:00', end: fullDate+' '+(index+1)+':00:00', title: 'AVAILABLE', color: 'deepskyblue'};
            //         if (checkIfTimeIsOccupied(addAbleEvent, occupiedHours) === false) {
            //             events.push(addAbleEvent);
            //         }
            //         // else{
            //         //     //if trainer already has an event in that time 
            //         //     const unavailableEvent = {start: fullDate+' 0'+index+':00:00', end: fullDate+' 0'+(index+1)+':00:00', title: 'UNAVAILABLE', color: 'lightgrey'}
            //         //     events.push(unavailableEvent)
            //         // }
            //     } else {
            //         addAbleEvent =  { start: fullDate+' '+index+':00:00', end: fullDate+' '+(index+1)+':00:00', title: 'AVAILABLE', color: 'deepskyblue'};
            //         if (checkIfTimeIsOccupied(addAbleEvent, occupiedHours) === false) {
            //             events.push(addAbleEvent);
            //         }
            //         // else{
            //         //     //if trainer already has an event in that time 
            //         //     const unavailableEvent = {start: fullDate+' 0'+index+':00:00', end: fullDate+' 0'+(index+1)+':00:00', title: 'UNAVAILABLE', color: 'lightgrey'}
            //         //     events.push(unavailableEvent)
            //         // }
            //     }
            // }


        
        
        
        
        }
        

        

        // setAllEvents(events)
                
        // updateTrainerUnavailable(events);



        forceUpdate();
        // cleanTrainerUnavailable();

       
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






    //Get all the events in a day (real events + addable event) 
    //and return an array with all the unavailable events united
    const uniteAllAvailable = (allDayEvents) => {
        //Create customevent for future usage
        var customEvent = {};

        //Sort all the events by time in the array
        allDayEvents = bubbleSort(allDayEvents);

        // console.log('allDayEvents:   '+ allDayEvents)

        for (let index = 0; index < allDayEvents.length-1;) {
            const firstEvent = allDayEvents[index]; //00:00:00
            const secondEvent = allDayEvents[index+1]; //01:00:00

            
            if(firstEvent.color === 'deepskyblue' && secondEvent.color === 'deepskyblue') {
                customEvent = {start: firstEvent.start, end: secondEvent.end, title: 'AVAILABLE', color: 'deepskyblue'};
                allDayEvents.splice(index, 1);
                allDayEvents[index] = customEvent;
                
            }  else {
                index++;
            }
        }
        
        var unavailableEvents = removeCustomerEvents(allDayEvents);
        return unavailableEvents;
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
                // setDatePickerVisible(true);
                setModalVisible(true);
                // setTimeSelectedDialogVisible(true);
                //pass the times through the Dialog
                setStartTimeToPass(event.start);
                setEndTimeToPass(event.end);
                
            }
        }

        //Save value from start time picker
    const onStartTimeChage = (event) => {
        var selectedTime = new Date(event.nativeEvent.timestamp);
        setCurrentDisplayedDate(selectedTime);

        selectedTime.setHours(selectedTime.getHours()-selectedTime.getTimezoneOffset()/60);
        new Date(selectedTime.toISOString());
        setStartTimeToPass(new Date(selectedTime.toISOString()));
        setCurrentDisplayedDate(selectedTime);
        console.log(startTimeToPass);
    }

    //Save value from end time picker
    const onEndTimeChage = (event) => {
        var selectedTime = new Date(event.nativeEvent.timestamp);
        selectedTime.setHours(selectedTime.getHours()-selectedTime.getTimezoneOffset()/60);
        blockEndTime = new Date(selectedTime.toISOString());
    
    }

    //Show date picker
    const handleShowAddEvent = () => {
        setDatePickerVisible(true);
    }
    const handleAddEvent = (time) => {
        console.log(startTimeToPass);

        
        setDatePickerVisible(false);
    }

    const handleBlockDayConfirm = (date) => {
        setDatePickerVisible(false);
    }

    const handleCancelDialog = () => {
        setTimeSelectedDialogVisible(false);
    }
    //passing selected order times to TrainerOrderPage
    const handleSubmitDialog = (startTimeForOrder, endTimeForOrder) => {
        dispatchOrderStartTime({
            type: 'SET_ORDER_START_TIME',
            orderStartTime : startTimeForOrder
        });
        dispatchOrderEndTime({
            type: 'SET_ORDER_END_TIME',
            orderEndTime : endTimeForOrder
        });
        navigation.navigate('TrainerOrderPage'
        // ,{
        //     params: { orderStartTime: startTimeForOrder, orderEndTime: endTimeForOrder },
        //     orderStartTime: startTimeForOrder,
        //     orderEndTime: endTimeForOrder
        // }
        );

        // setTimeSelectedDialogVisible(false);

       

    }
    

    return(
        <SafeAreaView style={styles.safeArea}>
            <View>

            <View style={styles.headerContainer}>
                    <Text style={styles.justYouHeader}>Just You</Text>
                    <Text style={styles.partnerText}>Calendar</Text>
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
                            onChange={(time) => onStartTimeChage(time)}
                        
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
                                    handleAddEvent();
                                    // setModalVisible(!modalVisible);
                                }}
                            >
                                <Text style={styles.submitTextStyle}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                </Modal>


            
               
                {/* <Dialog.Container visible={timeSelectedDialogVisible}>
                    <Dialog.Title >Confirmation </Dialog.Title>
                    <Dialog.Description >{ 'Date: '+ startTimeToPass.slice(0,10)+' \n'+'Time: '+startTimeToPass.slice(11,16)+ '-'+endTimeToPass.slice(11,16)} </Dialog.Description>
                    <Dialog.Button style={styles.cancelDialog} label="Cancel" onPress={(() => handleCancelDialog())} />
                    <Dialog.Button style={styles.signOutDialog} label="Submit" onPress={() => handleSubmitDialog(startTimeToPass, endTimeToPass)} />

                </Dialog.Container> */}

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
                {/* <View>  </View> */}
            {/* <Icon name="plus-square" size={Dimensions.get('window').height * .025} color="#00bfff" /> */}
                {/* <View style={styles.eventCalendarContainer}> */}

                    {/* <TouchableOpacity
                        onPress= {() => handleShowAddEvent()}>
                        <Text style={styles.addEventText}>Add event</Text>
                    </TouchableOpacity> */}
                        <EventCalendar
                            events={allEvents}
                            eventTapped={(event)=>handleEventTapped(event)}
                            width={Dimensions.get('window').width}
                            style ={styles.event}
                            initDate={getCurrentDate()}
                            upperCaseHeader
                            uppercase
                            scrollToFirst
                            format24h
                        />
                {/* </View> */}
               
            </View>
        </SafeAreaView>
    )
}   

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'white',
        flex: 1
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
        fontSize: Dimensions.get('window').height * .018
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
        // margin: Dimensions.get('window').height * .25,
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
        // marginTop:  Dimensions.get('window').height * .02,
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      pickerStyle: {
        // marginTop:  Dimensions.get('window').height * .025,
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