import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Image, TextInput, Dimensions} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FlipToggle from 'react-native-flip-toggle-button';
import Dialog from "react-native-dialog";

//Here the user enters his payment methods and grante the app policy
const PaymentsAndPolicy = ({navigation}) => {
    const [cardNumber, setCardNumber] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [cardExpiration, setCardExpiration] = useState("");
    const [isAccepted, setIsAccepted] = useState(true);
    const [isAllfieldsFilled, setIsAllfieldsFilled] = useState(false);
    const [paymentsErrorText, setPaymentsErrorText] = useState("");
    const [visible, setDialogVisible] = useState(false);

    //Navigates back to the ProfileDetailsPage2
    const handleArrowButton = () => {
        navigation.navigate('ProfileDetailsPage2');
    }

    //Sets the card number object to the value
    const handleOnChangeCardNumber = (value) => {
        setPaymentsErrorText(false);
        setCardNumber(value);
    }

    //Sets the card cvv object to the value
    const handleOnChangeCardCvv = (value) => {
        setPaymentsErrorText(false);
        setCardCvv(value);
    }

    //Sets the card expiration object to the value
    const handleOnChangeCardExpiration = (value) => {
        setPaymentsErrorText(false);
        setCardExpiration(value);
    }

    //Handle when flipToggle value changes
    const handleFlipToggleChange = (value) => {
        setPaymentsErrorText(false);
        setIsAccepted(value);
    }

    //Handle when user press ok in the dialod, then close it
    const handleOk = () => {
        setDialogVisible(false);
    };

    //Handle the approve button when pressed, if ok - navigates to RegisteringAccountPopUp
    const handleApprove = () => {
        if(cardNumber === "" && cardCvv === "" && cardExpiration === ""){
            setIsAllfieldsFilled(false);
            setPaymentsErrorText("Please fill all the fields");
        }
        else if(cardNumber === "" || cardCvv === "" || cardExpiration === ""){
            setIsAllfieldsFilled(false);
            setPaymentsErrorText("Please fill all the fields");
        }
        else if(!(Number(cardNumber)) || !(Number(cardCvv)) || !(Number(cardExpiration))){
            setIsAllfieldsFilled(false);
            setPaymentsErrorText("Enter digits only");
        }
        else if(!isAccepted){
            setIsAllfieldsFilled(true);
            setDialogVisible(true);
        }
        else{
            setIsAllfieldsFilled(true);
            setDialogVisible(false);
            setPaymentsErrorText(""); 
            navigation.navigate('RegisteringAccountPopUp');
        }
    }

    return(
        <View style={styles.container}>
            <View>
                <Dialog.Container visible={visible}>
                    <Dialog.Title>Attention</Dialog.Title>
                    <Dialog.Description style={{fontSize: 15}}>Permissions are required to continue</Dialog.Description>
                    <Dialog.Button label="OK" onPress={handleOk} />
                </Dialog.Container>
            </View>
            <TouchableOpacity
                onPress={handleArrowButton}
            >
            <Image
                source={require('../images/arrowBack.png')}
                style={styles.arrowImage}
            />
            </TouchableOpacity>
            <Text style={styles.profileDetailesText}>Profile Details</Text>
            <View style={styles.paymentFormContainer}>
                <Text style={styles.paymentTitle}>
                    ADD FORM OF PAYMENT:
                </Text>
                <TextInput
                    style={styles.cardInput}
                    textAlign='center'
                    placeholder='ENTER YOUR CREDIT CARD INFORMATION'
                    placeholderTextColor='black'
                    onChangeText={value => handleOnChangeCardNumber(value)}
                />
                <TextInput
                    style={styles.cardInput}
                    textAlign='center'
                    placeholder='CVV'
                    placeholderTextColor='black'
                    onChangeText={value => handleOnChangeCardCvv(value)}
                />
                <TextInput
                    style={styles.cardInput}
                    textAlign='center'
                    placeholder='EXPIRATION'
                    placeholderTextColor='black'
                    onChangeText={value => handleOnChangeCardExpiration(value)}
                />
            { !isAllfieldsFilled ? 
                <Text style={styles.paymentFormErrorText}>{paymentsErrorText}</Text>                
            :null}
            </View>
            <View style={styles.policyContainer}>
                <View style={styles.policyTextAndFlipToggle}>
                    <Text style={styles.policyText}>
                        I have read and agree with the user terms of service and I understand that my personal data will be processed in accordance with Just You privacy statment.
                    </Text>
                    <View style={styles.flipToggle}>
                        <FlipToggle
                            value={isAccepted}
                            buttonHeight={30}
                            buttonWidth={70}
                            buttonRadius={40}
                            sliderWidth={35}
                            sliderHeight={30}
                            sliderRadius={50}
                            sliderOffColor={'black'}
                            sliderOnColor={'white'}
                            buttonOffColor={'grey'}
                            buttonOnColor={'deepskyblue'}
                            onToggle={(newState) => handleFlipToggleChange(newState)}
                        />
                    </View>
                </View>
                <View style={styles.readMoreContainer}>
                    <TouchableOpacity
                        //onPress={}
                    >
                        <Image
                            source={require('../images/moreInformation.jpg')}
                            style={styles.moreInformationImage}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        //onPress={}
                    >
                        <Text style={styles.readMoreText}>
                            Read more
                        </Text>

                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.nextButtonContainer}>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleApprove}
                >
                    <Text style={styles.nextButtonText}>APPROVE</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        flexDirection: 'column'
    },
    headerContainer: {
        flexDirection: 'row',
        marginTop:30,
        marginLeft: 20
      },
    arrowImage: {
        marginTop: 60,
        marginLeft: 20
    },
    profileDetailesText: {
        marginLeft: 30,
        marginTop: 20,
        fontWeight: 'bold',
        fontSize: 38
    },
    paymentFormContainer:{
        marginTop: 50,
        height: 265
    },
    paymentTitle: {
        fontSize: 17,
        marginLeft: 20
    },
    cardInput: {
        width: Dimensions.get('window').width * .95,
        height: Dimensions.get('window').height * .06,
        borderWidth: 3,
        borderColor: 'deepskyblue',
        borderRadius: 30,
        alignSelf: 'center',
        fontSize: 15,
        marginTop: 20
    },
    paymentFormErrorText: {
        color: 'red',
        alignSelf: 'center',
        fontSize: 20,
        marginTop: 15
    },
    policyContainer: {
        marginTop: 50,
        marginLeft: 10,
        justifyContent: 'space-between',
        height: Dimensions.get('window').height * .19,
    },
    policyTextAndFlipToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Dimensions.get('window').width * .95,
        alignSelf: 'center'
    },  
    policyText: {
        width: Dimensions.get('window').width * .77,
        fontWeight: 'bold',
        fontSize: 20
    },
    flipToggle: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    readMoreContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Dimensions.get('window').width * .325,
        marginLeft: 10        
    },
    readMoreText: {
        color: 'deepskyblue',
        fontWeight: 'bold',
        fontSize: 18,
        alignSelf: 'flex-end',
        marginTop: 2.5
    },
    moreInformationImage: {
        height: Dimensions.get('window').height * .0325,
        width: Dimensions.get('window').width * .075
    },
    nextButtonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 40,
        marginTop: 40,
        alignItems: 'center'
    },
    nextButton: {
        width: Dimensions.get('window').width * .9,
        height: Dimensions.get('window').height * .065,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'deepskyblue',
        borderRadius: 20
    },
    nextButtonText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    }
});

export default PaymentsAndPolicy;