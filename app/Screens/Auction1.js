import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../config/colors.js';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, getFirestore} from "firebase/firestore"; 
import { auth } from '../config/config.js';
import UploadItemPhoto from '../assets/UploadItemPhoto_resize.png';



const Auction1 = ({navigation}) => {
  
  const UploadItemPhotoURI = Image.resolveAssetSource(UploadItemPhoto).uri
  
  // initize the state hook
  const [image, setImage] = useState(UploadItemPhotoURI);
  const [itemname, setItemname] = useState('');
  const [itemdesc, setItemdesc] = useState('');
  const [useruni, setUseruni] = useState('');
  

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
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  async function sendValues(enteredimage, entereditemname, entereditemdesc, entereduseruni) {
    if (!(enteredimage && entereditemname && entereditemdesc && entereduseruni)) {
      throw new Error("Please do not leave any fields empty!");
    } else if (enteredimage === UploadItemPhotoURI) {
      throw new Error("Have you upload the item image?");
    } 
    console.log(enteredimage); // URI of image
    console.log(entereditemname);
    console.log(entereditemdesc);
    console.log(entereduseruni);
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
        <View style={styles.container}>
             <Text style={styles.title}> Upload new items*</Text>
             <Text style={styles.text}> Click on the image below to start uploading your images!</Text>
             <TouchableOpacity style = {styles.image} onPress = {pickImage}>
              {image && <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />}
             </TouchableOpacity>
             <TextInput style = {styles.textinput} placeholder='Name of the item' placeholderTextColor={colors.white} value = {itemname} onChangeText={(value) => setItemname(value)} />
             <TextInput style = {styles.textinput} placeholder='Item Description' placeholderTextColor={colors.white} value = {itemdesc} onChangeText={(value) => setItemdesc(value)} />
             <View style={styles.lockSection}>
              <TextInput style = {styles.textinputuni} editable={false} placeholder='University name' placeholderTextColor={colors.white} value = {useruni} onChangeText={(value) => setUseruni(value)}/>
              <Ionicons style={styles.lockIcon} name={'lock-closed-outline'} size={24} color={colors.darkbrown} />
             </View>
             <TouchableOpacity style = {styles.customBtnBG} onPress={() => {
                sendValues(image, itemname, itemdesc, useruni)
                .then((success) => {navigation.navigate("Auction2");})
                .catch((error) => alert(error.message))
                
                }}>
                <Text style ={styles.customBtnText}>Next</Text>
            </TouchableOpacity>
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
      
    title: {
      color: colors.darkbrown,
      textAlign: "center",
      fontFamily: "Montserrat-Black",
      fontSize: 16,
    },

    text: {
      color: colors.darkbrown,
      fontSize: 12,
      marginVertical: 15,
    },

    image: {
      marginVertical: 10,
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

    textinputuni: {
      backgroundColor: colors.textinput,
      width: '80%',
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 20,
      marginVertical: 10,
      color: colors.darkbrown,
      fontWeight: 'bold',
    },


    customBtnText: {
      fontSize: 24,
      fontFamily: 'Montserrat-Black',
      color: colors.white,
      textAlign: "center",
    },

    customBtnBG: {
      width: '80%',
      marginVertical: '10%',
      backgroundColor: colors.darkbrown,
      paddingVertical: 15,
      borderRadius: 5
    },

    lockSection: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
    },

    lockIcon : {
      padding : 10,
      position: 'absolute',
      right: 10,
    }
    
})

export default Auction1;