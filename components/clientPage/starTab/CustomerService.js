import React, {useContext, useState, useEffect} from 'react';
import { Button, Text, View, SafeAreaView, Image, StyleSheet, Dimensions, ImageBackground, TextInput} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Dialog from "react-native-dialog";

//The question and answers page
const CustomerService = ({navigation}) => {
    const mailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    const [bccInput, setBccInput] = useState("");
    const [subjectInput, setSubjectInput] = useState("");
    const [mailInput, setMailInput] = useState("");

    const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
    const [sendDialogVisible, setSendDialogVisible] = useState(false);

    const handleOnCancelPressed = () => {
        setCancelDialogVisible(true);
    };

    const handleCancelYesDialog = () => {
        setCancelDialogVisible(false);
        navigation.navigate('StarPage');
    };

    const handleCancelNoDialog = () => {
        setCancelDialogVisible(false);
    };

    const handleSendOkDialog = () => {
        setSendDialogVisible(false);
    };

    const handleOnSendEmailPressed = () => {
        if(subjectInput === ""){
            setSendDialogVisible(true);
        }
        else if(mailInput === ""){
            setSendDialogVisible(true);
        }
        else if(bccInput !== ""){
            if(!(mailformat.test(bccInput))){
                setSendDialogVisible(true);
            }
        }
        else{
            sendEmail();
        }
    };

    const handleOnBccInputChange = (text) => {
        setBccInput(text);
    };

    const handleOnSubjectChange = (text) => {
        setSubjectInput(text);
    };

    const handleOnMailInputChange = (text) => {
        setMailInput(text);
    };

    const sendEmail = () => {
        navigation.navigate('StarPage');
    }

    return(
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View>
                    <Dialog.Container visible={cancelDialogVisible}>
                        <Dialog.Title style={styles.dialogTitle}>Attention</Dialog.Title>
                        <Dialog.Description style={styles.dialogContent}>Mail was not sent - are you sure?</Dialog.Description>
                        <Dialog.Button label="No" onPress={(() => handleCancelNoDialog())} />
                        <Dialog.Button label="Yes" onPress={() => handleCancelYesDialog()} />

                    </Dialog.Container>
                </View>
                <View>
                    <Dialog.Container visible={sendDialogVisible}>
                        <Dialog.Title style={styles.dialogTitle}>Attention</Dialog.Title>
                        <Dialog.Description style={styles.dialogContent}>Not all field are correct, email can not be sent</Dialog.Description>
                        <Dialog.Button label="Ok" onPress={(() => handleSendOkDialog())} />

                    </Dialog.Container>
                </View>
                <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => handleOnCancelPressed()}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <View style={styles.titleAndButtonContainer}>
                    <View style={styles.titleAndButtonRow}>
                        <Text style={styles.titleText}>Just You</Text>
                        <TouchableOpacity
                            onPress={() => handleOnSendEmailPressed()}
                        >
                            <Image
                                source={require('../../../images/emailSendIcon.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.emailHeaders}>
                    <View style={styles.headerContainer}>
                        <View style={styles.headerRow}>
                            <Text style={styles.emailHeader}>To: </Text>
                            <Text style={styles.companyEmail}>justyou@gmail.com</Text>
                        </View>
                    </View>
                    <View style={styles.headerContainer}>
                        <View style={styles.headerRow}>
                            <Text style={styles.emailHeader}>Cc/Bcc: </Text>
                            <TextInput
                                style={styles.headerInput}
                                onChangeText={(text) => handleOnBccInputChange(text)}
                            />
                        </View>
                    </View>
                    <View style={styles.headerContainer}>
                        <View style={styles.headerRow}>
                            <Text style={styles.emailHeader}>Subject: </Text>
                            <TextInput
                                style={styles.headerInput}
                                onChangeText={(text) => handleOnSubjectChange(text)}
                            />
                        </View>
                    </View>
                    <View style={styles.emailContentContainer}>
                        <TextInput
                            style={styles.emailContentInput}
                            placeholder="Type your text here..."
                            multiline={true}
                            onChangeText={(text) => handleOnMailInputChange(text)}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}   

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: Dimensions.get('window').height 
    },
    cancelButton: {
        marginLeft: 20,
        marginTop: 15
    },
    cancelButtonText: {
        color: 'deepskyblue',
        fontSize: 20
    },
    titleAndButtonContainer: {
        width: Dimensions.get('window').width * .9 ,
        alignSelf: 'center',
        marginTop: 20
    },
    titleAndButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Dimensions.get('window').width * .9 ,
        alignItems: 'center'
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 25
    },
    emailHeaders: {
        marginTop: 30
    },
    headerContainer: {
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
        height: 45,
        justifyContent: 'center'
    },
    headerRow: {
        flexDirection: 'row',
        marginLeft: 20
    },
    emailHeader: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    companyEmail: {
        color: 'deepskyblue',
        fontSize: 20
    },
    headerInput: {
        fontSize: 20,
    },
    emailContentContainer: {
        marginLeft: 20,
        marginTop: 20,
        width: Dimensions.get('window').width * .9
    },  
    emailContentInput: {
        fontSize: 20
    },
    dialogTitle: {
        fontWeight: 'bold',
        fontSize: 20
    },
    dialogContent: {
        fontSize: 18
    }
});

export default CustomerService;