import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../config/colors.js';

const ResetPasswordSuccess = ({navigation}) => {

    return (
        <View style={styles.container}>
          <Image style = {styles.image} source= {require('../assets/Successlogo/Success.png')} resizeMode = "contain" /> 
          <Text style={styles.text}> 
          Password resetted Successfully!
          </Text>
          <Text style={styles.text}> 
           Please check your email for follow-up actions.
          </Text>
          
          <View style={{flexDirection: 'row'}}>
                <Text style={styles.returnlogintext}>Return to Login Page? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style ={styles.logintext}>Login</Text>
                </TouchableOpacity>
            </View>
          
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

    image: {
        marginVertical: '5%',
    },

    text: {
        fontSize: 15,
        color: colors.darkbrown,
        textAlign: "center",
        fontFamily: "Montserrat-Black",
        marginHorizontal: 60,
        marginVertical: 10,
    },

    returnlogintext : {
        marginVertical: 20,
        color: colors.darkbrown,
    },

    logintext :{
        marginVertical: 20,
        color: colors.darkbrown,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },

})
export default ResetPasswordSuccess;