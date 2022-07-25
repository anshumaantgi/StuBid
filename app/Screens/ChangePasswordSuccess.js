import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../config/colors.js';
import ChangePassword from './ChangePassword.js';

const ChangePasswordSuccess = ({navigation}) => {

    return (
        <View style={styles.container}>
          <Image style = {styles.image} source= {require('../assets/Successlogo/Success.png')} resizeMode = "contain" /> 
          <Text style={styles.text}> 
          Your Password has been changed successfully.
          </Text>
          <Text style={styles.text}> 
           You will need to re-login again with your new password and will be logged out in 5 seconds.
          </Text>
          
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
export default ChangePasswordSuccess;