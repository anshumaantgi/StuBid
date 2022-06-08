import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, useWindowDimensions} from 'react-native';

const Notificationpage = ({navigation}) => {
    return (
        <View style={styles.container}>
             <Text
                onPress={() => alert('This is the "Notification" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Notification Screen</Text>
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

export default Notificationpage;