import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../config/colors.js';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, getFirestore} from "firebase/firestore"; 
import { auth,db } from '../config/config.js';
import UploadItemPhoto from '../assets/UploadItemPhoto_resize.png';
import AuctionView from '../views/AuctionView.js';
import Product from '../models/Product.js';
import * as ImageManipulator from 'expo-image-manipulator';



const Auction1 = ({navigation}) => {
  
  const UploadItemPhotoURI = Image.resolveAssetSource(UploadItemPhoto).uri
  
  // initize the state hook
  const [image, setImage] = useState(UploadItemPhotoURI);
  const [itemname, setItemname] = useState('');
  const [itemdesc, setItemdesc] = useState('');
  const [useruni, setUseruni] = useState('');

  //store uni name short form instead of full form into database
  var unicode = '';
  

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    }
    );

    console.log(result, "Actual Image");

    if (!result.cancelled) {

      const manipulateResult = await ImageManipulator.
        manipulateAsync( result.localUri || result.uri, [
        {resize: {width: 150, height: 150}},
        ],
        {compress: 0, format: ImageManipulator.SaveFormat.PNG});
          
        setImage(manipulateResult.uri);
        console.log(manipulateResult, "Manipulated Image");
    }
  
  };

  function sendValues(enteredimage, entereditemname, entereditemdesc, entereduseruni) {
    if (!(enteredimage && entereditemname && entereditemdesc && entereduseruni)) {
      throw new Error("Please do not leave any fields empty!");
    } else if (enteredimage === UploadItemPhotoURI) {
      throw new Error("Have you upload the item image?");
    } else {
      const newProduct = new Product(entereditemname,auth.currentUser.uid,entereditemdesc,enteredimage, entereduseruni);
      
      return new AuctionView(auth, db , newProduct)

    }
    
};
    
    const db = getFirestore();
    getDoc(doc(db, "users", auth.currentUser.uid)).then(docSnap => {
        if (docSnap.exists()) {
          //console.log("Document data:", docSnap.data());
          const data = docSnap.data();
          //for (let [key, value] of Object.entries(data)) {
            //console.log(`${key}: ${value}`);
          //}
          const originUni = data.originUni;
          unicode = originUni;
          switch (originUni) {
            case "NUS" :
                // Do work here
                //console.log('@u.nus.edu');
                setUseruni('National University of Singapore (NUS)');
                break;
            case "NTU" :
                // Do work here
                //console.log('@e.ntu.edu.sg');
                setUseruni('Nanyang Technological University (NTU)');
                break;
            case "SMU" :
                // Do work here
                //console.log('@smu.edu');
                setUseruni('Singapore Management University (SMU)');
                break;
            case "SIT" :
                // Do work here
                //console.log('@sit.singaporetech.edu.sg');
                setUseruni('Singapore Institute of Technology (SIT)');
                break;
            case "SUTD" :
                // Do work here
                //console.log('@sutd.edu.sg');
                setUseruni('Singapore University of Technology & Design (SUTD)');
                break;
            case "SUSS" :
                // Do work here
                //console.log('@suss.edu.sg');
                setUseruni('Singapore University of Social Sciences (SUSS)');
                break;
            case "GMAIL" :
                // Do work here
                //console.log('@suss.edu.sg');
                setUseruni('Orbital-2122-StuBid (Debugging)');
                break;
            default :
                // Do work here
                console.log('Uni not listed here');
                break;
          }
        } else {
          console.log("No such document!");
        }
      })

    return (
        <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
             <Text style={styles.title}> Upload new items*</Text>
             <Text style={styles.text}> Click on the image below to start uploading your images!</Text>
             <TouchableOpacity style = {styles.image} onPress = {pickImage}>
              {image && <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />}
             </TouchableOpacity>
             <Text style={[styles.titleinput,{ marginTop: 20}]} >Name of the item</Text>
             <TextInput style = {styles.textinput} placeholder='Name of the item' placeholderTextColor={colors.white} value = {itemname} onChangeText={(value) => setItemname(value)} />
             <Text style={styles.titleinput} >Item Description</Text>
             <TextInput style = {styles.itemdesc} multiline = {true}  placeholder='Enter Item Description' placeholderTextColor={colors.white} value = {itemdesc} onChangeText={(value) => setItemdesc(value)} />
             <Text style={styles.titleinput} >University</Text>
             <TextInput style = {styles.textinputuni} editable={false} placeholder='University name' placeholderTextColor={colors.white} value = {useruni} onChangeText={(value) => setUseruni(value)}/>
             <Text style={styles.text}>Note: University is automatically extracted from your input during the registration phase. </Text>
           
             <TouchableOpacity style = {styles.customBtnBG} onPress={() => {
                try  {
                navigation.navigate( "Auction2", sendValues(image, itemname, itemdesc, unicode));

                } catch (err) {
                  alert(err.message);
                }
              
                
                }}>
                <Text style ={styles.customBtnText}>Next</Text>
            </TouchableOpacity>
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
    },

    titleinput : {
      fontWeight: 'bold',
      fontSize: 12,
      marginLeft: '10%',
  },

    text: {
      color: colors.darkbrown,
      width: '80%',
      fontSize: 12,
      marginVertical: 15,
      alignSelf: 'center',
    },

    image: {
      marginVertical: 10,
      alignSelf: 'center',
    },

    itemdesc: {
      backgroundColor: colors.textinput,
      width: '80%',
      height: 150,
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 20,
      marginVertical: 10,
      color: colors.white,
      textAlignVertical: 'top' ,
      alignSelf: "center",
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

    textinputuni: {
      backgroundColor: colors.textinput,
      width: '80%',
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 20,
      marginVertical: 10,
      color: colors.darkbrown,
      fontWeight: 'bold',
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
      backgroundColor: colors.darkbrown,
      paddingVertical: 15,
      borderRadius: 5,
      alignSelf: 'center',
      marginBottom: 70,
    },

    
})

export default Auction1;