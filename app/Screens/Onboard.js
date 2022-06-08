import React from 'react';
import {View, Text, StatusBar, Image, StyleSheet} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import colors from '../config/colors.js';

const data = [
    {
      title: 'All-In-One Marketplace to sell or buy items',
      imagelogo: require('../assets/StuBid-Logo-Original-ver.png'),
      image: require('../assets/OnboardSlides/Welcome_1.png'),
      bg: colors.white,
    },
    {
      title: 'Auction off your items with best price guarenteed.',
      imagelogo: require('../assets/StuBid-Logo-Original-ver.png'),
      image: require('../assets/OnboardSlides/Welcome_2.png'),
      bg: colors.darkbrown,
    },
    {
      title: 'Conveniently bid your items at your own comfort',
      imagelogo: require('../assets/StuBid-Logo-Original-ver.png'),
      image: require('../assets/OnboardSlides/Welcome_3.png'),
      bg: colors.lightbrown,
    },
  ];
  
const Onboard = ({navigation}) => {


    const renderItem = ({item}) => {
        return (
            <View style = {styles.slide}>
                <Image source = {item.imagelogo} style = {styles.imagelogo}/>
                <Image source = {item.image} style = {styles.image}/>
                <Text style = {styles.title}> {item.title}</Text>
            </View>
        )
    }

    const keyExtractor = (item) => item.title;

    const renderDoneButton = () => {
        return (
            <View style = {styles.donebuttonWrapper}>
                <Text style = {styles.donebutton}>Done</Text>
            </View>
        );
    };
    const renderNextButton = () => {
        return (
            <View style = {styles.rightTextWrapper}>
                <Text style = {styles.rightText}>Next</Text>
            </View>
        );
    };
    const renderPrevButton = () => {
        return (
            <View style = {styles.leftTextWrapper}>
                <Text style = {styles.leftText}>Prev</Text>
            </View>
        );
    };

    const renderSkipButton = () => {
        return (
            <View style = {styles.leftTextWrapper}>
                <Text style = {styles.leftText}>Skip</Text>
            </View>
        );
    };


    return (
        <View style={{flex: 1}}>
        <StatusBar translucent backgroundColor="transparent" />
        <AppIntroSlider
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          renderDoneButton={renderDoneButton}
          renderNextButton={renderNextButton}
          renderPrevButton={renderPrevButton}
          renderSkipButton={renderSkipButton}
          showPrevButton
          showSkipButton
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
          data={data}
          onDone={() => navigation.navigate('WelcomeScreen')}
        />
      </View>
    )
}

const styles = StyleSheet.create({
    slide : {
        flex : 1,
        alignItems: "center",
        justifyContent: "center",
        //backgroundColor: colors.white,

    },
    imagelogo : {
        marginVertical: -180,
    },
    image : {
        marginVertical: 60,
    },
    title : {
        fontSize: 24,
        color: colors.darkbrown,
        textAlign: "center",
        fontFamily: "Montserrat-Black",
        marginHorizontal: 60,
    },
    rightTextWrapper : {
        width: 40,
        height: 40,
        marginRight: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    rightText: {
        color: colors.darkbrown,
        fontFamily: "Montserrat-Black",
        fontSize: 13,
    },
    leftTextWrapper : {
        width: 40,
        height: 40,
        marginLeft: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    leftText: {
        color: colors.darkbrown,
        fontFamily: "Montserrat-Black",
        fontSize: 13,
    },
    dotStyle : {
       backgroundColor: colors.lightgrey,
    },
    activeDotStyle : {
       backgroundColor: colors.darkbrown,
    },
    donebuttonWrapper : {
        width: 80,
        height: 40,
        marginRight: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.darkbrown,
        borderRadius: 10,
    },
    donebutton : {
        color: colors.white,
        fontFamily: "Montserrat-Black",
        fontSize: 13,
    },

})
export default Onboard