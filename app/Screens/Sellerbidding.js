import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, FlatList,ActivityIndicator, RefreshControl} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import colors from '../config/colors.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, query, orderBy, getDoc, getDocs, getFirestore, doc, where, onSnapshot, updateDoc} from "firebase/firestore"; 
import { auth,db } from '../config/config.js';
import { async } from '@firebase/util';
import {FilterContext} from './MainContainer.js';
import Modal from "react-native-modal";
import Bid from '../models/Bid.js';
import BidCreateView from '../views/BidCreateView.js';
import moment from "moment-timezone";
import NotificationView from '../views/NotificationView.js';

   
const Sellerbidding = ({route, navigation}) => {

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
    const [docId, setDocId] = useState('');
    const [bidders, setBidders] = useState([]);
    const [userbidprice, setUserbidprice] = useState('');
    const [id, setId] = useState(null);
    const [latestbidder, setLatestbidder] =  useState(null);

    // Firestore setup
    const db = getFirestore();
    const biddingRef = collection(db, 'bids'); 
    const productRef = collection(db, 'auctions'); 

     //Send Sellout details to Firestore
     async function sendselloutvalues(entereddocId, enteredbuyerId) {
        toggleModal();// close the dialog box

        //Terminate Auction , cuz seller is accepting the Bid
        updateDoc(doc(db ,'auctions',entereddocId), { 
            ongoing: false,
            updatedAt: moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss')
        })

        return new NotificationView().createNotification(enteredbuyerId, "Congratulations! You have successfully won the auction. Click here to view Seller's Contact Information", docId);
    }

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
        setDocId(dId);
    });
    }

    // Retrieve current latest bidder information from firestore via AuctionId
    const getlatestbidder = async() => {
        var latestanon = [];
        const q = query(biddingRef, orderBy("bidPrice", "desc"), where("auctionId", "==", aId));
        //const querySnapshot = await getDocs(q);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          latestanon.push(doc.data()); // push all current bidder id to array
        });
        setLatestbidder(latestanon[0]); //extract the most recent bidder anon name
        //console.log(latestanon[0], "WOOOWW");
        latestanon = [] // reason for setting array empty here is because this is realtime querying and we need to reset it
    });
    }

     //Bid Id auto-accumulator
     const getId = async()=> {
        var count = 0;
        const db = getFirestore();
        const q = query(biddingRef, where("auctionId", "==", aId));
        //console.log(aId, 'WEEEE');
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
        //const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            count = count + 1
            }
            )
            setId(count);
            count = 0; // reason for setting count = 0  here is because this is realtime querying and we need to reset it
            // console.log("CAAAADDD", count)
            // console.log("CAAAADDD", id)
         });
    
            };

    //Execute and get products, etc
    useEffect(() => {
        getproductlisting();
        getId();
        getBidding();
        getlatestbidder();
        return () => {
            setProductdetails(''); // Reset changes
            setId(null);
            setLatestbidder('');
          };
        
    }, []);

    const getBidding = async () => {
        // Query the first page of docs
        const first = query(biddingRef, orderBy("bidPrice", "desc"),  where("auctionId", "==", aId));
    
        const unsubscribe = onSnapshot(first, (querySnapshot) => {
        //const documentSnapshots = await getDocs(first);
    
            if (!querySnapshot.empty) {
                let newBidding = [];
    
                for (let i = 0; i < querySnapshot.docs.length; i++) {
                    newBidding.push(querySnapshot.docs[i].data());
                   // console.log(newBidding);
                }
    
                setBidders(newBidding);
            } else {
                setBidders([]);
                //alert('There are currently no bids for this product.');
            }
            });
        }

    //render list from all buyer biddings (fields from figma prototype in "Current Bids")
    const renderList = ({bidderAnomname, bidPrice, createdAt, bidderId}) => {
          
        return (
        <View style = {styles.overallBiddingContainer}>
             <Ionicons style={styles.lockIcon} name={'eye-off-outline'} size={20} color={colors.red} />
             <View>
                <View style = {{flexDirection: 'row'}}>
                <Text style = {styles.buyeranonymous}>Bid placed by: </Text>
                <TouchableOpacity onPress={() => {
                    //alert("Bidder/Buyer Review Page")  
                    navigation.navigate('ViewReviews', {reviewerId : bidderId, reviewerName : bidderAnomname});  
                    }}> 
                    <Text style = {styles.buyeranonymousname}>
                    {
                        ' ' + bidderAnomname
                    }
                    </Text>
                </TouchableOpacity>
             </View>
                <Text style = {styles.buyeranonymousdate}>{createdAt}</Text>
            </View>
             <View style = {styles.currentpriceContainer}>
                <Text style = {styles.dollarsign}>$</Text>
                <Text style = {styles.currentprice}>{bidPrice}</Text>
                <Ionicons style={styles.lockIcon} name={'caret-up-circle-outline'} size={27} color={colors.red} />
            </View>
        </View>
             
        )
    }

    const onRefresh = () => {
        setTimeout(() => {
            getBidding();
          }, 1000);
    }

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

    const ItemDivider = () => {
        return (
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: colors.darkbrown,
            }}
          />
        );
      }

      const checkDaysLeft = (endingDate, auctionDocId) => {

        var given = moment(endingDate, 'DD/MM/YYYY') ;
        var current = moment(moment().tz('Singapore').format('DD/MM/YYYY'), 'DD/MM/YYYY')
        
        //Difference in number of days
        var diffDays = moment.duration(given.diff(current)).asDays();
        //console.log(diffDays);
        if (diffDays) {
            return diffDays;
        }
        else
        {
            //Close and terminate auction
            //return new TerminateAuctionView().closeListing(auctionDocId);
            updateDoc(doc(db ,'auctions', auctionDocId), { 
                ongoing: false,
                updatedAt: moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss')
            })
        }
    }

    

    return (
            <FlatList
                ListHeaderComponent =
                {productdetails &&
                    <View style={styles.container}>
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
                            <View style = {styles.selleranonymouscontainer}>
                                <Ionicons style={styles.lockIcon} name={'eye-off-outline'} size={20} color={colors.red} />
                                <TouchableOpacity onPress={() => {
                                    //alert("Seller Review Page")
                                    navigation.navigate('ViewReviews', {reviewerId : productdetails.product.ownerId, reviewerName : productdetails.anomName});
                       
                                }}> 
                                <Text style = {styles.selleranonymous}> {productdetails.anomName} </Text>
                                </TouchableOpacity>
                            </View>
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
                            <Text style = {styles.activeday}>
                            {checkDaysLeft(productdetails.endingAt, productdetails.auctionDocId) && productdetails.ongoing  ? 'Bid Ending in:' : 'Auction Closed:'}
                            </Text>
                            <Text style = {styles.activedaytext}>
                            {checkDaysLeft(productdetails.endingAt, productdetails.auctionDocId) && productdetails.ongoing ? checkDaysLeft(productdetails.endingAt, productdetails.auctionDocId) + ' Days': productdetails.updatedAt} 
                            </Text>
                        </View>
                        </View>
                    </View>
                
            </View>
           <View>
                <View style = {styles.overallLeadingbiddercontainer}>
                    <View style = {styles.leadingbiddercontainer}>
                        <Ionicons style={styles.lockIcon} name={'trophy'} size={20} color={colors.gold} />
                        <Text style = {styles.currentbid}> Leading Bidder </Text>
                        <Ionicons style={styles.lockIcon} name={'trophy'} size={20} color={colors.gold} />
                    </View>
                    <Text style = {styles.leadingbidder}>{latestbidder && latestbidder.bidderAnomname}</Text>
                </View>
                <Text style = {styles.currentbid}>Current Bids: </Text>
                <Text style = {styles.numofbidsplaced}>Number of Bids: {id}</Text>
                <Text style = {styles.nobidsnotice}>{bidders.length ? '' : 'There are currently no bids for this product.'}</Text>
           </View>
           </View>
                }

                ListFooterComponent =
                {productdetails && 
                    <View>
                        <View style = {styles.buttoncontainer}>
                        <TouchableOpacity style = {styles.EDITcustomBtnBG} onPress={() => {

                        if (!checkDaysLeft(productdetails.endingAt, productdetails.auctionDocId)) {
                            alert("Auction is closed as bid duration has just exceeded. Please proceed to homepage and refresh.")
                        }
                        else if (!(productdetails.ongoing)) {
                            alert("Someone has just bought out your item! You can now exchange contact with the buyer!")
                        }
                        else { 
                            //alert("Edit item")
                            navigation.navigate('EditItem', {aId})
                        }
                        }}> 
                        <Text style ={styles.EDITcustomBtnText}>Edit Item</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.ACCBIDcustomBtnBG} onPress={() => {
                        //alert("Accept a Bid")
                        if (!checkDaysLeft(productdetails.endingAt, productdetails.auctionDocId)) {
                            alert("Auction is closed as bid duration has just exceeded. Please proceed to homepage and refresh.")
                        }
                        else if (!(productdetails.ongoing)) {
                            alert("Someone has just bought out your item! You can now exchange contact with the buyer!")
                        }
                        else if (!latestbidder) {
                            alert("There are currently no bids to be accepted.");
                        }
                        else {
                            toggleModal();
                        }
                        }}>
                        <Text style ={styles.ACCBIDcustomBtnText}>Accept Bid</Text>
                    </TouchableOpacity>
                        </View>

                        <View style={styles.container}>
                        <Modal 
                            isVisible={isModalVisible}
                            animationIn="zoomInDown"
                            animationOut="zoomOutUp"
                            animationInTiming={1000}
                            animationOutTiming={1000}
                            backdropTransitionInTiming={600}
                            backdropTransitionOutTiming={600}>
                    
                        <View style={styles.popupmenu}>
                            <Text style = {styles.currentbid}>Are you sure you want to sell this item?</Text>
                            <Image source = {{uri : productdetails.product.pictureUri}} style = {styles.listImage} />
                            <Text style = {styles.title}>{productdetails.product.name}</Text>
                            <Text style = {styles.currenthighestbiddertext}>Current Highest Bidder: </Text>
                            <View style = {styles.highestbiddercontainer}>
                                <Ionicons style={styles.lockIcon} name={'eye-off-outline'} size={20} color={colors.red} />
                                <View>
                                    <View style = {{flexDirection: 'row'}}>
                                    <Text style = {styles.buyeranonymous}>Bid placed by: </Text>
                                    <TouchableOpacity onPress={() => {
                                        //alert("Bidder/Buyer Review Page")  
                                        toggleModal();
                                        navigation.navigate('ViewReviews', {reviewerId : latestbidder.bidderId, reviewerName : latestbidder.bidderAnomname});
                                        }}> 
                                        <Text style = {styles.buyeranonymousname}>
                                        {
                                           latestbidder && ' ' + latestbidder.bidderAnomname
                                        }
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                    <Text style = {styles.buyeranonymousdate}>{latestbidder && latestbidder.createdAt}</Text>
                                </View>
                                <View style = {styles.currentpriceContainer}>
                                    <Text style = {styles.dollarsign}>$</Text>
                                    <Text style = {styles.currentprice}>{productdetails.currPrice}</Text>
                                    <Ionicons style={styles.lockIcon} name={'caret-up-circle-outline'} size={27} color={colors.red} />
                                </View>
                            </View>
                            <Text style = {styles.termsandcondition}>
                            By tapping on Accept Bid, I agree that my details will be 
                            revealed to the Buyer for further transactions. Also, I will
                            accept any penalties if I back out after accepting the bid. 
                            </Text>
                            <View style = {styles.SELLcontainer}>
                            <TouchableOpacity style = {styles.ACCEPTcustomBtnBG} onPress={() => {
                                //alert("Accept Bid")
                                sendselloutvalues(docId, latestbidder.bidderId)
                                .then((success) =>  {navigation.navigate('SelloutSuccess', {aId, latestbidder})})
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
                        </View>
                    </Modal>
                    </View>
                    </View>
                }

                
                style = {styles.buyerbidcontainer}
                contentContainerStyle={{ paddingBottom: 70}}
                data={bidders}
                ItemSeparatorComponent={ItemDivider}
                keyExtractor={item =>  item.bidId.toString()}
                renderItem={({item}) => renderList(item)}  />
                
             
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
        marginTop: 20
    
    },

    
    list: {
        width: '100%',
        flexDirection: 'column',
        marginBottom: 20,
        
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
      
    },

    buyoutbid: {
        color: colors.white,
        fontWeight: 'bold',
    },

    currentbid: {
      color: colors.darkbrown,
      textAlign: "center",
      fontFamily: "Montserrat-Black",
      fontSize: 16,
      marginBottom: 10,
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

    EDITcustomBtnBG: {
        backgroundColor: colors.darkbrown,
        padding: 15,
        borderRadius: 5
    },

    EDITcustomBtnText: {
        fontSize: 24,
        fontFamily: 'Montserrat-Black',
        color: colors.white,
        textAlign: "center",
    },

    ACCBIDcustomBtnBG: {
        backgroundColor: colors.green,
        borderRadius: 5,
        padding: 15,
    },

    ACCBIDcustomBtnText: {
        fontSize: 24,
        fontFamily: 'Montserrat-Black',
        color: colors.white,
        textAlign: "center",
    },

    popupmenu: {
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 20,
    },

    termsandcondition : {
        fontSize: 12,
        color: colors.darkbrown,
        marginTop: 20,
    },

    SELLcontainer: {
        flexDirection: 'row',  
        margin: 20,
        
    },

    ACCEPTcustomBtnBG: {
        backgroundColor: colors.green,
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

      nobidsnotice :{
        color: colors.red,
        fontFamily: 'Montserrat-Black',
        textAlign: 'center',
        },
})

export default Sellerbidding;