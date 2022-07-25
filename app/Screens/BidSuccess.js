import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../config/colors.js';

const BidSuccess = ({route, navigation}) => {
    const buyerbidprice = route.params.userbidprice;
    const auctionId = route.params.aId;
    return (
        <View style={styles.container}>
          <Image style = {styles.image} source= {require('../assets/Successlogo/Success.png')} resizeMode = "contain" /> 
          <Text style={styles.text}> 
           Hurray!
          </Text>
          <Text style={styles.text}> 
           You have successfully bidded the item for : 
          </Text>
          <Text style={styles.buyerbid}> 
            ${buyerbidprice}
          </Text>
          <Text style={styles.text}> 
            Your bidding details will be notified
            to the seller. You may also view your
            bidding details on your account.
          </Text>
          
          <View style={{flexDirection: 'row'}}>
                <Text style={styles.returnlogintext}>Return to Product Listing? </Text>
                <TouchableOpacity onPress={() =>
                {
                    navigation.navigate("BuyerBid", {auctionId});
                }}>
                    <Text style ={styles.logintext}>Go Back</Text>
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

    buyerbid : {
        fontSize: 30,
        color: colors.orange,
        textAlign: "center",
        fontFamily: "Montserrat-Black",
        marginHorizontal: 60,
        marginVertical: 10,
    },

})
export default BidSuccess;