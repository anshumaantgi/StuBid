import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import colors from '../config/colors.js';
import {auth, db} from '../config/config.js'
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDocs, getFirestore, collection} from "firebase/firestore"; 
import moment from "moment-timezone";
import AuctionView from '../views/AuctionView.js';


const Auction2 = ({route, navigation}) => {

      // initize the state hook
      const auctionView =  route.params;
      const [startingprice, setStartingprice] = useState('');
      const [buyoutprice, setBuyoutprice] = useState('');

      //Category Picker
      const [open, setOpen] = useState(false);
      const [value, setValue] = useState(null);
      const [items, setItems] = useState([
        {label: 'Clothing & Accessories', value: 'CA'},
        {label: 'Electronics', value: 'ELE'},
        {label: 'Entertainment', value: 'ENT'},
        {label: 'Hobbies', value: 'HB'},
        {label: 'Home & Garden', value: 'HG'},
        {label: 'Housing (Rental)', value: 'HR'},
        {label: 'Vehicles', value: 'VEH'},
        {label: 'Others', value: 'OTH'},
      ]);

       //Bid Duration Picker
       const [open2, setOpen2] = useState(false);
       const [value2, setValue2] = useState(null);
       const [items2, setItems2] = useState([
         {label: '1 Day', value: '1'},
         {label: '2 Day', value: '2'},
         {label: '3 Day', value: '3'},
         {label: '4 Day', value: '4'},
         {label: '5 Day', value: '5'},
         {label: '6 Day', value: '6'},
         {label: '7 Day', value: '7'},
         {label: '8 Day', value: '8'},
         {label: '9 Day', value: '9'},
         {label: '10 Day', value: '10'},
         {label: '11 Day', value: '11'},
         {label: '12 Day', value: '12'},
         {label: '13 Day', value: '13'},
         {label: '14 Day', value: '14'},
         {label: '15 Day', value: '15'},
         {label: '16 Day', value: '16'},
         {label: '17 Day', value: '17'},
         {label: '18 Day', value: '18'},
         {label: '19 Day', value: '19'},
         {label: '20 Day', value: '20'},
         {label: '21 Day', value: '21'},
         {label: '22 Day', value: '22'},
         {label: '23 Day', value: '23'},
         {label: '24 Day', value: '24'},
         {label: '25 Day', value: '25'},
         {label: '26 Day', value: '26'},
         {label: '27 Day', value: '27'},
         {label: '28 Day', value: '28'},
         {label: '29 Day', value: '29'},
         {label: '30 Day', value: '30'},
       ]);

      //Ramdom name generator for Seller (NOT BUYERS)
      const { uniqueNamesGenerator, adjectives, animals } = require('unique-names-generator');
      const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, animals] }); // big_donkey

      //Retrieve start date
      const startdate =  moment().tz('Singapore').format('DD/MM/YYYY')

      //Retrieve end date
      const endbiddate =  moment().add(value2, 'days').tz('Singapore').format('DD/MM/YYYY') //to display on app

      const displayendbiddate = () => {
        if (value2 === null) {
          return '';
        } else {
          return endbiddate;
        }
      }

       //Retrieve Total number of documents (purpose is for auto accumulate Auction ID)
       const arrayMax = (arr) => {
        return arr.reduce(function (p, v) {
          return ( p > v ? p : v );
        });
        }

      // Function to send to database
      async function sendValues(enteredcategory, enteredendbid, enteredbidduration, enteredstartingprice, enteredbuyoutprice, SellerAnonymousName) {
        if (!(enteredcategory && enteredbidduration && enteredstartingprice && enteredbuyoutprice && SellerAnonymousName)) {
            throw new Error("Please do not leave any fields empty!");
          } else if (parseInt(enteredbuyoutprice) <=  parseInt(enteredstartingprice)) {
              throw new Error("Buyout Bid must be higher than Starting Bid!");
          } else {
            // Create Auction Object and Input Auction ID
            // Save the Anonymous name to the Auction Object
            return await auctionView.createProduct(parseInt(enteredstartingprice), parseInt(enteredbuyoutprice),enteredcategory,parseInt(enteredbidduration),SellerAnonymousName, enteredendbid)
          }
    };
    
    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
        <KeyboardAvoidingView behavior="height">
        <SafeAreaView style={styles.container}>
             <Text style={styles.title} >Category</Text>
             <DropDownPicker
                zIndex={3000}
                zIndexInverse = {1000}
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
                onChangeValue={(value) => {
                    setValue(value);
                    console.log(value);
                  }}
                placeholder="Choose Category"
                containerStyle={{width: '80%', marginVertical: 10, alignSelf: 'center'}}
                style={{backgroundColor: colors.textinput, paddingVertical: 20, borderColor: '#fff',}}
                placeholderStyle={{color: colors.white}}
                dropDownStyle = {{backgroundColor: colors.textinput}}
                labelStyle = {{color: colors.white}}
            />
            <Text style={styles.text}>This is the category where your item will appear in the listing.</Text>

            <Text style={styles.title}>Bid Duration</Text>
            <DropDownPicker
               zIndex={2000}
               zIndexInverse = {2000}
                open={open2}
                value={value2}
                items={items2}
                setOpen={setOpen2}
                setValue={setValue2}
                setItems={setItems2}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
                onChangeValue={(value2) => {
                    setValue2(value2);
                    console.log(value2);
                  }}
                placeholder="Select Bid Duration"
                containerStyle={{width: '80%', marginVertical: 10, alignSelf: 'center'}}
                style={{backgroundColor: colors.textinput, paddingVertical: 20, borderColor: '#fff',}}
                placeholderStyle={{color: colors.white}}
                dropDownStyle = {{backgroundColor: colors.textinput}}
                labelStyle = {{color: colors.white}}
            />
            <Text style={styles.textdaysleft}> Start Bid Date: {startdate} </Text>
            <Text style={styles.textdaysleft}> End Bid Date: {displayendbiddate()} </Text>
            <Text style={styles.text}>Select your preferred Bid Duration. 'End Bid Date' will automatically specify the due date for the Auction.</Text>
             <Text style={[styles.title,{ marginBottom: 20}]}>Set Bidding/Buyout Price</Text>
             <Text style={styles.titleinput} >Starting Bid Price ($)</Text>
             <TextInput style = {styles.textinput} placeholder='Starting Bid Price ($)' placeholderTextColor={colors.white} value = {startingprice} onChangeText={(value) => setStartingprice(value)} keyboardType='numeric' />
             <Text style={styles.titleinput} >Buyout Bid Price ($)</Text>
             <TextInput style = {styles.textinput} placeholder='Buyout Bid Price ($)' placeholderTextColor={colors.white} value = {buyoutprice} onChangeText={(value) => setBuyoutprice(value)} keyboardType='numeric'/>
             <TouchableOpacity style = {styles.customBtnBG} onPress={() => {
                sendValues(value, endbiddate, value2, startingprice, buyoutprice, randomName)
                .then((success) =>  {navigation.navigate('ItemPublishSuccess', {randomName});})
                .catch((error) => {alert(error.message); console.log('ERRRORRRRRRRRRRRRRR')})
            }
        }
            >
                <Text style ={styles.customBtnText}>Publish Item</Text>
            </TouchableOpacity>
        </SafeAreaView>
        </KeyboardAvoidingView>
    </ScrollView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: colors.white,
      },
    
      title: {
        color: colors.darkbrown,
        textAlign: "center",
        fontFamily: "Montserrat-Black",
        fontSize: 16,
        marginVertical: 10,
      },

      titleinput : {
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: '10%',
      },

      text: {
        color: colors.darkbrown,
        fontSize: 12,
        width: '80%',
        textAlign: 'left',
        marginVertical: 5,
        alignSelf: 'center',
      },

      textdaysleft: {
        color: colors.red,
        fontSize: 12,
        width: '80%',
        textAlign: 'center',
        fontWeight: 'bold',
        marginVertical: 5,
        alignSelf: 'center',
      },

      textinput: {
        backgroundColor: colors.textinput,
        width: '80%',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginVertical: 10,
        color: colors.white,
        alignSelf: 'center',
      },

      customBtnText: {
        fontSize: 24,
        fontFamily: 'Montserrat-Black',
        color: colors.white,
        textAlign: "center",
    },

    customBtnBG: {
        width: '80%',
        marginVertical: '5%',
        backgroundColor: colors.darkbrown,
        paddingVertical: 15,
        borderRadius: 5,
        alignSelf: 'center',
    },

    datePicker: {
        width: 125,
    },

    datePickercontainer: {
        marginVertical: 10,
        
        
    },
    selleranonymousname : {
        color: colors.red,
        fontFamily: 'Montserrat-Black',
        fontSize: 12,
        width: '80%',
        textAlign: 'center',
        marginVertical: 5,

    },
    
})

export default Auction2;