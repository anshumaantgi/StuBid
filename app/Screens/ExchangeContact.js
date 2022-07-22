import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, FlatList,ActivityIndicator, RefreshControl, Alert} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import colors from '../config/colors.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, query, orderBy, getDoc, getDocs, getFirestore, doc, where, onSnapshot, updateDoc, deleteDoc} from "firebase/firestore"; 
import {uploadBytes, ref, getDownloadURL,deleteObject, getStorage} from 'firebase/storage';
import { StackActions } from '@react-navigation/native';
import { auth,db } from '../config/config.js';
import { async } from '@firebase/util';
import {FilterContext} from './MainContainer.js';
import Modal from "react-native-modal";
import Bid from '../models/Bid.js';
import BidCreateView from '../views/BidCreateView.js';
import moment from "moment-timezone";
import { Rating, AirbnbRating } from 'react-native-ratings';
import Review from '../models/Review.js';
import ReviewView from '../views/ReviewView.js';
import NotificationView from '../views/NotificationView.js';

   
const ExchangeContact= ({route, navigation}) => {

    //Set up Modal (Pop-up screen) when accept bid button is pressed, etc
    const [isModalVisible, setModalVisible] = useState(false);
     //Accept bid option toggle
     const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

     //Auction ID from previous screen
     const aId = route.params.auctionId;

    //initialise state hook
    const [productdetails, setProductdetails] = useState('');
    const [reviewdetails, setReviewdetails] = useState('');
    const [userfullname, setUserfullname] = useState('');
    const [useremail, setUseremail] = useState('');
    const [useruni, setUseruni] = useState('');
    const [userhp, setUserhp] = useState('');
    const [userbio, setUserBio] = useState('');
    const [userid, setUserid] = useState('');
    const [userrating, setUserrating] = useState(0);
    const [usercomments, setUsercomments] = useState('');

    const [docId, setDocId] = useState('');

    // Firestore setup
    const db = getFirestore();
    const storage = getStorage();
    const productRef = collection(db, 'auctions'); 
    const reviewRef = collection(db, 'reviews');

     //Send Sellout details to Firestore
     async function sendReviewvalues(aId, sender, receiver, entereduserrating, enteredusercomments, entereditemName, enteredpictureUri) {
        if (!entereduserrating) {
            throw new Error("Please provide a rating score!");
        }
        else if (!enteredusercomments) {
            throw new Error("Please provide a comment/feedback for the user!");
        }

        toggleModal();// close the dialog box

        console.log(entereduserrating)
        console.log(enteredusercomments)
        console.log(sender)
        console.log(receiver)
        console.log(aId)

        //Send the other party receiver that you have left a review
        new NotificationView().createNotification(receiver, "Hurray! Someone has left you a review for this item!", docId);

         /** 
         * Functions Sends Values to the Functional Class Review View
         */
        return await new ReviewView(db, auth).createReview(aId, sender, receiver, entereduserrating, enteredusercomments, entereditemName, enteredpictureUri);
        
    }

    //Send delete values to delete item if product terminated prematurely without any bidders
    async function sendDeleteValues(enteredauctiondocId) {
        console.log('item deleted from auction', enteredauctiondocId);

        await deleteDoc(doc(db ,'auctions', enteredauctiondocId)); //Delete from auctions

         // Deleted the product image from storage
         const deleteRef = ref(storage, "products-image/" + aId + '.png');
          // Delete the file
         await deleteObject(deleteRef).then(() => {
            // File deleted successfully
          }).catch((error) => {
            // Error thrown to be show to the user
            throw new Error(error.message);
    });
    }


    // Retrieve product details from firestore via AuctionId
    const getproductlisting = async() => {
        var itemdetails = '';
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
        setDocId(dId);
       //check if product selling is buyer or seller. If seller, get userinfo for buyers. If buyer, get userinfo for sellers

       if (itemdetails.leadBuyerId) { // assign only if there is leadBuyer NOT when there are termination prematurely without bidders if bid duration ends
        itemdetails.product.ownerId == auth.currentUser.uid ? getuserinfo(itemdetails.leadBuyerId) : getuserinfo(itemdetails.product.ownerId)
       }

    });
    }

    // Retrieve review details from firestore via AuctionId (Purpose is to check if user have done review yet)
      const getreviews = async() => {
        var reviewinfo = null;
        const q = query(reviewRef, where("auctionId", "==", aId), where("senderId", "==", auth.currentUser.uid));
        //const querySnapshot = await getDocs(q);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          reviewinfo = doc.data();
        });
        setReviewdetails(reviewinfo);

        });
        }

     // Retrieve user details from firestore via AuctionId to display contact later
     const getuserinfo = (userid) => {
        getDoc(doc(db, "users", userid)).then(docSnap => {
        if (docSnap.exists()) {
          //console.log("Document data:", docSnap.data());
          const data = docSnap.data();
          //for (let [key, value] of Object.entries(data)) {
            //console.log(`${key}: ${value}`);
          //}
          const originUni = data.originUni;
          const fullname = data.name;
          const email = data.email;
          const hp = data.handphone;
          const bio = data.bio;
          const userid = data.id;

          //setting user profile
          setUserfullname(fullname);
          setUseremail(email);
          setUserhp(hp);
          setUserBio(bio);
          setUserid(userid);
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
    }

    //Execute and get products, etc
    useEffect(() => {
        getproductlisting();
        getreviews();

        return () => {
            setProductdetails(''); // Reset changes
            setReviewdetails('');
            setUserfullname('');
            setUseremail('');
            setUseruni('');
            setUserhp('');
            setUserBio('');
            setUserid('');
            setUserrating(0);
            setUsercomments('');
            setDocId('');
          };
    }, []);


    const getcategory = () => {
        var category = '';
        if (productdetails) {
            switch (productdetails.product.category) {
                case "CA" :
                    // Do work here
                    //console.log('@u.nus.edu');
                    category = 'Clothing & Accessories';
                    break;
                case "ELE" :
                    // Do work here
                    category = 'Electronics';
                    break;
                case "ENT" :
                    // Do work here
                    category = 'Entertainment';
                    break;
                case "HB" :
                    // Do work here
                    category = 'Hobbies';
                    break;
                case "HG" :
                    // Do work here
                    category = 'Home & Garden';
                    break;
                case "HR" :
                    // Do work here
                    category = 'Housing (Rental)';
                    break;
                case "VEH" :
                    // Do work here
                    category = 'Vehicles';
                    break;
                case "OTH" :
                    // Do work here
                    category = 'Others';
                    break;
                default :
                    // Do work here
                    console.log('Category not listed here');
                    break;
                }
        }
        else {
            category = 'Loading...';
        }
        return category; 
    }

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
            
             sendDeleteValues(docId)
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
    

    return (
               !!productdetails && 
                    <ScrollView style={styles.container}>
                    <View style = {styles.list}>
                        <Image source = {{uri : productdetails.product.pictureUri}} style = {styles.listImage} />
                        <View style = {styles.listingContainer}>
                    <View style = {styles.container}>
                        <Text style= {styles.name}>{productdetails.product.name}</Text>
                    </View>
                </View>
                <View style = {styles.descriptionContainer}>
                    <Text style = {styles.description}>Description:</Text>
                    <Text style = {styles.descriptiontext}>{productdetails.product.description}</Text>
                </View>
                        <View style = {{flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between'}}>
                        <View>
                            <View style = {styles.date_publishedcontainer}>
                                <Ionicons style={styles.lockIcon} name={'calendar-outline'} size={16} color={colors.black} />
                                <Text style = {styles.date_published}> {productdetails.createdAt}</Text>
                            </View>
                            <View style = {styles.uninamecontainer}>
                                <Ionicons style={styles.lockIcon} name={'school-outline'} size={16} color={colors.black} />
                                <Text style = {styles.uniname}> {productdetails.product.originUni}</Text>
                            </View>
                            <View style = {styles.catnamecontainer}>
                                <Ionicons style={styles.lockIcon} name={'list-circle-outline'} size={16} color={colors.black} />
                                <Text style = {styles.catname}> {getcategory()}</Text>
                            </View>
                            <View style = {styles.currentpriceContainer}>
                                <Text style = {styles.dollarsign}>$</Text>
                                <Text style = {styles.currentprice}>{productdetails.currPrice}</Text>
                                <Ionicons style={styles.lockIcon} name={'caret-up-circle-outline'} size={27} color={colors.red} />
                            </View>
                        </View>
                        <View>
                        <View style = {styles.startbuybidContainer}>
                            <Text style = {styles.startingbid}>Starting Bid: ${productdetails.product.minPrice}</Text>
                            <Text style = {styles.buyoutbid}>Buyout Bid:  ${productdetails.product.buyPrice}</Text>
                        </View>
                        <View style = {styles.activedaycontainer}>
                            <Text style = {styles.activeday}>Auction Closed:</Text>
                            <Text style = {styles.activeday}>{productdetails.updatedAt}</Text>
                        </View>
                        </View>
                    </View>
                    {!productdetails.leadBuyerId ?
                    <>
                         <Text style = {styles.alertnotice}>Product has terminated as Bid Duration has ended and there are no ongoing bidders. Please delete the item and upload a brand new auction.</Text>
                         <TouchableOpacity style = {styles.DELETEcustomBtnBG} onPress={() => {
                           
                                //alert("DELETE item")
                                showConfirmDialog();

                            }}> 
                            <Text style ={styles.DELETEcustomBtnText}>Delete Item</Text>
                    </TouchableOpacity>
                    </> 
                    :
                    <>
                    <Text style = {styles.currentbid}>Contact Information:</Text>
                    <View style = {styles.contactinfocontainer}>
                        <View style = {{flexDirection: 'row',  alignItems: 'center'}}>
                            <Text style = {styles.contactinfodesc}>Role: </Text>
                            <Text style = {styles.contactinfotext}>{productdetails.product.ownerId == auth.currentUser.uid ? 'Buyer/Bidder' : 'Seller'}</Text>
                        </View>
                        <View style = {{flexDirection: 'row',  alignItems: 'center'}}>
                            <Text style = {styles.contactinfodesc}>Full Name: </Text>
                            <Text style = {styles.contactinfotext}>{userfullname}</Text>
                            
                        </View>
                        <View style = {{flexDirection: 'row',  alignItems: 'center'}}>
                            <Text style = {styles.contactinfodesc}>Email: </Text>
                            <Text style = {styles.contactinfotext}>{useremail}</Text>
                        </View>
                        <View style = {{flexDirection: 'row',  alignItems: 'center'}}>
                            <Text style = {styles.contactinfodesc}>School: </Text>
                            <Text style = {styles.contactinfotext}>{useruni}</Text>
                        </View>
                        <View style = {{flexDirection: 'row',  alignItems: 'center'}}>
                            <Text style = {styles.contactinfodesc}>{'Handphone (if provided):'} </Text>
                            <Text style = {styles.contactinfotext}>{userhp}</Text>
                        </View>
                        <View style = {{flexDirection: 'row',  alignItems: 'center'}}>
                            <Text style = {styles.contactinfodesc}>{'Personal Bio (if provided):'} </Text>
                            <Text style = {styles.contactinfotext}>{userbio}</Text>
                        </View>
                    </View> 

                    <TouchableOpacity style = {styles.LARcustomBtnBG} onPress={() => {
                        //alert("Leave a Review")
                        if (reviewdetails) {
                            alert("You have already left a review!")
                        }
                        else {
                            toggleModal();
                        }
                        }}>
                        <Text style ={styles.LARcustomBtnText}>Leave a Review</Text>
                    </TouchableOpacity>

                    <Modal 
                            isVisible={isModalVisible}
                            animationIn="zoomInDown"
                            animationOut="zoomOutUp"
                            animationInTiming={1000}
                            animationOutTiming={1000}
                            backdropTransitionInTiming={600}
                            backdropTransitionOutTiming={600}>
                    
                        <ScrollView style={styles.popupmenu} contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
                            <Text style = {styles.currentbid}>Leave a Review/Feedback</Text>
                            <View style = {styles.userprofile}>
                                <Text style = {styles.userprofilename}>{userfullname}</Text>
                            </View>
                            <Image source = {{uri : productdetails.product.pictureUri}} style = {styles.listImage} />
                            <Text style = {styles.title}>{productdetails.product.name}</Text>
                                <Rating

                                    ratingCount={5}
                                    imageSize={30}
                                    showRating
                                    startingValue = {userrating}
                                    onFinishRating = {setUserrating}
                                />
                            <TextInput 
                                style = {styles.comments} 
                                placeholder='Enter your comments' 
                                placeholderTextColor={colors.white} 
                                multiline={true}
                                value = {usercomments} 
                                onChangeText={(value) => setUsercomments(value)}
                                />
                            <Text style = {styles.termsandcondition}>
                            By tapping on Confirm, I agree that my feedback will be 
                            delivered to the other party. Also, any feedbacks listed here are anonymous.
                            </Text>
                            <View style = {styles.SELLcontainer}>
                            <TouchableOpacity style = {styles.ACCEPTcustomBtnBG} onPress={() => {
                                //alert("Confirm Leave Review")
                                 sendReviewvalues(aId, auth.currentUser.uid, userid, userrating, usercomments, productdetails.product.name, productdetails.product.pictureUri)
                                .then((success) =>  {navigation.navigate("ReviewSuccess")})
                                .catch((error) => {alert(error.message)})
                            }}> 
                            <Text style ={styles.ACCEPTcustomBtnText}>Confirm</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style = {styles.CANCELcustomBtnBG} onPress={() => {
                                toggleModal();
                            }}>
                            <Text style ={styles.CANCELcustomBtnText}>Cancal</Text>
                            </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </Modal> 
                    </> }
            </View>  
          
                    </ScrollView> 

               
             
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    header: {
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
      },

    title: {
        fontSize: 20,
        color: colors.darkbrown,
        fontFamily: "Montserrat-Black",
        marginVertical: 20,
        alignSelf: 'center',
    
    },

    
    list: {
        width: '100%',
        flexDirection: 'column',
        marginBottom: 20,
        paddingHorizontal: 10,
        
    },

    listImage: {
        width: 300,
        height: 300,
        alignSelf: 'center',
    },

    listingContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },

    name: {
        fontWeight: 'bold',
        fontSize: 25,
        color: colors.darkbrown,
    },

    descriptionContainer: {
        color: colors.darkbrown,
        alignItems: 'stretch',
        height: 55,
        borderWidth: 0.2,
        borderStyle: 'dashed',
    },

    description: {
        fontSize: 12,
        color: colors.darkbrown,
    },

    descriptiontext: {
        fontSize: 12,
        color: colors.textinput,
    },

    currentpriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    currentprice: {
        color: colors.orange,
        fontWeight: 'bold',
        fontSize: 25,
    },

    dollarsign: {
        color: colors.orange,
        fontWeight: 'bold',
        fontSize: 25,
    },

    selleranonymouscontainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    selleranonymous : {
        color: colors.darkbrown,
        fontSize: 16,
    },

    uninamecontainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    uniname: {
        color: colors.darkbrown,
        fontSize: 10,
    },

    catnamecontainer : {
        flexDirection: 'row',
        alignItems: 'center',
    },

    catname : {
        color: colors.darkbrown,
        fontSize: 10,
    },

    date_publishedcontainer : {
        flexDirection: 'row',
        alignItems: 'center',
    },

    date_published : {
        color: colors.darkbrown,
        fontSize: 10,
    },

    customBtnText: {
        fontSize: 12,
        fontFamily: 'Montserrat-Black',
        color: colors.white,
        textAlign: "center",
    },

    bidcontainer: {
        alignItems: 'center',
        justifyCOntent: 'space-between',
    },

    activedaycontainer: {
        backgroundColor: colors.activeday,
        padding: 5,
        borderRadius: 5,
        marginTop: 5,
    },

    activeday: {
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
    },

    activedaytext: {
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
    },

    startbuybidContainer : {
        backgroundColor: colors.red,
        padding: 5,
        borderRadius: 5,
        marginTop: 5,
    },

    startingbid: {
        color: colors.white,
        fontWeight: 'bold',
        textAlign:'center',
    },

    buyoutbid: {
        color: colors.white,
        fontWeight: 'bold',
        textAlign:'center',
    },

    currentbid: {
      color: colors.darkbrown,
      textAlign: "center",
      fontFamily: "Montserrat-Black",
      fontSize: 16,
      marginBottom: 10,
      marginTop: 30,
    },

    buyerbidcontainer: {
        paddingHorizontal: 10,
        borderWidth: 0.2,
        borderColor: colors.darkbrown,
        borderRadius: 15,
    },

    buyeranonymous : {
        color: colors.blue,
        textAlign: "center",
        fontWeight: 'bold',
    },

    buyeranonymousname : {
        color: colors.gold,
        textAlign: "center",
        fontWeight: 'bold',
        fontFamily: "Montserrat-Black",
    },

    buyeranonymousdate : {
        color: colors.black,
        textAlign: "center",
    },

    buttoncontainer : {
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderWidth: 0.2,
        borderStyle: 'dashed',
        borderColor: colors.darkbrown,
        flexDirection: 'row',  
        alignItems: 'center', 
        marginTop: 20,
        justifyContent: 'space-between',
    },


    LARcustomBtnBG: {
        marginTop: 20,
        backgroundColor: colors.gold,
        borderRadius: 5,
        padding: 15,
    },

    LARcustomBtnText: {
        fontSize: 24,
        fontFamily: 'Montserrat-Black',
        color: colors.white,
        textAlign: "center",
    },

    popupmenu: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 20,
    },

    termsandcondition : {
        fontSize: 12,
        color: colors.darkbrown,
        marginTop: 20,
        alignSelf: 'center',
    },

    SELLcontainer: {
        flexDirection: 'row',  
        margin: 20,
        alignSelf: 'center',
        
    },

    ACCEPTcustomBtnBG: {
        backgroundColor: colors.gold,
        padding: 15,
        borderRadius: 5,
        marginHorizontal: 20,

    },

    ACCEPTcustomBtnText: {
        fontSize: 24,
        fontFamily: 'Montserrat-Black',
        color: colors.white,
        textAlign: "center",
    },

    CANCELcustomBtnBG: {
        backgroundColor: colors.black,
        borderRadius: 5,
        padding: 15,
        marginHorizontal: 20,
    },

    CANCELcustomBtnText: {
        fontSize: 24,
        fontFamily: 'Montserrat-Black',
        color: colors.white,
        textAlign: "center",
    },

    currenthighestbiddertext : {
        color: colors.red,
        textAlign: "center",
        marginTop: 20,
        fontWeight: 'bold',
    },

    highestbiddercontainer : {
        flexDirection: 'row',  
        alignItems: 'center',
        justifyContent: 'space-between' ,
        width: '100%',
        borderWidth: 0.5,
        borderStyle: 'dashed',
        borderRadius: 20,
        padding: 10,
        marginTop: 10,
    },

    overallBiddingContainer : {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.lightbrown,
        borderWidth: 0.2,
    },

    numofbidsplaced : {
        color: colors.white,
        fontWeight: 'bold',
        textAlign: "center",
        marginBottom: 10,
        backgroundColor: colors.activeday,
    },

    overallLeadingbiddercontainer: {
        borderWidth: 1,
        borderRadius: 20,
        paddingTop: 10,
        borderStyle: 'dashed',
        width: '60%',
        alignSelf: 'center',
        marginBottom: 10,
      },
  
      leadingbiddercontainer : {
          flexDirection: 'row',
          alignSelf: 'center',
      },
  
      leadingbidder : {
          color: colors.orange,
          fontWeight: 'bold',
          textAlign: "center",
          fontFamily: 'Montserrat-Black',
          marginBottom: 10,
          fontSize: 20,
      },

      contactinfocontainer : {
        width: '80%',
        borderWidth: 1,
        alignSelf: 'center',
     
      },

      contactinfodesc : {
        color: colors.darkbrown,
        fontWeight: 'bold',
        margin: 5,
      },

      contactinfotext : {
        color: colors.blue,
      },

      userprofile : {
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 20,
      },

      userprofilename : {
        color: colors.gold,
        fontWeight: 'bold',
        fontFamily: 'Montserrat-Black',
        fontSize: 20,
        alignSelf: 'center',
      },

      
    comments: {
        backgroundColor: colors.textinput,
        width: '80%',
        height: 100,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginVertical: 10,
        color: colors.white,
        alignSelf: 'center',
    },

    DELETEcustomBtnText: {
        fontSize: 24,
        fontFamily: 'Montserrat-Black',
        color: colors.white,
        textAlign: "center",
      },
  
    DELETEcustomBtnBG: {
        width: '80%',
        marginTop: 20,
        marginBottom: 50,
        backgroundColor: colors.black,
        paddingVertical: 15,
        borderRadius: 5,
        alignSelf: "center",
      },

    alertnotice :{
        color: colors.red,
        fontFamily: 'Montserrat-Black',
        textAlign: 'center',
        marginTop: 100,
    }
})

export default ExchangeContact;