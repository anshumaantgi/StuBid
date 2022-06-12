import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, useWindowDimensions, Header, Icon} from 'react-native';
import colors from '../config/colors.js';


const Auction1 = ({navigation}) => {
    
    return (
        <View style={styles.container}>
             <Text
                onPress={() => alert('This is the "Auction 1" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Auction 1 Screen</Text>
            <Text
                onPress={() => navigation.navigate("Auction2")}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Click here to Auction 2</Text>
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

export default Auction1;