import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, useWindowDimensions} from 'react-native';
import colors from '../config/colors.js';

const Auctionpage = ({navigation}) => {
    return (
        <View style={styles.container}>
            
             <Text
                onPress={() => alert('This is the "Auction" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Auction Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
      },
    
})

export default Auctionpage;