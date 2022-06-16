import React from 'react';
import {View, Image, StyleSheet, AsyncStorage} from 'react-native';
import { useFonts } from 'expo-font';
import {auth} from '../config/config.js';

const Splashscreen = ({navigation}) => {

  useFonts({
    'Montserrat-Black': require('../config/fonts/Montserrat-Black.ttf'),
    //'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),
  });

  setTimeout(()=>{
    auth.onAuthStateChanged((user) => {
      if (user) {
          navigation.navigate('MainContainer');
      } else {
        navigation.navigate('Onboard');
      }
    })
  },3000);

  return (
    <View style={styles.container}>
      <Image style source= {require('../assets/StuBid-Logo-Original-ver.png')} /> 
    </View>
    
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
})

export default Splashscreen
