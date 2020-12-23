import React, {useContext, useState, useEffect} from 'react';
import { Button, Text, View, SafeAreaView, Image, StyleSheet, Dimensions, ImageBackground} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Dialog from "react-native-dialog";
import {Accordion, Block} from 'galio-framework';

//The question and answers page
const TrainerOrderPage = ({navigation}) => {

    const [dialogVisible, setDialogVisible] = useState(false);

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
        setDialogVisible(true);
    }


    return(
        <SafeAreaView style={styles.safeArea}>
            <View>
                <Dialog.Container visible={dialogVisible}>
                    <Dialog.Title style={styles.dialogTitle}>Are You Sure?</Dialog.Title>
                    <Dialog.Button style={styles.cancelDialog} label="Cancel" onPress={(() => handleNoDialog())} />
                    <Dialog.Button style={styles.sureDialog} label="Sure" onPress={() => handleYesDialog()} />

                </Dialog.Container>
            </View>
            <View style={styles.titlesContainer}>
                <Text style={styles.justYouHeader}>Just You</Text>
            </View>
            <TouchableOpacity
                    style={styles.arrowBackButton} 
                    onPress={() => handleOnArrowPress()}
                >
                <Image
                    source={require('../../../images/blackArrow.png')}
                />
            </TouchableOpacity>
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