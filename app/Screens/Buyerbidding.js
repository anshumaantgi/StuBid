import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, FlatList,ActivityIndicator, RefreshControl} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import colors from '../config/colors.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, query, orderBy, startAfter, limit, getDocs, getFirestore, startAt, endAt, where, } from "firebase/firestore"; 
import { auth,db } from '../config/config.js';
import { async } from '@firebase/util';
import {FilterContext} from './MainContainer.js';
import Modal from "react-native-modal";

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
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    //Product details retrieval previous screen
    const productdetails =  route.params;
    console.log(productdetails.product.name);

    //Retrieve category full name
    var category = '';
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

    //initialise state hook
    const [bidding, setBidding] = useState([]);

    // Firestore setup
    const db = getFirestore();
    const biddingRef = collection(db, 'auctions');

    useEffect(() => {
        getBidding();
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
                {
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
                                <Text style = {styles.catname}> {category}</Text>
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
                    <View style = {styles.buttoncontainer}>
                    <TouchableOpacity style = {styles.BUYOUTcustomBtnBG} onPress={() => {
                       //alert("Buy item")
                       toggleModal();
                       
                       }}> 
                       <Text style ={styles.BUYOUTcustomBtnText}>Buy Item</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style = {styles.BIDcustomBtnBG} onPress={() => {
                       alert("Bid item")
                       
                       }}>
                       <Text style ={styles.BIDcustomBtnText}>Place a Bid</Text>
                   </TouchableOpacity>
                    </View>
                    
                }

                style = {styles.buyerbidcontainer}
                contentContainerStyle={{ paddingBottom: 70}}
                data={bidderitem}
                ItemSeparatorComponent={ItemDivider}
                keyExtractor={item =>  item.id.toString()}
                renderItem={({item}) => renderList(item)} />    


<View style={{ flex: 1 }}>

      <Modal isVisible={isModalVisible}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style = {styles.currentprice}>Hello Word!</Text>
          <TouchableOpacity style = {styles.BIDcustomBtnBG} onPress={() => {
                      toggleModal();
                       }}>
                       <Text style ={styles.BIDcustomBtnText}>Close Box</Text>
                   </TouchableOpacity>
        </View>
      </Modal>
    </View>
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

    list: {
        width: '100%',
        flexDirection: 'column',
        marginBottom: 20,
  
    },

    listImage: {
        width: '100%',
        height: 300,
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
        alignItems: 'top',
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
})

export default Buyerbidding;