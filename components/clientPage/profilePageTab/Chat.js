import React, {useContext, useState, useEffect, useCallback} from 'react';
import {Alert, ActivityIndicator, Text, View, SafeAreaView, Image, StyleSheet, Dimensions} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';
import { GiftedChat, Bubble, SystemMessage, InputToolbar, Actions, ActionsProps} from 'react-native-gifted-chat'
// import {IdContext} from '../../../../context/trainerContextes/IdContext';
// import {NameContext} from '../../../../context/trainerContextes/NameContext';
// import {MediaContext} from '../../../../context/trainerContextes/MediaContext';
import {ClientContext} from '../../../context/ClientContext';

import MapView, { Marker } from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Feather';
import * as Progress from 'react-native-progress';
import ImagePicker from 'react-native-image-crop-picker';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
import Video from 'react-native-video';

const Chat = ({navigation, route}) => {

    const [messages, setMessages] = useState([]);
    const [trainerUser, setTrainerUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    //trainer ID from previous page
    const {trainerID} = route.params;



    //Client Info:
    const {clientObject} = useContext(ClientContext);
    const clientID = clientObject._id;



    //Information of the trainer
    const clientUser = {
        _id: clientObject._id,
        name: clientObject.name.first + ' ' + clientObject.name.last,
        avatar: clientObject.image,
    };


    const config = {
        withCredentials: true,
        baseURL: 'https://justyou.iqdesk.info:443/',
        headers: {
          "Content-Type": "application/json",
        },
    };



    //Show bottom navgation UI
    const handleArrowButton = () => {
        navigation.navigate('PendingApprovalOrderDetails');
    }



    //Render all styles for the messages
    const renderBubble = (props) => {
        const {currentMessage} = props;
        if(currentMessage.location) {
            return <LocationView location={currentMessage.location} />
        }

        return (
            <Bubble
            {...props}
            wrapperStyle={{
                left: {
                backgroundColor: '#FCFCFC',
                },
                right: {
                backgroundColor: '#3399FF',
                }
            }}
            />
        );
    }

    //Render custom view to display video in the chat
    const renderMessageVideo = (props) => {
        const {currentMessage} = props;
        return (
            <Video
                muted={true}
                resizeMode="cover"
                controls={true}
                source={{uri: currentMessage.video}}
                style={styles.video}
                key={currentMessage._id}
            />
        );
    };



    //Loading effect when chat window is loaded
    const renderLoading = () => {
        return (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size='large' color='#6646ee' />
            </View>
          );
    }



    //Message if chat is empty
    const renderSystemMessage = (props) => {
        return (
            <SystemMessage
              {...props}
              wrapperStyle={styles.systemMessageWrapper}
              textStyle={styles.systemMessageText}
            />
          );
    }


    //Bottom input toolbar
    const renderInputToolbar = (props) => {
        return (
                <InputToolbar
                {...props}
                containerStyle={{
                    borderTopWidth: 0,
                    borderRadius: 45
                }}
                />
            );
    }



    //Custom view to display location
    const LocationView = ({location}) => {
        return <MapView style={{height: 250, width: 250}}
        region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
        }}
        scrollEnabled={false}
        zoomEnabled={true}
        >
        <Marker
            coordinate={{latitude: location.latitude, longitude: location.longitude}}
            title={'location'}
            pinColor = {'red'}
        />
     </MapView>
    }



    //Send the user current location
    const sendCurrentPosition = () => {
        if (!isLoading) {
            Geolocation.getCurrentPosition(info => {
                let newLocationMessage =
                [
                    {
                        _id: 'Date: ' + new Date() +'  location: ' + info.coords.latitude + ', ' + info.coords.longitude,
                        text: 'My location',
                        createdAt: new Date(),
                        user: clientUser,
                        location: {
                        latitude: info.coords.latitude,
                        longitude: info.coords.longitude,
                        }
                    }
                ];

                onSend(newLocationMessage).done();
            });
        }
    }


    //Show location sharing verification alert
    const showSendLocationAlert = () => {
        Alert.alert(
            'Share location',
            'Would you like to share your current location?',
            [
                {text: 'Cancel'},
                {text: 'Share', onPress: () => sendCurrentPosition()},
              ],
              { cancelable: false }
        )
    }


    //Open picker for user to select image/video to send
    const handleMediaPicker =  () => {
        ImagePicker.openPicker({
          }).then((file) => {
            let fileMime = file.mime.split('/')[0];
            let fileName = file.filename;
            let source = {};
            console.log(fileName);
            console.log(fileMime);

            switch (fileMime) {
                case "image" :
                    source = {uri: "file://"+file.path};
                break;

                case "video":
                    source = {uri: file.sourceURL};
                break;
            }


            uploadMedia(fileMime, fileName, source).done();

        }).catch(err => {
            //user cancel the picker
        });
    }



    //Upload selected image/video to database
    const uploadMedia = async (fileMime, fileName, source) => {
        console.log("uploading");
        const userRef = "/clients/" + auth().currentUser.uid + "/messagesMedia/";
        let ref = storage().ref(userRef+ fileName);

        await ref.putFile(source.uri).then((snapshot) => {
            console.log("upload done");
        })
          .catch((e) => console.log("fail"));

        await ref.getDownloadURL().then((url) => {
            console.log("download done");
            sendMediaMessage(fileMime, url);
        })
        .catch((e) => console.log("fail"));
    }



    //Send a message that contains a video/image
    const sendMediaMessage = async (fileMime, url) => {
        let newMessage = [];

        switch (fileMime) {
            case "image" :
                newMessage =
                [{
                    _id: uuid.v4(),
                    text: '',
                    createdAt: new Date(),
                    user: clientUser,
                    image: url
                }];
            break;

            case "video":
                newMessage =
                [{
                    _id: uuid.v4(),
                    text: '',
                    createdAt: new Date(),
                    user: clientUser,
                    video: url
                }];
            break;
        }

        await onSend(newMessage);
    }



    useEffect(() => {
        getTrainerInfo().done();
        console.log(trainerID)
        console.log(clientUser)
        console.log(clientID)

        watchForUpdates().done();
    }, [])



    //Listener to mongodb to check if a new message was sent
    //Update UI and display the new message that was sent
    const watchForUpdates = async () => {
        let message = [];
        await axios

            .get('/messages/watchForUpdates/'+clientID, config)
            .then((doc) => {
                message = doc.data;
                if (message) {
                    setTimeout(() => watchForUpdates(), 1000);
                }
            })
            .catch((err) => {});
        setMessages(previousMessages => GiftedChat.append(previousMessages, message));

    }





    //Retrive all the trainer information by ID
    //And generate a trainerUser object with id, name, avatar
    const getTrainerInfo = async () => {
        await axios
         .get('/trainers/id/'+trainerID,
         config
         )
         .then((doc) => {
             let trainerObject = doc.data;

             let trainerInfo = {
                 _id: trainerObject._id,
                 name: trainerObject.name.first + ' ' + trainerObject.name.last,
                 avatar: trainerObject.media.images[0],
             };

         setTrainerUser(trainerInfo);
         getChatMessages(clientObject);
         })
         .catch((err) => {

         });
     }




    //Retrive all the chat messages by clientID and trainerID
    //Load all messages on the UI
    const getChatMessages = async () => {
        //Sender: client, Receiver: trainer
        let firstResult = [];
        //Sender: trainer, Receiver: client
        let secondResult = [];
        //Both results combined
        let finalResult = [];

        //Get all messages by - Sender: trainer, Receiver: client  - and assign result to a var
        await axios
        .get('/messages/findMessageByIDS/'+trainerID+'@'+clientID,
            config
            )
            .then((doc) => {
                firstResult = doc.data;
            })
            .catch((err) => {
            });

        //Get all messages by - Sender: client, Receiver: trainer  - and assign result to a var
        await axios
        .get('/messages/findMessageByIDS/'+clientID+'@'+trainerID,
            config
            )
            .then((doc) => {
                secondResult = doc.data;
            })
            .catch((err) => {
            });


        //Check if first result is undefined
        if(firstResult !== undefined) {
            finalResult = [...finalResult, ...firstResult];
        }

        //Check if second result is undefined
        if(secondResult !== undefined) {
            finalResult = [...finalResult, ...secondResult];
        }

        //All messages model relaeted to both
        finalResult = sortMessages(finalResult);

        //Extract the message object from the model and insert into a messages array
        let allMessages = [];
        for (let index = 0; index < finalResult.length; index++) {
            const singleMessageObject = finalResult[index].message;
            allMessages[index] = singleMessageObject;

        }

        //Check if there are no messages
        if (allMessages.length===0) {
            //Show friendly system message
            let systemMessage = {
                _id: 'system',
                text: "Start chating, it's free!",
                createdAt: new Date(),
                system: true,
            };

            setMessages([systemMessage])
            setIsLoading(false);
        } else {
            //Show all messages
            setMessages(allMessages);
            setIsLoading(false);
        }
    }




    //Sort messages by time created
    const sortMessages = (messagesArray) => {
        // Iterate Over Array From First Element
        for (let i = 0; i < messagesArray.length; i++) {
            // Iterate Over Array From Succeeding Element
            for (let j = 1; j < messagesArray.length; j++) {
                //checks the time order was created at
                let first = new Date(messagesArray[j - 1].message.createdAt).getTime();
                let second = new Date(messagesArray[j].message.createdAt).getTime();
                if (first < second) {
                    // Swap Numbers
                    swapNumbers(messagesArray, j - 1, j);
                }
            }
        }
        return messagesArray;
    }


    const swapNumbers = (array, i, j) => {
        // Save Element Value (Because It Will Change When We Swap/Reassign)
        let temp = array[i];
        // Assign Element2 To Element1
        array[i] = array[j];
        // Assign Element1 To Element2
        array[j] = temp;
    };


    //Upload new message to mongodb
    //Update UI to show new message
    const onSend = useCallback(async (sentMessages = []) => {
        let newMessage = sentMessages[0];
        let messageText = newMessage.text;
        console.log(sentMessages);
        //Check if the message is a phone number
        let phoneFormat = /^[+]*[(]?[0-9]{1,3}[)]?[-\s\./0-9]*$/g
        if(phoneFormat.test(messageText)){
            Alert.alert(
                'Attention',
                'The system has recognized that you have sent a phone number. \n You are able to make a phone call within the app.',
                [
                    {text: 'OK'},
                  ],
                  { cancelable: false }
                )
        } else {
            //Upload message to database
            await axios
            .post('/messages/newMessage', {
                receiver: trainerID,
                sender: clientID,
                message: newMessage,
            },
            config
            )
            .then((res) => {
                if (res.data.status === 'success') {
                    if(messages.length === 0) {
                        getChatMessages();
                    } else {
                        setMessages(previousMessages => GiftedChat.append(previousMessages, sentMessages));
                    }
                }
            })
            .catch((err) => {
                Alert.alert(
                    'Network error',
                    'Please check your internet connection.',
                    [
                        {text: 'OK'},
                      ],
                      { cancelable: false }
                    )
            });
        }
      }, [])



    return(
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View style={styles.headerContainer}>
                    <ArrowBackButton
                        onPress={handleArrowButton}
                    />
                    <Text style={styles.headerText}> {trainerUser.name} </Text>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity
                         onPress={()=> handleMediaPicker()}
                        >
                            <Icon name="camera" size={24} style={styles.cameraIcon}/>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={()=> showSendLocationAlert()}
                        >
                            <Icon name="map-pin" size={24} style={styles.locationIcon} />
                        </TouchableOpacity>
                    </View>
                </View>


                {isLoading?
                <View>
                    <View style={styles.progressView}>
                        <Progress.Circle size={Dimensions.get('window').height * .10} indeterminate={true} />
                    </View>
                </View>
            :
                <View style={{ flex: 1 }}>
                    <GiftedChat
                        messages={messages}
                        onSend={sentMessages => onSend(sentMessages)}
                        user={clientUser}
                        infiniteScroll={true}
                        renderUsernameOnMessage={true}
                        showUserAvatar={true}
                        showAvatarForEveryMessage={true}
                        alwaysShowSend={true}
                        scrollToBottom={true}
                        renderBubble={renderBubble}
                        renderLoading={renderLoading}
                        renderSystemMessage={renderSystemMessage}
                        renderInputToolbar={renderInputToolbar}
                        renderMessageVideo={renderMessageVideo}

                    />
                </View>
            }
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fafafa',
        height: 40
    },
    headerText: {
        marginTop: Dimensions.get('window').height * .012,
        fontSize: Dimensions.get('window').height * .02,
        fontWeight: '500'
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    systemMessageText: {
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold'
    },
    locationIcon: {
        marginTop: Dimensions.get('window').height * .012,
        marginRight: Dimensions.get('window').width * .05,
        width: Dimensions.get('window').width * .060,
        height: Dimensions.get('window').height * .04,
    },
    loadingTextView: {
        alignSelf: 'center',
        marginTop: Dimensions.get('window').height * .020
    },
    progressView: {
        marginTop: Dimensions.get('window').height * .4,
        alignItems: 'center'
    },
    cameraIcon: {
        marginTop: Dimensions.get('window').height * .011,
        marginRight: Dimensions.get('window').width * .05,
        width: Dimensions.get('window').width * .070,
        height: Dimensions.get('window').height * .040,
    },
    sendIcon: {
        width: Dimensions.get('window').width * .060,
        height: Dimensions.get('window').height * .025,
        marginBottom: Dimensions.get('window').height * .012,
        marginRight: Dimensions.get('window').width * .05,
    },
    bottomIconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    video: {
        height: Dimensions.get('window').height * .12,
        width: Dimensions.get('window').width * .37,
    },

});

export default Chat;
