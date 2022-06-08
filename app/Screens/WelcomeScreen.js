import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../config/colors.js';

const WelcomeScreen = ({navigation}) => {

    return (
        <View style={styles.container}>
          <Image style = {styles.logo} source= {require('../assets/StuBid-Logo-Original-ver.png')} resizeMode = "contain"/> 
          <Text style={styles.title}> 
           Welcome to StuBid!
          </Text>
          <Image style = {styles.image} source= {require('../assets/WelcomeSlide/WelcomePage.png')} resizeMode = "contain" /> 
          <Text style={styles.text}> 
           Buy or auction off any products at anyplace, anytime for all university students in Singapore through an anonymous bidding system.
          </Text>
          
        <TouchableOpacity style = {styles.customBtnBG} onPress={() => navigation.navigate("Login")}>
            <Text style ={styles.customBtnText}>Sign up / Login</Text>
        </TouchableOpacity>
          
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
    
    logo: {
        marginVertical: '-30%',
    },

    image: {
        marginVertical: '5%',
    },

    title: {
        fontSize: 24,
        color: colors.darkbrown,
        textAlign: "center",
        fontFamily: "Montserrat-Black",
        marginHorizontal: 60,
    },

    text: {
        fontSize: 15,
        color: colors.darkbrown,
        textAlign: "center",
        fontFamily: "Montserrat-Black",
        marginHorizontal: 60,
        marginVertical: '5%',
    },

    customBtnText: {
        fontSize: 24,
        fontFamily: 'Montserrat-Black',
        color: colors.white,
        textAlign: "center",
    },

    customBtnBG: {
        width: '80%',
        marginVertical: '5%',
        backgroundColor: colors.darkbrown,
        paddingVertical: 15,
        borderRadius: 30
    },

})
export default WelcomeScreen;