import React, {useContext, useState, useEffect, useReducer} from 'react';
import { Dimensions,Button, Text, View, SafeAreaView, Image, StyleSheet} from 'react-native';
import EventCalendar from '../../GlobalComponents/calendar/EventCalendar';
import Dialog from "react-native-dialog";
import DateTimePickerModal from "react-native-modal-datetime-picker";
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
    const [allEvents, setAllEvents] = useState([]);
    const [startTimeToPass, setStartTimeToPass] = useState('');
    const [endTimeToPass, setEndTimeToPass] = useState('');
    const forceUpdate = useReducer(bool => !bool)[1];//Page refresh 

    var trainerMongoDB = {};
    // var startTimeToPass = "";
    // var endTimeToPass = "";
    

    useEffect(() => {
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
                console.log(element);

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
        var addAbleEvent = {};

        // for loop for days to run ahead
        for (let index = 0; index < 30; index++) {
                var date = new Date();
                date.setDate(date.getDate() + index);
                var day = date.getDate() ; 
                var month = date.getMonth() + 1; 
                var year = date.getFullYear(); 

                day = day <10 ? "0"+day : day; 
                month = month < 9 ? "0"+(month) : (month) ; 
                var fullDate = year + '-' + month + '-' + day;
                console.log(fullDate)

                var occupiedHours = getOccupiedHours(getEventsFromDate(fullDate));



                        
            for (let index = 0; index < 24; index++) {
                if(index<9) {
                    addAbleEvent = {start: fullDate+' 0'+index+':00:00', end: fullDate+' 0'+(index+1)+':00:00', title: 'AVAILABLE', color: 'deepskyblue'};
                    if (checkIfTimeIsOccupied(addAbleEvent, occupiedHours) === false) {
                        events.push(addAbleEvent);
                    }
                    // else{
                    //     //if trainer already has an event in that time 
                    //     const unavailableEvent = {start: fullDate+' 0'+index+':00:00', end: fullDate+' 0'+(index+1)+':00:00', title: 'UNAVAILABLE', color: 'lightgrey'}
                    //     events.push(unavailableEvent)
                    // }
                } else if (index === 9) {
                    addAbleEvent =  {start: fullDate+' 0'+index+':00:00', end: fullDate+' '+(index+1)+':00:00', title: 'AVAILABLE', color: 'deepskyblue'};
                    if (checkIfTimeIsOccupied(addAbleEvent, occupiedHours) === false) {
                        events.push(addAbleEvent);
                    }
                    // else{
                    //     //if trainer already has an event in that time 
                    //     const unavailableEvent = {start: fullDate+' 0'+index+':00:00', end: fullDate+' 0'+(index+1)+':00:00', title: 'UNAVAILABLE', color: 'lightgrey'}
                    //     events.push(unavailableEvent)
                    // }
                } else {
                    addAbleEvent =  { start: fullDate+' '+index+':00:00', end: fullDate+' '+(index+1)+':00:00', title: 'AVAILABLE', color: 'deepskyblue'};
                    if (checkIfTimeIsOccupied(addAbleEvent, occupiedHours) === false) {
                        events.push(addAbleEvent);
                    }
                    // else{
                    //     //if trainer already has an event in that time 
                    //     const unavailableEvent = {start: fullDate+' 0'+index+':00:00', end: fullDate+' 0'+(index+1)+':00:00', title: 'UNAVAILABLE', color: 'lightgrey'}
                    //     events.push(unavailableEvent)
                    // }
                }
            }


            //Get all currently displayed events on this date
        var eventsOnPickedDate = getEventsFromDate(fullDate);

        // eventsOnPickedDate.forEach(element => {
        //     console.log(element.start)
            
        // });
        // console.log('eventsOnPickedDate: ' + eventsOnPickedDate[0].start);

        //Merge the current events and our 'addable' unavailable events into an array
        var allDayEvents = [
            ...eventsOnPickedDate,
            //  ...events
            ];
        
        //Get all available events from the day
        // var availableEvents = uniteAllAvailable(eventsOnPickedDate);
        
        }
        // events = [
        //     ...allEvents,
        //      ...availableEvents];

        

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



    const handleEventTapped = (event) => {
        if(event.color === 'lightgrey'){
            setUnavailableDialogVisible(true);
        }else{
            setTimeSelectedDialogVisible(true);
            //pass the times through the Dialog
            setStartTimeToPass(event.start);
            setEndTimeToPass(event.end);
            
        }
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
    

    //Show date picker
    const handleShowAddEvent = () => {
        setDatePickerVisible(true);
    }
    const handleAddEvent = (time) => {

        
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
               
                <Dialog.Container visible={timeSelectedDialogVisible}>
                    <Dialog.Title >Confirmation </Dialog.Title>
                    <Dialog.Description >{ 'Date: '+ startTimeToPass.slice(0,10)+' \n'+'Time: '+startTimeToPass.slice(11,16)+ '-'+endTimeToPass.slice(11,16)} </Dialog.Description>
                    <Dialog.Button style={styles.cancelDialog} label="Cancel" onPress={(() => handleCancelDialog())} />
                    <Dialog.Button style={styles.signOutDialog} label="Submit" onPress={() => handleSubmitDialog(startTimeToPass, endTimeToPass)} />

                </Dialog.Container>

                <Dialog.Container visible={unavailableDialogVisible}>
                    <Dialog.Title style={styles.dialogTitle}>The selected time is unavailable</Dialog.Title>
                    <Dialog.Button style={styles.signOutDialog} label="ok" onPress={() => setUnavailableDialogVisible(false)} />

                </Dialog.Container>

            <DateTimePickerModal
              isVisible={datePickerVisible}
              mode="date"
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
    }

});

export default ChooseDateAndTimePage;