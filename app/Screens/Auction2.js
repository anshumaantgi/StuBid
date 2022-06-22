import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import colors from '../config/colors.js';
import DateTimePicker from '@react-native-community/datetimepicker';
import {auth, db} from '../config/config.js'
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDocs, getFirestore, collection} from "firebase/firestore"; 


const Auction2 = ({route, navigation}) => {

      // initize the state hook
      const auctionView =  route.params;
      const [startingprice, setStartingprice] = useState('');
      const [buyoutprice, setBuyoutprice] = useState('');
      const [counter, setCounter] = useState(0);

      // Date picker
      const [date, setDate] = useState(new Date());

      const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
      };

      const getdays = (endingdate) => {
        var newDate = endingdate.toLocaleDateString() 
        var currDate = new Date().toLocaleDateString()
        var daysleft = newDate.slice(0,2) - currDate.slice(0,2)
        return daysleft;
      }

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

      //Ramdom name generator for Seller (NOT BUYERS)
      const { uniqueNamesGenerator, adjectives, animals } = require('unique-names-generator');
      const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, animals] }); // big_donkey

      //Retrieve Total number of documents (purpose is for auto accumulate Auction ID)
      const countdocs = async()=> {
        var count = 0;
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "auctions"));
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          count = count + 1
          }
          )
          console.log("DOG", count);
          setCounter(count)};
        
        useEffect(() => {
           countdocs();
        }, [])

      // Function to send to database
      async function sendValues(enteredcategory, enteredendbid, entereddaysleft, enteredstartingprice, enteredbuyoutprice, SellerAnonymousName) {
        if (!(enteredcategory && enteredendbid  && enteredstartingprice && enteredbuyoutprice && SellerAnonymousName)) {
          console.log(counter);
            throw new Error("Please do not leave any fields empty!");
          } if (entereddaysleft === 0) {
            throw new Error("Minimum Day of Bidding must be at least 1");
          } else if (parseInt(enteredbuyoutprice) <=  parseInt(enteredstartingprice)) {
            throw new Error("Buyout Bid must be higher than Starting Bid!");
          } else {
            // Create Auction Object and Input Auction ID
            // Save the Anonymous name to the Auction Object
            return await auctionView.createProduct(enteredstartingprice, enteredbuyoutprice,enteredcategory,counter,entereddaysleft,SellerAnonymousName)
          }
    };
    
    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
        <KeyboardAvoidingView behavior="height">
        <SafeAreaView style={styles.container}>
             <Text style={styles.title}>Category</Text>
             <DropDownPicker
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
                containerStyle={{width: '80%', marginVertical: 10}}
                style={{backgroundColor: colors.textinput, paddingVertical: 20, borderColor: '#fff'}}
                placeholderStyle={{color: colors.white}}
                dropDownStyle = {{backgroundColor: colors.textinput}}
                labelStyle = {{color: colors.white}}
            />
            <Text style={styles.text}>This is the category where your item will appear in the listing.</Text>

            <Text style={styles.title}>End Bid Date</Text>
             <View style = {styles.datePickercontainer}>
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={'date'}
                    display={'default'}
                    minimumDate = {new Date()}
                    onChange={onChange}
                    style={styles.datePicker}
                    />
            </View>
            <Text style={styles.textdaysleft}> Days Remaining: {getdays(date)} </Text>
            <Text style={styles.text}>Select your preferred End Bid date. 'Days Remaining' will automatically specify the number of days remaining for the auction.</Text>
             <Text style={styles.title}>Set Bidding/Buyout Price</Text>
             <TextInput style = {styles.textinput} placeholder='Starting Bid Price ($)' placeholderTextColor={colors.white} value = {startingprice} onChangeText={(value) => setStartingprice(value)} keyboardType='numeric' />
             <TextInput style = {styles.textinput} placeholder='Buyout Bid Price ($)' placeholderTextColor={colors.white} value = {buyoutprice} onChangeText={(value) => setBuyoutprice(value)} keyboardType='numeric'/>
             <TouchableOpacity style = {styles.customBtnBG} onPress={() => {
                sendValues(value, date.toLocaleDateString(), getdays(date), startingprice, buyoutprice, randomName)
                .then((success) =>  {alert(`Please take note of your Anonymous name during the auction: \n\n` + randomName); navigation.navigate('ItemPublishSuccess');})
                .catch((error) => {alert(error.message)})
            }
        }
            >
                <Text style ={styles.customBtnText}>Publish Item</Text>
            </TouchableOpacity>
            <Text style={styles.selleranonymousname}>Your Anonymous Name (Seller) : {randomName}</Text>
        </SafeAreaView>
        </KeyboardAvoidingView>
    </ScrollView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
      },
    
      title: {
        color: colors.darkbrown,
        textAlign: "center",
        fontFamily: "Montserrat-Black",
        fontSize: 16,
        marginVertical: 10,
      },

      text: {
        color: colors.darkbrown,
        fontSize: 12,
        width: '80%',
        textAlign: 'left',
        marginVertical: 5,
      },

      textdaysleft: {
        color: colors.red,
        fontSize: 12,
        width: '80%',
        textAlign: 'center',
        fontWeight: 'bold',
        marginVertical: 5,
      },

      textinput: {
        backgroundColor: colors.textinput,
        width: '80%',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginVertical: 10,
        color: colors.white,
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
        borderRadius: 5
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