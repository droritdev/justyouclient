import React, {useState} from 'react';
import { Button, Text, View, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import PickCategories from '../../GlobalComponents/PickCategories';

const categoriesData = [
    { id: 1, label: 'HIT' },
    { id: 2, label: 'KIK BOX' },
    { id: 3, label: 'MARTIAL ARTS' },
    { id: 4, label: 'PILATIS' },
    { id: 5, label: 'CLIMBING' },
    { id: 6, label: 'TRX' },
    { id: 7, label: 'DANCING' },
    { id: 8, label: 'SWIMMING' },
    { id: 9, label: 'RUNNING' }
];

//The claint's search page
const SearchPage = ({navigation}) => {

    const [selectedItems, setSelectedItems] = useState([]);
    const [items, setItems] = useState(categoriesData);

    //When the user chooses category it whill be displayed on the input bellow
    const handleOnItemPress = (item) => {
        if(selectedItems.includes(item.label)){
            let index = selectedItems.indexOf(item.label);
            selectedItems.splice(index, 1);
            setSelectedItems(selectedItems.filter(element => element !== item.label));
        }
        else{
            setSelectedItems(selectedItems => [...selectedItems, item.label]);
        }
    }

    const handleOnInputChange = (text) => {
        if(text.length > 0){
            setItems(items.filter(item => item.label.toLowerCase().includes(text.toLowerCase())));
        }
        else{
            setItems(categoriesData);
        }
    }

    return(
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Just You</Text>
            </View>
            <View style={styles.searchContainer}>
                <Image
                    source={require('../../../images/searchFieldIcon.png')}
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search category"
                    onChangeText={(text) => handleOnInputChange(text)}
                />

            </View>
            <View style={styles.categoryPickerContainer}>
                <View style={styles.categorySelect}>
                    <PickCategories
                        data={items}
                        onItemPress={(item) => handleOnItemPress(item)}
                    />
                </View>
            </View>
            <Text style={styles.recentOrdersTitle}>Recent Orders</Text>
            <ScrollView>
                <View style={styles.trainerView}>
                    <View style={styles.trainerViewRow}>
                        <TouchableOpacity
                            style={styles.trainerImage}
                        >
                            <Image

                            />
                        </TouchableOpacity>
                        <View style={styles.trainerDetails}>
                            <Text style={styles.trainerDetail1}>Ivgeni Shatz</Text>
                            <Text style={styles.trainerDetail2}>Personal Trainer</Text>
                            <View style={styles.ratingRow}>
                                <Text style={styles.trainerDetail3}>8.7 </Text>
                                <Image
                                    source={require('../../../images/ratingStar.png')}
                                    
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.trainerView}>
                    <View style={styles.trainerViewRow}>
                        <TouchableOpacity
                            style={styles.trainerImage}
                        >
                            <Image

                            />
                        </TouchableOpacity>
                        <View style={styles.trainerDetails}>
                            <Text style={styles.trainerDetail1}>Koby Lamar</Text>
                            <Text style={styles.trainerDetail2}>Personal Trainer</Text>
                            <View style={styles.ratingRow}>
                                <Text style={styles.trainerDetail3}>9.1 </Text>
                                <Image
                                    source={require('../../../images/ratingStar.png')}
                                    
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.trainerView}>
                    <View style={styles.trainerViewRow}>
                        <TouchableOpacity
                            style={styles.trainerImage}
                        >
                            <Image

                            />
                        </TouchableOpacity>
                        <View style={styles.trainerDetails}>
                            <Text style={styles.trainerDetail1}>Judi Woods</Text>
                            <Text style={styles.trainerDetail2}>Personal Trainer</Text>
                            <View style={styles.ratingRow}>
                                <Text style={styles.trainerDetail3}>7.9 </Text>
                                <Image
                                    source={require('../../../images/ratingStar.png')}
                                    
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.trainerView}>
                    <View style={styles.trainerViewRow}>
                        <TouchableOpacity
                            style={styles.trainerImage}
                        >
                            <Image

                            />
                        </TouchableOpacity>
                        <View style={styles.trainerDetails}>
                            <Text style={styles.trainerDetail1}>Omer Ohana</Text>
                            <Text style={styles.trainerDetail2}>Personal Trainer</Text>
                            <View style={styles.ratingRow}>
                                <Text style={styles.trainerDetail3}>8.0 </Text>
                                <Image
                                    source={require('../../../images/ratingStar.png')}
                                    
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'white',
        height: Dimensions.get('window').height,
    },
    container: {
        backgroundColor: 'white',
        width: Dimensions.get('window').width,
    },
    header: {
        alignSelf: 'center'
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    categoryPickerContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    categorySelect: {
        width: Dimensions.get('window').width * .9,
        marginTop: 30
    },
    searchContainer: {
        flexDirection: 'row',
        height: Dimensions.get('window').height * .065,
        width: Dimensions.get('window').width * .9,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: 'lightgrey',
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 30
    },
    searchIcon: {
        height: Dimensions.get('window').height * .035,
        width: Dimensions.get('window').height * .035,
        alignSelf: 'center',
        marginLeft: 10
    },
    searchInput: {
        marginLeft: 30,
        fontSize: 20,
        alignSelf: 'center'
    },
    recentOrdersTitle: {
        marginLeft: 15,
        marginTop: 30,
        fontWeight: 'bold',
        fontSize: 20
    },
    trainerView: {
        width: Dimensions.get('window').width,
        marginLeft: 15,
        marginTop: 20
    },
    trainerViewRow: {
        flexDirection: 'row',
    },
    trainerImage: {
        height: Dimensions.get('window').height * .1,
        width: Dimensions.get('window').height * .1,
        borderRadius: 15,
        backgroundColor: 'gainsboro'
    },
    trainerDetails: {
        justifyContent: 'center',
        marginLeft: 20
    },
    trainerDetail1: {
        fontWeight: 'bold',
        fontSize: 23
    },
    trainerDetail2: {
        fontSize: 18
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    trainerDetail3: {
        fontSize: 18
    },
    ratingIcon: {

    },
});

export default SearchPage;