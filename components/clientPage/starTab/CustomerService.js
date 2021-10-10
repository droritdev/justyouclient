import React, {useContext, useState, useEffect} from 'react';
import {Alert, Text, View, SafeAreaView, StyleSheet, Dimensions, TextInput} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';
import {ClientContext} from '../../../context/ClientContext';
import AppButton from '../../GlobalComponents/AppButton';
import axios from 'axios';

//The question and answers page
const CustomerService = ({navigation}) => {

    //server config
    const config = {
        withCredentials: true,
        baseURL: 'http://justyou.iqdesk.info:8081/',
        headers: {
          "Content-Type": "application/json",
        },
    };


    //Format to check if the email is in the following format:
    // just@gmail.com
    // just@gmail.com, just@gmail.com
    const mailformat = /^(|([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+([,.] (([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+)*$/;

    //Sender email
    const supportEmail = "jusyou.pro@gmail.com";

    //Client information
    const {clientObject} = useContext(ClientContext);

    //Inputs
    const [ccInput, setCcInput] = useState("");
    const [subjectInput, setSubjectInput] = useState("");
    const [mailInput, setMailInput] = useState("");

    //Error message when input validation fails
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    //Hide bottom navgation UI
    useEffect(() => {
        navigation.dangerouslyGetParent().setOptions({
            tabBarVisible: false
        })
        }, []);


    //Navigate back to trainer profile page and show the buttom navigation UI
    const handleArrowButton = () => {
        navigation.dangerouslyGetParent().setOptions({
            tabBarVisible: true
        })
    //    navigation.navigate('ProfilePage');
        navigation.goBack();
    }


    //Check validation for all inputs
    //If validationg is okay => send email to support
    const handleOnSendEmailPressed = () => {
        if(subjectInput === "") {
            setErrorMessage("Please enter a subject to your email.");
            setIsError(true);
        }
        else if(mailInput === "") {
            setErrorMessage("Please enter a message to your email.");
            setIsError(true);
        }
        else if(ccInput !== "" && !(mailformat.test(ccInput))) {
                setErrorMessage("Add cc in the following format: just@gmail.com, just@gmail.com");
                setIsError(true);
        }
        else{
            sendEmail();
        }
    };


    //Change input for the cc and remove error message
    const handleOnCcInputChange = (text) => {
        setIsError(false);
        setCcInput(text);
    };

    //Change input for the subject and remove error message
    const handleOnSubjectChange = (text) => {
        setIsError(false);
        setSubjectInput(text);
    };

    //Change input for the mail content and remove error message
    const handleOnMailInputChange = (text) => {
        setIsError(false);
        setMailInput(text);
    };




    //Send email using axios and sendgrid
    const sendEmail = async () => {
        //Information of the sender for customer service
        let senderInfo = 'Email: ' + clientObject.email +
                        '\n' + 'Name: '+ clientObject.name.first + ' ' + clientObject.name.last +  '\n \n \n';

        //Check if there is need to send a copy to anyone
        if (ccInput !== "") {
            let emailsArray = ccInput.split(", ");
            if (emailsArray.length > 0) {
                await sendEmailCopy(emailsArray);
            }
        }

        await axios
        .post('/send-email', {
            to: supportEmail,
            from: supportEmail,
            subject: subjectInput,
            text: senderInfo + mailInput,
        },
        config
        )
        .then((res) => {
            //Check if email was sent to the support
            if (res.data.status === 'success') {
                //Send automatic response
                sendAutomaticResponse();
            }
        })
        .catch((err) => {
            Alert.alert(
                'System failure',
                "Couldn't send message, please try again later.",
                [
                    {text: 'OK'},
                  ],
                  { cancelable: false }
                )
        });
    }



    //Send copy of the email to every email in the array
    const sendEmailCopy = async (emailArray) => {
        await axios
        .post('/send-email', {
            to: emailArray,
            from: supportEmail,
            subject: subjectInput,
            text: mailInput,
        },
        config
        )
        .then((res) => {
            //Check if the copy was sent to the specified email address
            if (res.data.status === 'success') {
            }
        })
        .catch((err) => {
            Alert.alert(
                'System failure',
                "Couldn't send message, please try again later.",
                [
                    {text: 'OK'},
                ],
                { cancelable: false }
                )
        });
    }



    //Send automatic email response to the trainer
    const sendAutomaticResponse = async () => {
        await axios
        .post('/send-automatic-response', {
            to: clientObject.email,
            from: supportEmail,
            name: clientObject.name.first
        },
        config
        )
        .then((res) => {
            //Check if the automatic response message was sent successfully.
            if (res.data.status === 'success') {
                Alert.alert(
                    'Success',
                    'Your email has been sent!',
                    [
                        {text: 'OK', onPress: () => handleArrowButton()},
                      ],
                      { cancelable: false }
                )
            }
        })
        .catch((err) => {

        });
    }



    return(
        <SafeAreaView style={styles.container}>
            <ArrowBackButton
                    onPress={handleArrowButton}
            />
            <View >
                <Text style={styles.titleText}>JustYou Support</Text>
                <View style={styles.greyBorder}></View>
            </View>
            <View style={styles.emailHeaders}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerRow}>
                        <Text style={styles.emailHeader}>To: </Text>
                        <Text style={styles.companyEmail}> {supportEmail}</Text>
                    </View>
                </View>
                <View style={styles.headerContainer}>
                    <View style={styles.headerRow}>
                        <Text style={styles.emailHeader}>Cc: </Text>
                        <TextInput
                            style={styles.headerInput}
                            placeholder={"just@gmail.com, you@hotmail.com"}
                            onChangeText={(text) => handleOnCcInputChange(text)}
                        />
                    </View>
                </View>
                <View style={styles.headerContainer}>
                    <View style={styles.headerRow}>
                        <Text style={styles.emailHeader}>Subject: </Text>
                        <TextInput
                            style={styles.headerInput}
                            placeholder={"Question about.."}
                            onChangeText={(text) => handleOnSubjectChange(text)}
                        />
                    </View>
                </View>
            </View>

                <ScrollView>
                    <View style={styles.emailContentContainer}>
                        <TextInput
                            style={styles.emailContentInput}
                            placeholder={"Hello " + clientObject.name.first + ", we are here to help! \nWrite your message here..."}
                            multiline={true}
                            onChangeText={(text) => handleOnMailInputChange(text)}
                        />
                    </View>
            </ScrollView>

            {isError ?
            <Text style={styles.errorText}>{errorMessage}</Text>
            :null}

            <AppButton
              title="Send"
              onPress={handleOnSendEmailPressed}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: Dimensions.get('window').height
    },
    cancelButton: {
        marginLeft: Dimensions.get('window').width * .0483,
        marginTop: Dimensions.get('window').height * .018
    },
    cancelButtonText: {
        color: 'deepskyblue',
        fontSize: Dimensions.get('window').height * .022
    },
    titleAndButtonContainer: {
        width: Dimensions.get('window').width * .9 ,
        alignSelf: 'center',
        marginTop: Dimensions.get('window').height * .022
    },
    titleAndButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Dimensions.get('window').width * .9 ,
        alignItems: 'center'
    },
    titleText: {
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: Dimensions.get('window').height * .0278
    },
    emailHeaders: {
        marginTop: Dimensions.get('window').height * .033
    },
    headerContainer: {
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
        height: Dimensions.get('window').height * .06,
        justifyContent: 'center'
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: Dimensions.get('window').width * .0483
    },
    emailHeader: {
        fontSize: Dimensions.get('window').height * .022,
        fontWeight: 'bold'
    },
    companyEmail: {
        color: 'deepskyblue',
        fontSize: Dimensions.get('window').height * .022
    },
    headerInput: {
        fontSize: Dimensions.get('window').height * .022,
    },
    emailContentContainer: {
        marginLeft: Dimensions.get('window').width * .0483,
        marginTop: Dimensions.get('window').height * .022,
        width: Dimensions.get('window').width * .9
    },
    emailContentInput: {
        fontSize: Dimensions.get('window').height * .022
    },
    dialogTitle: {
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .022
    },
    dialogContent: {
        fontSize: Dimensions.get('window').height * .02
    },
    errorText: {
        marginBottom: Dimensions.get('window').height * .015,
        textAlign:'center',
        color: 'red',
        fontSize: Dimensions.get('window').height * .022,
    },
    greyBorder: {
        marginTop: Dimensions.get('window').height * .01,
        alignSelf: 'center',
        width: Dimensions.get('window').width * .6,
        borderTopWidth: 3,
        borderTopColor: 'lightgrey',
    },
});

export default CustomerService;
