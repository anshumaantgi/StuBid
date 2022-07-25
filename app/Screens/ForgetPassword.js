import React, {useState} from 'react';
import {View, ScrollView, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import colors from '../config/colors.js';
import {auth} from '../config/config.js';
import ForgotPasswordView from '../views/ForgotPasswordView.js';

const ForgetPassword = ({navigation}) => {

    // initize the state hook
    const [email, setEmail] = useState('');

    async function sendValues(enteredemail) {
        return await new ForgotPasswordView(auth).resetPassword(enteredemail);
    };

    return (
        <ScrollView style={styles.container}>
            <Image style = {styles.logo} source = {require('../assets/StuBid-Logo-Original-ver.png')} resizeMode = "contain" /> 
            <Text style={styles.title}> 
            Reset Password
            </Text>
            <TextInput style = {styles.textinput} placeholder='Email (School)' placeholderTextColor={colors.white} value = {email} onChangeText={(value) => setEmail(value)} keyboardType="email-address"/>
            <Text style={styles.text}> 
            By tapping Send to Email, resetted password will be sent to your email with follow-up actions.
            </Text>
            <TouchableOpacity style = {styles.customBtnBG} onPress={() => {
                sendValues(email)
                .then ((success) => navigation.navigate("ResetPasswordSuccess"))
                .catch ((error) => alert(error.message));
                }}>
                <Text style ={styles.customBtnText}>Send to Email</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row',   alignSelf: 'center',}}>
                <Text style={styles.returnlogintext}>Return to Login Page? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style ={styles.logintext}>Login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({

    bold: {fontWeight: 'bold'},
    italic: {fontStyle: 'italic'},
    underline: {textDecorationLine: 'underline'},

    container: {
        flex: 1,
        backgroundColor: colors.white,
      },

    logo: {
        width: '100%',
        alignSelf: 'center',
        marginBottom: -150,
        marginTop: -50,
    },

    title: {
        fontSize: 20,
        color: colors.darkbrown,
        textAlign: "center",
        fontFamily: "Montserrat-Black",
        alignSelf: 'center',
    },

    text: {
        color: colors.darkbrown,
        textAlign: "center",
        width: '80%',
        marginVertical: 10,
        alignSelf: 'center',
    },


    textinput: {
        alignSelf: 'center',
        backgroundColor: colors.textinput,
        width: '80%',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginVertical: 10,
        color: colors.white,
    },

    customBtnText: {
        fontSize: 24,
        fontFamily: 'Montserrat-Black',
        color: colors.white,
        textAlign: "center",
    },

    customBtnBG: {
        alignSelf: 'center',
        width: '80%',
        marginVertical: 10,
        backgroundColor: colors.darkbrown,
        paddingVertical: 15,
        borderRadius: 5
    },

    forgetpasswordtext: {
        color: colors.darkbrown,
        textDecorationLine: 'underline',
        marginLeft: '50%',
        fontWeight: 'bold',

    },

    returnlogintext : {
        marginVertical: 40,
        color: colors.darkbrown,
    },

    logintext :{
        marginVertical: 40,
        color: colors.darkbrown,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
})

export default ForgetPassword;