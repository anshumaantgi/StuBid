import React from 'react';
import {Image, StyleSheet, View} from "react-native";
import colors from '../config/colors';


function ViewImage(props) {
    return (
            <View style={styles.container}>
                <View style = {styles.closeIcon}></View>
                <View style = {styles.Icon}></View>
                <Image 
                    resizeMode = "contain" 
                    style = {styles.image} 
                    source = {require("../assets/StuBid-Poster.png")} />
            </View>
    );
}

const styles = StyleSheet.create({
    closeIcon: {
        width: 50,
        height: 50,
        backgroundColor: colors.secondary,
        position: "absolute",
        top: 40,
        left: 30,
    },

    container: {
        backgroundColor: "#000",
        flex: 1,
    },

    image: {
        width: '100%',
        height: '100%',
    }
})

export default ViewImage;