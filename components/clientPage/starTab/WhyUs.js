import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';

//Why us page
const WhyUs = ({navigation}) => {
  //Navigates back to the star page
  const handleOnArrowPress = () => {
    navigation.navigate('StarPage');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../../images/Q&As.jpg')}
        style={styles.coverImage}>
        <ArrowBackButton onPress={handleOnArrowPress} />
      </ImageBackground>
      <View style={styles.headerContainer}>
      <Text style={styles.juustYouTitle}>Just You</Text>
        <Text style={styles.headerTitle}>Why you should order</Text>
      </View>
      <View style={styles.reasonsContainer}>
        <View style={{marginBottom: 30}}>
        <Text style={styles.reasonsPreview}>
          Five reasons why you should order from Just You:
        </Text>
        </View>
        <View style={styles.reasonRow}>
          <Image
            source={require('../../../images/whyUsBlowVi.png')}
            style={styles.viImage}
          />
          <Text style={styles.reasonText}>
            Easy and quick search for personal trainer
          </Text>
        </View>
        <View style={styles.reasonRow}>
          <Image
            source={require('../../../images/whyUsBlowVi.png')}
            style={styles.viImage}
          />
          <Text style={styles.reasonText}>
            Wide selection of personal trainers by category
          </Text>
        </View>
        <View style={styles.reasonRow}>
          <Image
            source={require('../../../images/whyUsBlowVi.png')}
            style={styles.viImage}
          />
          <Text style={styles.reasonText}>
            Possibility of setting personal training ad hoc with no restriction
            to any location
          </Text>
        </View>
        <View style={styles.reasonRow}>
          <Image
            source={require('../../../images/whyUsBlowVi.png')}
            style={styles.viImage}
          />
          <Text style={styles.reasonText}>Fast and easy payment</Text>
        </View>
        <View style={styles.reasonRow}>
          <Image
            source={require('../../../images/whyUsBlowVi.png')}
            style={styles.viImage}
          />
          <Text style={styles.reasonText}>
            Quick synchronization of the training date with your personal
            calendar
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
  },
  coverImage: {
    height: Dimensions.get('window').height * 0.3,
    width: Dimensions.get('window').width,
  },
  arrowImage: {
    marginLeft: 20,
    marginTop: 20,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'deepskyblue'
  },
  juustYouTitle: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'black',
  },
  reasonsPreview: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  reasonsContainer: {
    marginTop: 20,
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.275,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  reasonRow: {
    flexDirection: 'row',
    width: Dimensions.get('window').width * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  viImage: {
    marginRight: 30,
  },
  reasonText: {
    fontSize: 15,
    width: Dimensions.get('window').width * 0.8,
  },
});

export default WhyUs;
