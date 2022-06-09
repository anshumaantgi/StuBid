import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import colors from '../config/colors.js';
import LoginView from '../views/LoginView.js';
import { auth } from '../config/config.js';

const Login = ({navigation}) => {

    // initize the state hook
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function sendValues(enteredemail, enteredpassword) {
        return new LoginView(auth).logUser(enteredemail, enteredpassword);
    };

    return (
        <View style={styles.container}>
            <Image style = {styles.logo} source = {require('../assets/StuBid-Logo-Original-ver.png')} resizeMode = "contain" /> 
            <TextInput style = {styles.textinput} placeholder='Email (School)' placeholderTextColor={colors.white} value = {email} onChangeText={(value) => setEmail(value)} keyboardType="email-address"/>
            <TextInput style = {styles.textinput} placeholder='Password' placeholderTextColor={colors.white} value = {password} onChangeText={(value) => setPassword(value)} secureTextEntry={true}/>
            <TouchableOpacity onPress={() => navigation.navigate("ForgetPassword")}>
                <Text style ={styles.forgetpasswordtext}>Forget Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.customBtnBG} onPress={() => {
                sendValues(email, password)
                .then((success) => {navigation.navigate("Homepage");})
                .catch((error) => alert(error.message))
                
                }}>
                <Text style ={styles.customBtnText}>Login</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.noaccounttext}>Don't have an account?  </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
                    <Text style ={styles.signuptext}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    bold: {fontWeight: 'bold'},
    italic: {fontStyle: 'italic'},
    underline: {textDecorationLine: 'underline'},

    container: {
        flex: 1,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
      },

    logo: {
        width: '100%',
        marginVertical: '-30%',
    },

    textinput: {
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
        width: '80%',
        marginVertical: '15%',
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

    noaccounttext: {
        color: colors.darkbrown,
    },

    signuptext: {
        color: colors.darkbrown,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
})

export default Login;