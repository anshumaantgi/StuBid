import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, FlatList,ActivityIndicator, RefreshControl} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import colors from '../config/colors.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, query, orderBy, getDoc, getDocs, getFirestore, doc, where} from "firebase/firestore"; 
import { auth,db } from '../config/config.js';
import { async } from '@firebase/util';
import {FilterContext} from './MainContainer.js';
import Modal from "react-native-modal";
import Bid from '../models/Bid.js';
import BidCreateView from '../views/BidCreateView.js';

const bidderitem = [

    {
        id : 1,
        auctionId: 1,
        buyerId: 'asd',
        anomName: 'big dog',
        biddingPrice: 100,
        createdAt: "29/06/2022, 03:18:58",
    },

    {
        id : 2,
        auctionId: 1,
        buyerId: 'asd',
        anomName: 'small cat',
        biddingPrice: 120,
        createdAt: "30/06/2022, 03:18:58",
    },

    {
        id : 3,
        auctionId: 1,
        buyerId: 'GjASd1svuhSZG4xdpifvWCD4y652',
        anomName: 'fat c0w',
        biddingPrice: 130,
        createdAt: "01/07/2022, 03:18:58",
    },

    {
        id : 4,
        auctionId: 1,
        buyerId: 'asd',
        anomName: 'hungry dragon',
        biddingPrice: 140,
        createdAt: "02/07/2022, 03:18:58",
    },

    {
        id : 5,
        auctionId: 1,
        buyerId: 'GjASd1svuhSZG4xdpifvWCD4y652',
        anomName: 'sleepy pig',
        biddingPrice: 150,
        createdAt: "03/07/2022, 03:18:58",
    },

    {
        id : 6,
        auctionId: 1,
        buyerId: 'GjASd1svuhSZG4xdpifvWCD4y652',
        anomName: 'quick mouse',
        biddingPrice: 160,
        createdAt: "05/07/2022, 03:18:58",
    },
    {
        id : 7,
        auctionId: 1,
        buyerId: 'asd',
        anomName: 'angry duck',
        biddingPrice: 180,
        createdAt: "07/07/2022, 03:18:58",
    },

    {
        id : 8,
        auctionId: 1,
        buyerId: 'asd',
        anomName: 'sad tiger',
        biddingPrice: 190,
        createdAt: "10/07/2022, 03:18:58",
    },

    {
        id : 9,
        auctionId: 1,
        buyerId: 'asd',
        anomName: 'happy elephant',
        biddingPrice: 220,
        createdAt: "12/07/2022, 03:18:58",
    },

    {
        id : 10,
        auctionId: 1,
        buyerId: 'asd',
        anomName: 'enormous cobra',
        biddingPrice: 250,
        createdAt: "13/07/2022, 03:18:58",
    },
];

const Buyerbidding = ({route, navigation}) => {

    //Set up Modal (Pop-up screen) when bid/sell button is pressed, etc
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisible2, setModalVisible2] = useState(false);
    //Buyout option toggle
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    //Bid option toggle
    const toggleModal2 = () => {
        setModalVisible2(!isModalVisible2); 
    };

     //Ramdom name generator
     const { uniqueNamesGenerator, adjectives, animals } = require('unique-names-generator');
     const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, animals] }); // big_donkey

    //Auction ID from previous screen
    const aId = route.params.auctionId;
    
    //initialise state hook
    const [productdetails, setProductdetails] = useState('');
    const [auctionId, setAuctionId] = useState('');
    const [bidding, setBidding] = useState([]);
    const [userbidprice, setUserbidprice] = useState('');

    // Firestore setup
    const db = getFirestore();
    const biddingRef = collection(db, 'auctions'); 
    
    //Send buyout details to Firestore
    async function sendbuyoutvalues(enteredbuyerId, enteredauctionId ,enteredbuyeranonname) {
        console.log(enteredbuyerId);
        console.log(enteredauctionId);
        console.log(enteredbuyeranonname);
        
        
    }

    //Send user bid details to Firestore
    async function senduserbidvalues(enteredbuyerId, enteredauctionId, enteredbidPrice, enteredbidderanonname) {
        if (!enteredbidPrice) {
            throw new Error("Please enter your bidding price!");
        }
        else if (enteredbidPrice <= productdetails.product.minPrice) {
            throw new Error("Please bid higher than the minimum bidding price!");
        }
        else if (enteredbidPrice >= productdetails.product.buyPrice) {
            throw new Error("Please bid lower than the maximum bidding price!");
        }   
        else {
            console.log(enteredbuyerId);
            console.log(enteredauctionId);
            console.log(enteredbidPrice);
            console.log(enteredbidderanonname);
            return await new BidCreateView(auth).createBid(new Bid(enteredbuyerId , enteredauctionId,enteredbidPrice, enteredbidderanonname, new Date().toLocaleString()))
        }
    }
    
    // Retrieve product details from firestore via AuctionId
    const getproductlisting = async() => {
        var itemdetails = null;
        var auctId = null;
        const q = query(biddingRef, where("auctionId", "==", aId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          itemdetails = doc.data();
          auctId = doc.id;
        });
        setProductdetails(itemdetails);
        setAuctionId(auctId)

    }

    useEffect(() => {
        getproductlisting();
        //getBidding();
       
    }, []);

    

    const getBidding = async () => {
    // Query the first page of docs
    const first = query(biddingRef, orderBy("createdAt", "desc"));
    const documentSnapshots = await getDocs(first);

        if (!documentSnapshots.empty) {
            let newBidding = [];

            for (let i = 0; i < documentSnapshots.docs.length; i++) {
                newBidding.push(documentSnapshots.docs[i].data());
               // console.log(newBidding);
            }

            setBidding(newBidding);
        } else {
            setBidding([]);
            alert('There are currently no bids for this product.');
        }
    }

    //render list from all buyer biddings (fields from figma prototype in "Current Bids")
    const renderList = ({anomName, biddingPrice, createdAt, buyerId}) => {
          
        return (
        <View style = {{flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between'}}>
             <Ionicons style={styles.lockIcon} name={'eye-off-outline'} size={20} color={colors.red} />
             <View>
                <View style = {{flexDirection: 'row'}}>
                <Text style = {styles.buyeranonymous}>Bid placed by: </Text>
                <TouchableOpacity onPress={() => {
                    alert("Bidder/Buyer Review Page")  
                    }}> 
                    <Text style = {styles.buyeranonymousname}>
                    {
                        (auth.currentUser.uid == buyerId)
                        ? ' Me'
                        :  ' ' + anomName
                    }
                    </Text>
                </TouchableOpacity>
             </View>
                <Text style = {styles.buyeranonymousdate}>{createdAt}</Text>
            </View>
             <View style = {styles.currentpriceContainer}>
                <Text style = {styles.dollarsign}>$</Text>
                <Text style = {styles.currentprice}>{biddingPrice}</Text>
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

    return (<View>
            <FlatList
                ListHeaderComponent =
                {productdetails &&
                    <View style={styles.container}>
                    <View style = {styles.list}>
                        <Image source = {{uri : productdetails.product.pictureUri}} style = {styles.listImage} />
                        <View style = {{flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between'}}>
                        <View>
                            <View style = {styles.selleranonymouscontainer}>
                                <Ionicons style={styles.lockIcon} name={'eye-off-outline'} size={20} color={colors.red} />
                                <TouchableOpacity onPress={() => {
                                    alert("Seller Review Page")
                       
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
                                Bid Ending in:
                            </Text>
                            <Text style = {styles.activedaytext}>
                                {productdetails.product.activeDays} Days
                            </Text>
                        </View>
                        </View>
                    </View>
                <View style = {styles.listingContainer}>
                    <View style = {styles.container}>
                        <Text style= {styles.name}>{productdetails.product.name}</Text>
                    </View>
                </View>
                <View style = {styles.descriptionContainer}>
                    <Text style = {styles.description}>Description:</Text>
                    <Text style = {styles.descriptiontext}>{productdetails.product.description}</Text>
                </View>
                
            </View>
           <View>
                <Text style = {styles.currentbid}>Current Bids: </Text>
           </View>
           </View>
                }

                ListFooterComponent =
                {
                    productdetails && 
                    <View>
                    <View style = {styles.buttoncontainer}>
                    <TouchableOpacity style = {styles.BUYOUTcustomBtnBG} onPress={() => {
                       //alert("Buy item")
                       toggleModal();
                       
                       }}> 
                       <Text style ={styles.BUYOUTcustomBtnText}>Buy Item</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style = {styles.BIDcustomBtnBG} onPress={() => {
                       //alert("Bid item")
                       toggleModal2();
                       }}>
                       <Text style ={styles.BIDcustomBtnText}>Place a Bid</Text>
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
                        <Text style = {styles.currentbid}>Are you sure you want to buy this item?</Text>
                        <Image source = {{uri : productdetails.product.pictureUri}} style = {styles.listImage} />
                        <Text style = {styles.title}>{productdetails.product.name}</Text>
                        <Text style = {styles.currentprice}>${productdetails.product.buyPrice}</Text>
                        <Text style = {styles.termsandcondition}>
                            By tapping on 'Confirm', I agree that my details will be 
                            revealed to the Seller for further transactions. Also, I will
                            accept any penalties if I back out after submitting the bid.    
                        </Text>
                        <View style = {styles.buyoutcontainer}>
                        <TouchableOpacity style = {styles.CONFIRMcustomBtnBG} onPress={() => {
                            //alert("Confirm Buy item")
                            sendbuyoutvalues(auth.currentUser.uid, productdetails.product.ownerId, randomName)
                            .then((success) =>  {navigation.navigate('BuyoutSuccess', {aId, randomName})})
                            .catch((error) => {alert(error.message)})
                        }}> 
                        <Text style ={styles.CONFIRMcustomBtnText}>Confirm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.CANCELcustomBtnBG} onPress={() => {
                            toggleModal();
                        }}>
                        <Text style ={styles.CANCELcustomBtnText}>Cancal</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal 
                        isVisible={isModalVisible2}
                        animationIn="zoomInDown"
                        animationOut="zoomOutUp"
                        animationInTiming={1000}
                        animationOutTiming={1000}
                        backdropTransitionInTiming={600}
                        backdropTransitionOutTiming={600}>
                  
                    <View style={styles.popupmenu}>
                        <Text style = {styles.currentbid}>How much are you willing to bid?</Text>
                        <Image source = {{uri : productdetails.product.pictureUri}} style = {styles.listImage} />
                        <Text style = {styles.title}>{productdetails.product.name}</Text>
                        <View style = {styles.bidinput}>
                            <TextInput 
                                style = {styles.bidamount}
                                placeholder='Tap to submit your Bid ($)' 
                                keyboardType='numeric'
                                value = {userbidprice} 
                                onChangeText={(value) => setUserbidprice(value)}
                                placeholderTextColor={colors.white}>
                            </TextInput>
                        </View>
                        <View>
                            <View style = {{flexDirection: 'row'}}>
                                <Text style = {styles.minbidtext}>Minimum Bid: </Text>
                                <Text style = {styles.minbid}>
                                    ${productdetails.currPrice}
                                </Text>
                            </View>
                            <View style = {{flexDirection: 'row'}}>
                                <Text style = {styles.maxbidtext}>Maximum Bid: </Text>
                                <Text style = {styles.maxbid}>
                                    ${productdetails.product.buyPrice}
                                </Text>
                            </View>
                        </View>
                        <Text style = {styles.termsandcondition}>
                        By tapping on Bid Item, I agree that my bidding amount will be 
                        notified to the Seller. In the event that I won the bid, my details 
                        will be revealed to the Seller for further transaction, Also, I will
                        accept any penalties if I back out after agreeing the deal.   
                        </Text>
                        <View style = {styles.buyoutcontainer}>
                        <TouchableOpacity style = {styles.CONFIRMcustomBtnBG} onPress={() => {
                            //alert("Bid is placed!")
                            senduserbidvalues(auth.currentUser.uid, auctionId, userbidprice, randomName)
                            .then((success) =>  {navigation.navigate('BidSuccess', {aId, randomName});})
                            .catch((error) => {alert(error.message)})
                    
                        }}> 
                        <Text style ={styles.CONFIRMcustomBtnText}>Place a Bid</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.CANCELcustomBtnBG} onPress={() => {
                            toggleModal2();
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
                data={bidderitem}
                ItemSeparatorComponent={ItemDivider}
                keyExtractor={item =>  item.id.toString()}
                renderItem={({item}) => renderList(item)} />    
        </View>
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

    bidinput: {
        backgroundColor: colors.textinput,
        width: '80%',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginVertical: 10,
        color: colors.white,
    },

    bidamount : {
        textAlign: 'center',
        fontWeight: 'bold',
        color: colors.white,
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

    BUYOUTcustomBtnBG: {
        backgroundColor: colors.red,
        padding: 15,
        borderRadius: 5
    },

    BUYOUTcustomBtnText: {
        fontSize: 24,
        fontFamily: 'Montserrat-Black',
        color: colors.white,
        textAlign: "center",
    },

    BIDcustomBtnBG: {
        backgroundColor: colors.black,
        borderRadius: 5,
        padding: 15,
    },

    BIDcustomBtnText: {
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

    buyoutcontainer: {
        flexDirection: 'row',  
        margin: 20,
        
    },

    CONFIRMcustomBtnBG: {
        backgroundColor: colors.red,
        padding: 15,
        borderRadius: 5,
        marginHorizontal: 20,

    },

    CONFIRMcustomBtnText: {
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

    minbidtext : {
        fontFamily: 'Montserrat-Black',
        color: colors.gold,
    },

    minbid : {
        color: colors.orange,
        fontWeight: 'bold',
    },

    maxbidtext : {
        fontFamily: 'Montserrat-Black',
        color: colors.gold,
    },

    maxbid : { 
        color: colors.orange,
        fontWeight: 'bold',
    },


})

export default Buyerbidding;