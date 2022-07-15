import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Alert} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import colors from '../config/colors.js';
import * as ImagePicker from 'expo-image-picker';
import { collection, query, orderBy, getDoc, getDocs, getFirestore, doc, where, onSnapshot, updateDoc, deleteDoc} from "firebase/firestore"; 
import { auth,db } from '../config/config.js';
import UploadItemPhoto from '../assets/UploadItemPhoto_resize.png';
import AuctionView from '../views/AuctionView.js';
import Product from '../models/Product.js';
import moment from "moment-timezone";
import {uploadBytes, ref, getDownloadURL,deleteObject, getStorage} from 'firebase/storage';
import { StackActions } from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';


const EditProfile = ({route, navigation}) => {
  
   // initize pers info state hook
  const [userfullname, setUserfullname] = useState('');
  const [useremail, setUseremail] = useState('');
  const [useruni, setUseruni] = useState('');
  const [userhp, setUserhp] = useState('');
  const [userbio, setUserBio] = useState('');
  
    // Firestore setup
    const db = getFirestore();
    const profileRef = collection(db, 'users');

   //Retrieve personal information
   const getprofileinfo = async() => {
    var profiledetails = '';
    const q = query(profileRef, where("id", "==", auth.currentUser.uid));
    //const querySnapshot = await getDocs(q);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data());
      profiledetails = doc.data();
    });
    setUserfullname(profiledetails.name)
    setUseremail(profiledetails.email)
    setUserhp(profiledetails.handphone)
    setUserBio(profiledetails.bio)

     //setting user profile
    
     switch (profiledetails.originUni) {
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
    });
}
  

  useEffect(() => {
    getprofileinfo();
    return () => {
        setUserfullname(''); // Reset changes
        setUseremail('');
        setUserBio('');
        setUserhp('');
        setUseruni('');
      };
  }, []);

  
  async function sendSavedValues(entereduserfullname, entereduserhp, entereduserbio) {

        updateDoc(doc(db ,'users', auth.currentUser.uid), { 
            name: entereduserfullname,
            handphone: entereduserhp,
            bio: entereduserbio, 
            updatedAt: moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss')
        })
    }   

    return (
        <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
            <Text style={styles.title}> Edit your Profile Information</Text>
            <Text style={styles.titleinput} >Full Name</Text>
            <TextInput style = {styles.textinput} placeholder='Full name' placeholderTextColor={colors.white} value = {userfullname} onChangeText={(value) => setUserfullname(value)} />
            <Text style={styles.titleinput}> {'Handphone (if any)'}</Text>
            <TextInput style = {styles.textinput} placeholder='Enter your Handphone number' placeholderTextColor={colors.white} value = {userhp} onChangeText={(value) => setUserhp(value)} />
            <Text style={styles.titleinput}> {'Bio (if any)'}</Text>
            <TextInput style = {styles.bioinput} multiline = {true} placeholder='Enter your personal bio' placeholderTextColor={colors.white} value = {userbio} onChangeText={(value) => setUserBio(value)} />
            <Text style={styles.titleinput} >University</Text>
            <TextInput style = {styles.textinputuni} editable={false} placeholder='University name' placeholderTextColor={colors.white} value = {useruni} onChangeText={(value) => setUseruni(value)}/>
            <Text style={styles.titleinput} >Email</Text>
            <TextInput style = {styles.textinputuni} editable={false} placeholder='Email' placeholderTextColor={colors.white} value = {useremail} onChangeText={(value) => setUseremail(value)} />
            <Text style={styles.importanttext}>Note: University and Email are fixed and unique to every user. Please contact admin for any changes in these fields.</Text>
             
            
            <Text style={styles.importanttext}>Note: All these details above will be revealed to the other party upon any successful auction.</Text>

             <TouchableOpacity style = {styles.customBtnBG} onPress={() => {
                sendSavedValues(userfullname, userhp, userbio)
                .then((success) =>  {alert('Changes have been made successfully!')})
                .catch((error) => {alert(error.message)})
            }
            }
            >
                <Text style ={styles.customBtnText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity style = {styles.CPWcustomBtnBG} onPress={() => {
                    navigation.navigate('ChangePassword');
            }
            }
            >
                <Text style ={styles.CPWcustomBtnText}>Change Password</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 20,
      },
      
    title: {
      color: colors.darkbrown,
      textAlign: "center",
      fontFamily: "Montserrat-Black",
      fontSize: 16,
      marginBottom: 30,
    },

    titleinput : {
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: '10%'
    },

    text: {
      color: colors.darkbrown,
      fontSize: 12,
      marginVertical: 15,
      width: '80%',
      alignSelf: 'center'
    },

    
    importanttext: {
        color: colors.blue,
        fontSize: 12,
        fontWeight: 'bold',
        marginVertical: 15,
        width: '80%',
        alignSelf: 'center'
      },

    image: {
      alignSelf: "center",
      marginTop: 10,
      marginBottom: 30,
    },

    bioinput: {
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
      alignSelf: "center",
    },

    textdaysleft: {
        alignSelf:'center',
        color: colors.red,
        fontSize: 12,
        width: '80%',
        textAlign: 'center',
        fontWeight: 'bold',
        marginVertical: 5,
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
      marginTop: 20,
      backgroundColor: colors.darkbrown,
      paddingVertical: 15,
      borderRadius: 5,
      alignSelf: "center",
    },

    CPWcustomBtnText: {
        fontSize: 24,
        fontFamily: 'Montserrat-Black',
        color: colors.white,
        textAlign: "center",
      },
  
      CPWcustomBtnBG: {
        width: '80%',
        marginTop: 10,
        marginBottom: 100,
        backgroundColor: colors.green,
        paddingVertical: 15,
        borderRadius: 5,
        alignSelf: "center",
      },

    lockSection: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      alignSelf: "center",
    },

    lockIcon : {
      padding : 10,
      position: 'absolute',
      right: 10,
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

export default EditProfile;