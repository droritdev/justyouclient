import React, {useContext, useState, useEffect} from 'react';
import {
  Button,
  Text,
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
  FlatList
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

import {Accordion, Block} from 'galio-framework';
import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';

//The questions and answers content
const SECTIONS = [
  {
    title: 'Do I need to bring equipment?',
    content:
      'No. Your trainer will provide all the required equipment for the training session.',
  },
  {
    title: 'Can I train in the park?',
    content:
      'JustYou is a service that allows you to train in the comfort of your own home, at the park, at a hotel or in your office - wherever you are or plan to be.',
  },
  {
    title: 'Can I book a session at a gym?',
    content:
      'Of course. You can choose any gym or studio you want for a training session. Note that there may be an additional charge for using the complex.',
  },
  {
    title: 'If my trainer is late, do I still get the full session?',
    content:
      'Definitely. The JustYou trainer is obligated to be punctual and will always provide you with a full session. Please feel free to contact us at justyou.pro@justyou.app with any issues.',
  },
  {
    title: 'What if I need to cancel a session?',
    content:
      'Up to 24 hours in advance, you can cancel free of charge. In the case of a last minute cancellation (less than 24 hours) we charge for the session.',
  },
  {
    title: 'Can I contact my trainer before the session?',
    content:
      'Yes. You have the ability to call or chat with your trainer through the JustYou app.',
  },
  {
    title: 'Is there an easy way to rebook past trainers?',
    content: 'Yes. Just open the JustYou app and tap "Order History".',
  },
  {
    title: 'What do I do if I have an emergency during the session?',
    content: 'If you have a medical emergency, call 911 immediately.',
  }
];

//The question and answers page
const QuestionsAndAnswers = ({navigation}) => {
  //Navigates back to the star page
  const handleOnArrowPress = () => {
    navigation.navigate('StarPage');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={{width: '100%', alignItems: 'flex-start'}}>
          <ArrowBackButton onPress={handleOnArrowPress} />
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.justYouTitle}>Just You</Text>
          <Text style={styles.qA}>Q & A</Text>
        </View>
          <FlatList
            data={SECTIONS}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(itemData) => (
              <View style={{marginTop: 10}}>
                <Text>{itemData.item.title}</Text>
                <Text style={{color: 'deepskyblue'}}>{itemData.item.content}</Text>
              </View>
            )}
            contentContainerStyle={{width: '90%', paddingBottom: 120}}
          />
          {/* <Block style={styles.block}>
            <Accordion
              dataArray={SECTIONS}
              opened={null}
              listStyle={{
                width: Dimensions.get('window').width * 0.95,
              }}
              style={{
                width: Dimensions.get('window').width,
                backgroundColor: 'white',
                borderRadius: 0,
              }}
              headerStyle={{
                marginTop: 5,
              }}
              contentStyle={{
                color: 'deepskyblue',
              }}
            />
          </Block> */}
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
    flexDirection: 'column',
    height: Dimensions.get('window').height,
    alignItems: 'center'
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
    marginTop: 20,
    marginBottom: 10
  },
  justYouTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 30,
  },
  qA: {
    color: 'deepskyblue',
    fontWeight: 'bold',
    fontSize: 25,
  },
  acordionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  block: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default QuestionsAndAnswers;
