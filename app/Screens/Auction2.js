import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, useWindowDimensions, Header, Icon} from 'react-native';
import colors from '../config/colors.js';


const Auction2 = ({navigation}) => {
    
    return (
        <View style={styles.container}>
             <Text
                onPress={() => alert('This is the "Auction 2" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Auction 2 Screen</Text>
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

export default Auction2;