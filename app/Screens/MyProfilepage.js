import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, useWindowDimensions} from 'react-native';
import colors from '../config/colors.js';
import { doc, getDoc, getFirestore} from "firebase/firestore"; 
import { auth } from '../config/config.js';
import { TextInput } from 'react-native-gesture-handler';

const MyProfilepage = ({navigation}) => {

    // initize the state hook
    const [userfullname, setUserfullname] = useState('');
    const [useremail, setUseremail] = useState('');
    const [useruni, setUseruni] = useState('');

    const db = getFirestore();
    getDoc(doc(db, "users", auth.currentUser.uid)).then(docSnap => {
        if (docSnap.exists()) {
          //console.log("Document data:", docSnap.data());
          const data = docSnap.data();
          //for (let [key, value] of Object.entries(data)) {
            //console.log(`${key}: ${value}`);
          //}
          const originUni = data.originUni;
          const fullname = data.name;
          const email = data.email;

          //setting user profile
          setUserfullname(fullname);
          setUseremail(email);
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
             <Text style={{ fontSize: 16, fontWeight: 'bold' }}> Welcome {userfullname} </Text>
             <Text style={{ fontSize: 16, fontWeight: 'bold' }}> Email:  {useremail} </Text>
             <Text style={{ fontSize: 16, fontWeight: 'bold' }}> School:  {useruni} </Text>

            <Text
                onPress={() => {auth.signOut(); navigation.navigate("LogoutSuccess");}}
                style={{ fontSize: 26, fontWeight: 'bold', marginTop: 50 }}> Click here to Logout
            </Text>
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

export default MyProfilepage;