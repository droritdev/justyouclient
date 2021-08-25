import React from 'react';
import {
  Button,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';

//The Coming Soon page for pages "in build"
const ComingSoon = ({navigation}) => {
  //Navigates back to the star page
  const handleOnArrowPress = () => {
    navigation.navigate('StarPage');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Just You</Text>
        </View>
        <ArrowBackButton onPress={handleOnArrowPress} />
        <View style={styles.mainContainerView}>
          <View style={styles.mainContainer}>
            <View style={styles.comingSoonTitle}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
            <View>
              <Text style={styles.detailsText}>
                This page is under construction
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
  },
  container: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  header: {
    alignSelf: 'center',
    marginTop: 10
  },
  headerText: {
    fontSize: Dimensions.get('window').height * 0.04,
    fontWeight: 'bold',
  },
  arrowImage: {
    marginLeft: 20,
    marginTop: 20,
  },
  mainContainerView: {
    height: '75%',
    justifyContent: 'center',
  },
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  comingSoonImage: {},
  comingSoonTitle: {},
  comingSoonText: {
    fontWeight: 'bold',
    fontSize: 40,
  },
  detailsText: {
    fontSize: 20,
  },
});

export default ComingSoon;
