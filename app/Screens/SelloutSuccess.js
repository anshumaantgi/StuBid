import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../config/colors.js';
import { StackActions } from '@react-navigation/native';

const SelloutSuccess = ({route, navigation}) => {
    const selloutprice = route.params.latestbidder.bidPrice;
    const auctionId = route.params.aId;
    return (
        <View style={styles.container}>
          <Image style = {styles.image} source= {require('../assets/Successlogo/Success.png')} resizeMode = "contain" /> 
          <Text style={styles.text}> 
           Congratulations!
          </Text>
          <Text style={styles.text}> 
           You have successfully accepted a bid for your item for:
          </Text>
          <Text style={styles.selloutprice}> 
            ${selloutprice}
          </Text>
          <Text style={styles.text}> 
            You may now exchange contact
            with seller for further transaction.
          </Text>
          
          <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => 
                    {
                    const popAction = StackActions.pop(2);
                    navigation.dispatch(popAction);
                    navigation.navigate("ExchangeContact", {auctionId})
                    }
                    }>
                    <Text style ={styles.logintext}>Click here to proceed to exchange contact.</Text>
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

    selloutprice: {
        fontSize: 30,
        color: colors.orange,
        textAlign: "center",
        fontFamily: "Montserrat-Black",
        marginHorizontal: 60,
        marginVertical: 10,
    },

})
export default SelloutSuccess;