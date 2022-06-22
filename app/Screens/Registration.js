import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import colors from '../config/colors.js';
import RegisterationView from '../views/RegisterationView.js'
import {auth, db} from '../config/config.js'
import { SafeAreaView } from 'react-native-safe-area-context';

const Registration = ({navigation}) => {

    // initize the state hook
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [unimatchaddress, setUnimatchaddress] = useState('');


    // Picker
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
      {label: 'National University of Singapore (NUS)', value: 'NUS'},
      {label: 'Nanyang Technological University (NTU)', value: 'NTU'},
      {label: 'Singapore Management University (SMU)', value: 'SMU'},
      {label: 'Singapore Institute of Technology (SIT)', value: 'SIT'},
      {label: 'Singapore University of Technology & Design (SUTD)', value: 'SUTD'},
      {label: 'Singapore University of Social Sciences (SUSS)', value: 'SUSS'},
      {label: 'For debugging/testing purpose (GMAIL)', value: 'GMAIL'},
    ]);

    async function sendValues(enteredfullname, selectuniname, enteredemail, enteredpassword, enteredrepassword) {
        return await new RegisterationView(db, auth).createUser(enteredfullname, enteredemail,selectuniname, enteredpassword, enteredrepassword);
    };

    function FindUniMatchAddress(selectuniname) {
        switch (selectuniname) {
            case "NUS" :
                // Do work here
                //console.log('@u.nus.edu');
                setUnimatchaddress('@u.nus.edu');
                break;
            case "NTU" :
                // Do work here
                //console.log('@e.ntu.edu.sg');
                setUnimatchaddress('@e.ntu.edu.sg');
                break;
            case "SMU" :
                // Do work here
                //console.log('@smu.edu');
                setUnimatchaddress('@smu.edu');
                break;
            case "SIT" :
                // Do work here
                //console.log('@sit.singaporetech.edu.sg');
                setUnimatchaddress('@sit.singaporetech.edu.sg');
                break;
            case "SUTD" :
                // Do work here
                //console.log('@sutd.edu.sg');
                setUnimatchaddress('@sutd.edu.sg');
                break;
            case "SUSS" :
                // Do work here
                //console.log('@suss.edu.sg');
                setUnimatchaddress('@suss.edu.sg');
                break;
            case "GMAIL" :
                // Do work here
                //console.log('@suss.edu.sg');
                setUnimatchaddress('@gmail.com');
                break;
            default :
                // Do work here
                console.log('Uni not listed here');
                break;
        }
    }


    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
        <SafeAreaView style={styles.container}>
            <Image style = {styles.logo} source = {require('../assets/StuBid-Logo-Original-ver.png')} resizeMode = "contain" /> 
            <TextInput style = {styles.textinput} placeholder='Full Name' placeholderTextColor={colors.white} value = {fullname} onChangeText={(value) => setFullname(value)}/>
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
                    FindUniMatchAddress(value);
                  }}
                placeholder="Name of University"
                containerStyle={{width: '80%', marginVertical: 10}}
                style={{backgroundColor: colors.textinput, paddingVertical: 20, borderColor: '#fff'}}
                placeholderStyle={{color: colors.white}}
                dropDownStyle = {{backgroundColor: colors.textinput}}
                labelStyle = {{color: colors.white}}

            />
            <View style={{flexDirection: 'row'}}>
                <TextInput style = {styles.textinputemail} placeholder='Email Username (Only)' placeholderTextColor={colors.white} value = {email} onChangeText={(value) => setEmail(value)} keyboardType="email-address"/>
                <TextInput style = {styles.text} editable = {false} value  = {unimatchaddress} placeholder='@university.sg' placeholderTextColor={colors.white}/>
            </View>
            <TextInput style = {styles.textinput} placeholder='Password' placeholderTextColor={colors.white} value = {password} onChangeText={(value) => setPassword(value)} secureTextEntry={true}/>
            <TextInput style = {styles.textinput} placeholder='Re-Enter Password' placeholderTextColor={colors.white} value = {repassword} onChangeText={(value) => setRepassword(value)} secureTextEntry={true}/>
            <TouchableOpacity style = {styles.customBtnBG} onPress={() => {
                sendValues(fullname, value, email + unimatchaddress, password, repassword)
                .then((success) =>  {navigation.navigate("VerifyEmailSuccess")})
                .catch((error) => {alert(error.message)})
            }
        }
            >
                <Text style ={styles.customBtnText}>Create Account</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.returnlogintext}>Have an account?  </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style ={styles.logintext}>Login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({

    bold: {fontWeight: 'bold'},
    italic: {fontStyle: 'italic'},
    underline: {textDecorationLine: 'underline'},

    container: {
        flex: 1,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: '20%',
      },

    logo: {
        width: '100%',
        marginVertical: '-40%',
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

    textinputemail: {
        backgroundColor: colors.textinput,
        width: '50%',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginVertical: 10,
        color: colors.white,
    },

    text: {
        fontSize: 12,
        backgroundColor: colors.darkbrown,
        width: '30%',
        color: colors.white,
        textAlign: "center",
        fontFamily: "Montserrat-Black",
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginVertical: 10,
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

    forgetpasswordtext: {
        color: colors.darkbrown,
        textDecorationLine: 'underline',
        marginLeft: '50%',
        fontWeight: 'bold',

    },

    returnlogintext : {
        color: colors.darkbrown,
    },

    logintext :{
        color: colors.darkbrown,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },

    dropdownuni: {
        backgroundColor: colors.textinput,
        width: '80%',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginVertical: 10,
        color: colors.white,
    },
})

export default Registration;