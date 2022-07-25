import React from 'react';
import {View, ScrollView, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../config/colors.js';


const WelcomeScreen = ({navigation}) => {


    return (
        <ScrollView style={styles.container}>
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
          
        </ScrollView>
      );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
    
    logo: {
        width: '100%',
        alignSelf: 'center',
        marginBottom: -150,
        marginTop: -30,
    },

    image: {
        marginTop: '5%',
        alignSelf: 'center',
    },

    title: {
        fontSize: 24,
        color: colors.darkbrown,
        textAlign: "center",
        fontFamily: "Montserrat-Black",
        alignSelf: 'center',
    },

    text: {
        fontSize: 15,
        color: colors.darkbrown,
        textAlign: "center",
        fontFamily: "Montserrat-Black",
        width: '80%',
        marginVertical: '5%',
        alignSelf: 'center',
    },

    customBtnText: {
        fontSize: 24,
        fontFamily: 'Montserrat-Black',
        color: colors.white,
        textAlign: "center",
    },

    customBtnBG: {
        width: '80%',
        marginTop: '5%',
        marginBottom: 70,
        backgroundColor: colors.darkbrown,
        paddingVertical: 15,
        borderRadius: 30,
        alignSelf: 'center',
    },

})
export default WelcomeScreen;