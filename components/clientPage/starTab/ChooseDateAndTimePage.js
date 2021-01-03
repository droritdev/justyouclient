import React, {useContext, useState, useEffect, useReducer} from 'react';
import { Dimensions,Button, Text, View, SafeAreaView, Image, StyleSheet} from 'react-native';
import {TrainerContext} from '../../../context/TrainerContext';

import EventCalendar from '../../GlobalComponents/calendar/EventCalendar';
import Dialog from "react-native-dialog";

import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';

//The settings page
const ChooseDateAndTimePage = ({navigation}) => {

    const [dialogVisible, setDialogVisible] = useState(false);
    const {trainerObject, dispatchTrainerObject} = useContext(TrainerContext);
    const [allEvents, setAllEvents] = useState([]);
    const forceUpdate = useReducer(bool => !bool)[1];//Page refresh 


    const getAllEvents = () => {
        var events = allEvents;
        // events.forEach(element => {
        //     console.log("element: " + element)
        //     element.color === "grey"
        // });
        for (let index = 0; index < trainerObject.calender.length; index++) {
            const element = trainerObject.calender[index].event;
            // if (element) {
            //     return Object.assign({}, element, {color: 'grey'});
            //   }
            events.push(element);
            
        }
        // events.push(trainerObject.calender[0].event);
        // events.push(trainerObject.calendar.array.forEach(element => {
        //     return element.event;
            
        // }));

        const eventsToPush = events.map(event => {
            if (event) {
              return Object.assign({}, event, {color: 'lightgrey'},{title: 'Unavailable'},{summary: ''});
            } 
            return event      
          });
            
        forceUpdate();
    setAllEvents(eventsToPush);
    }


    useEffect(() => {
        getAllEvents();
    },[]);

    
    



    //Get current date
    const getCurrentDate = () => {
        var date = new Date();
        return getFullDateFormat(date);
    }


    //Format given date to our desired format
    const getFullDateFormat = (date) => {
        var day = date.getDate(); 
        var month = date.getMonth() + 1; 
        var year = date.getFullYear(); 

        day = day <10 ? "0"+day : day; 
        month = month < 9 ? "0"+(month) : (month) ; 
        return year + '-' + month + '-' + day;
    }

    const handleEventTapped = (event) => {
        // console.log(trainerObject);
        // navigation.navigate('ComingSoon');
    }

    //Handle when the user presses yes in the sign out dialog
   
    

    return(
        <SafeAreaView style={styles.safeArea}>
            <View>
                <Dialog.Container visible={dialogVisible}>
                    <Dialog.Title style={styles.dialogTitle}>Are You Sure?</Dialog.Title>
                    <Dialog.Button style={styles.cancelDialog} label="Cancel" onPress={(() => handleNoDialog())} />
                    <Dialog.Button style={styles.signOutDialog} label="Sign Out" onPress={() => handleYesDialog()} />

                </Dialog.Container>
            </View>
            <View style={styles.container}>


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
    }

});

export default ChooseDateAndTimePage;