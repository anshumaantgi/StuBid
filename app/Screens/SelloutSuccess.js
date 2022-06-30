import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../config/colors.js';

const SelloutSuccess = ({route, navigation}) => {
    const buyeranonname = route.params.buyerfakename;
    return (
        <View style={styles.container}>
          <Image style = {styles.image} source= {require('../assets/Successlogo/Success.png')} resizeMode = "contain" /> 
          <Text style={styles.text}> 
           Congratulations!
          </Text>
          <Text style={styles.text}> 
           You have successfully accepted a bid for your item from :
          </Text>
          <Text style={styles.buyeranon}> 
            {buyeranonname}
          </Text>
          <Text style={styles.text}> 
            You may now exchange contact
            with seller for further transaction.
          </Text>
          
          <View style={{flexDirection: 'row'}}>
                <Text style={styles.returnlogintext}>Return to Homepage? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("MainContainer")}>
                    <Text style ={styles.logintext}>Homepage</Text>
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

    buyeranon : {
        fontSize: 15,
        color: colors.red,
        textAlign: "center",
        fontFamily: "Montserrat-Black",
        marginHorizontal: 60,
        marginVertical: 10,
    },

})
export default SelloutSuccess;