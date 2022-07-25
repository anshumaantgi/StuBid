import React, {useState} from 'react';
import {View, ScrollView, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import colors from '../config/colors.js';
import {auth} from '../config/config.js';
import {EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

const ChangePassword = ({navigation}) => {

    // initize the state hook
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmnewPw, setConfirmnewPw] = useState('');

    //get current user
    const user = auth.currentUser;

    async function sendValues(enteredoldpassword, enterednewpassword, enteredcfmnewpassword) {

        if (!(enteredoldpassword && enterednewpassword && enteredcfmnewpassword)) {
            throw new Error("Please do not leave any fields empty!");
        }
        else if (enterednewpassword != enteredcfmnewpassword) {
            throw new Error("New Password does not match! Please re-enter new password again");
        }

        //get credentials
        const credential = EmailAuthProvider.credential(
            user.email,
            enteredoldpassword,
        )

        await reauthenticateWithCredential(user, credential).then(() => {
            // User re-authenticated and proceed to update password
            updatePassword(user, enterednewpassword).then(() => {
              console.log("Password was changed succesfully");
              setTimeout(()=>{
                auth.signOut(); 
              },5000);
              navigation.navigate('ChangePasswordSuccess');
            }).catch((error) => { alert(error.message); });

          }).catch((error) => {
            // An error ocurred
            throw new Error("Are you sure your old password is correct? Please re-enter your old password.");
          });

           
        
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}> Current Old Password </Text>
            <TextInput style = {styles.textinput} placeholder='Enter old password' placeholderTextColor={colors.white} value = {currentPw} onChangeText={(value) => setCurrentPw(value)} secureTextEntry={true}/>
            <Text style={styles.title}> New Password</Text>
            <TextInput style = {styles.textinput} placeholder='Enter new password' placeholderTextColor={colors.white} value = {newPw} onChangeText={(value) => setNewPw(value)} secureTextEntry={true}/>
            <Text style={styles.title}> Confirm New Password </Text>
            <TextInput style = {styles.textinput} placeholder='Enter confirm new password' placeholderTextColor={colors.white} value = {confirmnewPw} onChangeText={(value) => setConfirmnewPw(value)} secureTextEntry={true}/>
            <Text style={styles.text}> 
            By tapping Change Password, your password will be updated and you will need to re-login with your new password.
            </Text>
            <TouchableOpacity style = {styles.customBtnBG} onPress={() => {
                sendValues(currentPw, newPw, confirmnewPw)
                .then ((success) => navigation.navigate("ChangePasswordSuccess"))
                .catch ((error) => alert(error.message));
                }}>
                <Text style ={styles.customBtnText}>Change Password</Text>
            </TouchableOpacity>
           
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
        padding: 20,
      },

    logo: {
        width: '100%',
        marginVertical: '-30%',
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
        textAlign: "left",
        width: '80%',
        marginVertical: 10,
        alignSelf: 'center',
    },


    textinput: {
        backgroundColor: colors.textinput,
        width: '80%',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginVertical: 10,
        color: colors.white,
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
        marginVertical: 10,
        backgroundColor: colors.darkbrown,
        paddingVertical: 15,
        borderRadius: 5,
        alignSelf: 'center',
    },

    forgetpasswordtext: {
        color: colors.darkbrown,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
    },

    returnlogintext : {
        marginVertical: 40,
        color: colors.darkbrown,
        textAlign: 'center',
        alignSelf: 'center',
    },

    logintext :{
        marginVertical: 40,
        color: colors.darkbrown,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
    },
})

export default ChangePassword;