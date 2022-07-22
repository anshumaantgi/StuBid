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
import NotificationView from '../views/NotificationView.js';
import { AsyncStorage } from 'react-native';


const EditProduct = ({route, navigation}) => {
  
  const UploadItemPhotoURI = Image.resolveAssetSource(UploadItemPhoto).uri
  
  //Auction ID from previous screen
  const aId = route.params.aId;

  //Check deleted
  const checkDeleted = true;
  
  // initize the state hook
  const [image, setImage] = useState(UploadItemPhotoURI);
  const [productdetails, setProductdetails] = useState('');
  const [biddingdetails, setBiddingdetails] = useState('');
  const [itemname, setItemname] = useState('');
  const [itemdesc, setItemdesc] = useState('');
  const [useruni, setUseruni] = useState('');
  const [startingprice, setStartingprice] = useState('');
  const [buyoutprice, setBuyoutprice] = useState('');
  const [auctiondocId, setAuctiondocId] = useState('');
  const [biddingdocId, setBiddingdocId] = useState('');

  //store uni name short form instead of full form into database
  var unicode = '';
  //image url
  var url = '';

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

   //Delete confirmation Dialogue Box
   const showConfirmDialog = () => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to delete this item from the listing?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            AsyncStorage.setItem('isItemDeleted',JSON.stringify(checkDeleted))
             sendDeleteValues(auctiondocId, biddingdocId, productdetails.allBiddersId, productdetails.anomName, productdetails.product.name)
                .then((success) =>  {
                    navigation.navigate('DeleteItemSuccess');
                })
                .catch((error) => {alert(error.message)})
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };

    // Firestore setup
    const db = getFirestore();
    const storage = getStorage();
    const productRef = collection(db, 'auctions'); 
    const biddingRef = collection(db, 'bids'); 

    // Retrieve product details from firestore via AuctionId
    const getproductlisting = async() => {
        var itemdetails = null;
        var dId = '';
        const q = query(productRef, where("auctionId", "==", aId));
        //const querySnapshot = await getDocs(q);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          itemdetails = doc.data();
          dId = doc.id;
        });
        setProductdetails(itemdetails);
        setAuctiondocId(dId);

        //Set initial values before any edits
        setImage(itemdetails.product.pictureUri)
        setItemname(itemdetails.product.name)
        setItemdesc(itemdetails.product.description)
        setValue(itemdetails.product.category)
        setValue2((itemdetails.product.activeDays).toString())
        setStartingprice((itemdetails.product.minPrice).toString())
        setBuyoutprice((itemdetails.product.buyPrice).toString())
        unicode = itemdetails.product.originUni;

        switch (itemdetails.product.originUni) {
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

     // Retrieve bidding details from firestore via AuctionId
     const getbiddinglisting = async() => {
        var biddinginfo = null;
        var dId = [];
        const q = query(biddingRef, where("auctionId", "==", aId));
        //const querySnapshot = await getDocs(q);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          biddinginfo = doc.data();
          dId.push(doc.id);
        });
        setBiddingdocId(dId);
        console.log(dId, dId.length, 'CHECK NUMBER OF BIDDING');
        dId = [];
        setBiddingdetails(biddinginfo);
    });
    }

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
  

  useEffect(() => {
    getproductlisting();
    getbiddinglisting();
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
    return () => {
        setProductdetails(''); // Reset changes
        setBiddingdetails('');
        setBiddingdocId('');
        setAuctiondocId('');
      };
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
        manipulateAsync(result.localUri || result.uri, [
        {resize: {width: 150, height: 150}},
        ],
        {compress: 0, format: ImageManipulator.SaveFormat.PNG});
          
        setImage(manipulateResult.uri);
        console.log(manipulateResult, "Manipulated Image");
    }
  
  };

  async function sendSavedValues(enteredimage, entereditemname, entereditemdesc, enteredcategory, enteredbidduration, enteredstartingprice, enteredbuyoutprice, enteredauctiondocId, enteredbiddingdocId) {
    if (!(enteredimage && entereditemname && entereditemdesc && enteredcategory && enteredbidduration && enteredstartingprice && enteredbuyoutprice )) {
      throw new Error("Please do not leave any fields empty!");
    } else if (parseInt(enteredbuyoutprice) <=  parseInt(enteredstartingprice)) {
        throw new Error("Buyout Bid must be higher than Starting Bid!");
    } else {
        //update storage (Note: each photo will overwrite with same auction ID, therefore do not need to delete existing photo)
        try {
        url =  await uploadImage(enteredimage, "products-image/" + aId + '.png');
        }
        catch (e) {
            // Deleted the product , assocaited with the auction if Auction not sotred in database
            const deleteRef = ref(storage, "products-image/" + aId + '.png');
            await deleteObject(deleteRef);
            // Error thrown to be show to the user
            throw new Error(e.message);
        }

        //in auction, update curr price ONLY if users has not bid yet.
        if (!enteredbiddingdocId.length) {
          await updateDoc(doc(db ,'auctions',enteredauctiondocId), { 
            'currPrice' : parseInt(enteredstartingprice),
          })
        }
      
        //in auction, update rest of the fields
      return await updateDoc(doc(db ,'auctions',enteredauctiondocId), { 
        'product.pictureUri' : url,
        'product.name' : entereditemname,
        'product.description' : entereditemdesc,
        'product.category' : enteredcategory,
        'product.activeDays': parseInt(enteredbidduration),
        'product.minPrice' : parseInt(enteredstartingprice),
        'product.buyPrice' : parseInt(enteredbuyoutprice),
        'product.updatedAt' : moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss'),
        'product.createdAt' : moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss'),
        'endingAt' : endbiddate,
    })

    }   
};

    async function sendDeleteValues(enteredauctiondocId, enteredbiddingdocId, enteredallbidders, enteredanomSeller, entereditemname) {
        console.log('item deleted from auction', enteredauctiondocId);
        console.log('item deleted from bids', enteredbiddingdocId, enteredbiddingdocId.length);
        await deleteDoc(doc(db ,'auctions', enteredauctiondocId)); //Delete from auctions
        if (enteredbiddingdocId.length) {
            for (let i = 0; i < enteredbiddingdocId.length; i++) {
                await deleteDoc(doc(db ,'bids', enteredbiddingdocId[i])); //Delete from bids
              }
        }
         // Deleted the product image from storage
         const deleteRef = ref(storage, "products-image/" + aId + '.png');
          // Delete the file
          await deleteObject(deleteRef).then(() => {
            // File deleted successfully
          }).catch((error) => {
            // Error thrown to be show to the user
            throw new Error(error.message);
          });


        //Notify deleted product to other buyers (if there are current ongoing existing bidders)
        if (enteredallbidders) {
          for (let i = 0; i < enteredallbidders.length; i++) {
              new NotificationView().createNotification(enteredallbidders[i], "We're sorry to inform you that " + enteredanomSeller + " has closed the product listing of " + entereditemname + ".", enteredauctiondocId);
          }
        }

    }

    async function uploadImage (uri , pictureName) {
        // Uploading Image to Storage and then retiriving the Downlaod link
        const response = await fetch(uri);
        const blob = await response.blob();
        const storage = getStorage();
        var storageRef = ref(storage , pictureName);
        await uploadBytes(storageRef, blob)
        return await getDownloadURL(storageRef);
        
    }
        

    return (
        <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
             <Text style={styles.title}> Edit item*</Text>
             <Text style={styles.text}> Click on the image below to re-upload your images!</Text>
             <TouchableOpacity style = {styles.image} onPress = {pickImage}>
              {image && <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />}
             </TouchableOpacity>
             <Text style={styles.titleinput} >Name of the item</Text>
             <TextInput style = {styles.textinput} placeholder='Name of the item' placeholderTextColor={colors.white} value = {itemname} onChangeText={(value) => setItemname(value)} />
             <Text style={styles.titleinput} >Item Description</Text>
             <TextInput style = {styles.textinput} placeholder='Item Description' placeholderTextColor={colors.white} value = {itemdesc} onChangeText={(value) => setItemdesc(value)} />
             <Text style={styles.titleinput} >University</Text>
            <TextInput style = {styles.textinputuni} editable={false} placeholder='University name' placeholderTextColor={colors.white} value = {useruni} onChangeText={(value) => setUseruni(value)}/>
            <Text style={styles.text}>University is automatically extracted from your input during the registration phase. </Text>
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
                style={{backgroundColor: colors.textinput, paddingVertical: 20, borderColor: '#fff'}}
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
                style={{backgroundColor: colors.textinput, paddingVertical: 20, borderColor: '#fff'}}
                placeholderStyle={{color: colors.white}}
                dropDownStyle = {{backgroundColor: colors.textinput}}
                labelStyle = {{color: colors.white}}
            />
            <Text style={styles.textdaysleft}> Start Bid Date: {startdate} </Text>
            <Text style={styles.textdaysleft}> End Bid Date: {displayendbiddate()} </Text>
            <Text style={styles.text}>Select your preferred Bid Duration. 'End Bid Date' will automatically specify the due date for the Auction.</Text>
             <Text style={[styles.title,{ marginBottom: 20}]}>Set Bidding/Buyout Price</Text>
             <Text style={styles.titleinput} >Starting Bid Price ($)</Text>
             <TextInput editable = {productdetails.allBiddersId ? false : true} style = {productdetails.allBiddersId ? styles.textinputuni: styles.textinput} placeholder='Starting Bid Price ($)' placeholderTextColor={colors.white} value = {startingprice} onChangeText={(value) => setStartingprice(value)} keyboardType='numeric' />
             <Text style={styles.text}>{productdetails.allBiddersId ? 'Note: Some user has already submitted a Bid! You are not allowed to change the Starting Bid Price.' : 'Note: If any user has already submitted a Bid, then you will not be allowed to change the Starting Bid Price.' }</Text>
             <Text style={styles.titleinput} >Buyout Bid Price ($)</Text>
             <TextInput style = {styles.textinput} placeholder='Buyout Bid Price ($)' placeholderTextColor={colors.white} value = {buyoutprice} onChangeText={(value) => setBuyoutprice(value)} keyboardType='numeric'/>
             <TouchableOpacity style = {styles.customBtnBG} onPress={() => {
                sendSavedValues(image, itemname, itemdesc, value, value2, startingprice, buyoutprice, auctiondocId, biddingdocId)
                .then((success) =>  {alert('Changes have been made successfully!')})
                .catch((error) => {alert(error.message)})
            }
            }
            >
                <Text style ={styles.customBtnText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity style = {styles.DELETEcustomBtnBG} onPress={() => {
                showConfirmDialog();
            }
            }
            >
                <Text style ={styles.DELETEcustomBtnText}>Delete Item</Text>
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
        marginLeft: '10%'
    },

    text: {
      color: colors.darkbrown,
      fontSize: 12,
      marginVertical: 15,
      width: '80%',
      alignSelf: 'center'
    },

    image: {
      alignSelf: "center",
      marginTop: 10,
      marginBottom: 30,
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

    DELETEcustomBtnText: {
        fontSize: 24,
        fontFamily: 'Montserrat-Black',
        color: colors.white,
        textAlign: "center",
      },
  
      DELETEcustomBtnBG: {
        width: '80%',
        marginTop: 10,
        marginBottom: 50,
        backgroundColor: colors.red,
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

export default EditProduct;