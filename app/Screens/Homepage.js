import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, FlatList, ActivityIndicator, RefreshControl} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import colors from '../config/colors.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, query, orderBy, startAfter, limit, getDocs, getFirestore, startAt, endAt, where, doc, updateDoc} from "firebase/firestore"; 
import { auth,db } from '../config/config.js';
import { async } from '@firebase/util';
import {FilterContext} from './MainContainer.js';
import moment from "moment-timezone";
import NotificationView from '../views/NotificationView.js';


const Homepage = ({route, navigation}) => {
    let onEndReachedCalledDuringMomentum = false;

    //Define filter storage
    const filterchecker = React.useContext(FilterContext);
    var uniSelected = '';
    var catSelected = '';
    var priceSelected = [];
    const startpricefilter = 0;
    const endpricefilter = 50000;

    //check if filter has been selected
    if (filterchecker) {
        uniSelected = filterchecker.unifilter;
        catSelected = filterchecker.catfilter;
        priceSelected = filterchecker.pricefilterarray;
    }

    // initialise state 
    var defaultfirst = null; // show default
    var defaultlast = null; // show default
    var filterunifirst = null; // uni
    var filterunilast = null; // uni
    var filtercatfirst = null; // category
    var filtercatlast = null; // category
    var filterpricefirst = null; // price range
    var filterpricelast = null; // price range
    var filterunicatfirst = null; // uni and category
    var filterunicatlast = null; // uni and category
    var filterunipricefirst = null; // uni and price range 
    var filterunipricelast = null; // uni and price range 
    var filtercatpricefirst = null; // category and price range 
    var filtercatpricelast = null; //  category and price range 
    var filterunicatpricefirst = null; //uni, category and price range
    var filterunicatpricelast = null; //uni, category and price range
    var searchnamefirst = null; // search field
    var searchnamelast = null; // search field

    //initialise state hook
    const [isLoading, setIsLoading] = useState(false);
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [lastDoc, setLastDoc] = useState(null); //contain last document of snapshot, will be used to get more product data
    const [products, setProducts] = useState([]);

    //Search Bar
    const [search, setSearch] = useState('');

    // Firestore setup
    const db = getFirestore();
    const productsRef = collection(db, 'auctions');

    //Retrieval by search field
    searchnamefirst = query(productsRef, orderBy("product.name"), where('product.name', '>=', search), where('product.name', '<=', search + '\uf8ff'), where("ongoing", "==", true), limit(3));
    searchnamelast = query(productsRef, orderBy("product.name"), where('product.name', '>=', search), where('product.name', '<=', search + '\uf8ff'), where("ongoing", "==", true), startAfter(lastDoc), limit(3));
    
    //Retrieval by Default 
    defaultfirst = query(productsRef, orderBy("createdAt", "desc"), where("ongoing", "==", true), limit(3));
    defaultlast = query(productsRef, orderBy("createdAt", "desc"), where("ongoing", "==", true), startAfter(lastDoc), limit(3));
    
    //Retrieval by Filter uni
    if (filterchecker && uniSelected.length) {
        filterunifirst = query(productsRef,  orderBy("createdAt", "desc"), where('product.originUni', '==', uniSelected), where("ongoing", "==", true), limit(3));
        filterunilast = query(productsRef,  orderBy("createdAt", "desc"), where('product.originUni', '==', uniSelected), where("ongoing", "==", true), startAfter(lastDoc), limit(3));
    }

    //Retrieval by Filter category
    if (filterchecker && catSelected.length) {
        filtercatfirst = query(productsRef,  orderBy("createdAt", "desc"), where('product.category', '==', catSelected), where("ongoing", "==", true), limit(3));
        filtercatlast= query(productsRef,  orderBy("createdAt", "desc"), where('product.category', '==', catSelected), where("ongoing", "==", true), startAfter(lastDoc), limit(3));
    }

    //Retrieval by Filter price range
    if (filterchecker && !(priceSelected[0] == startpricefilter && priceSelected[1] == endpricefilter)) {
        filterpricefirst = query(productsRef, orderBy("currPrice"), where("ongoing", "==", true), startAt(priceSelected[0]), endAt(priceSelected[1]), limit(3));
        filterpricelast = query(productsRef, orderBy("currPrice"), where("ongoing", "==", true), startAt(priceSelected[0]), endAt(priceSelected[1]),  startAfter(lastDoc), limit(3));
    }

    //Retrieval by Filter uni and category
    if (filterchecker && uniSelected.length && catSelected.length) {
        filterunicatfirst = query(productsRef,  orderBy("createdAt", "desc"), where('product.originUni', '==', uniSelected), where('product.category', '==', catSelected), where("ongoing", "==", true), limit(3));
        filterunicatlast = query(productsRef,  orderBy("createdAt", "desc"), where('product.originUni', '==', uniSelected), where('product.category', '==', catSelected), where("ongoing", "==", true), startAfter(lastDoc), limit(3));
    }

     //Retrieval by Filter uni and price range
     if (filterchecker && uniSelected.length && !(priceSelected[0] == startpricefilter && priceSelected[1] == endpricefilter)) {
        filterunipricefirst = query(productsRef,  orderBy("currPrice"), where('product.originUni', '==', uniSelected), where("ongoing", "==", true), startAt(priceSelected[0]), endAt(priceSelected[1]), limit(3));
        filterunipricelast = query(productsRef,  orderBy("currPrice"), where('product.originUni', '==', uniSelected), where("ongoing", "==", true), startAt(priceSelected[0]), endAt(priceSelected[1]), startAfter(lastDoc), limit(3));
    }

    //Retrieval by Filter category and price range
    if (filterchecker && catSelected.length && !(priceSelected[0] == startpricefilter && priceSelected[1] == endpricefilter)) {
        filtercatpricefirst = query(productsRef,  orderBy("currPrice"), where('product.category', '==', catSelected), where("ongoing", "==", true), startAt(priceSelected[0]), endAt(priceSelected[1]), limit(3));
        filtercatpricelast = query(productsRef,  orderBy("currPrice"), where('product.category', '==', catSelected), where("ongoing", "==", true), startAt(priceSelected[0]), endAt(priceSelected[1]), startAfter(lastDoc), limit(3));
    }

    //Retrieval by Filter uni and category and price range
    if (filterchecker && uniSelected.length && catSelected.length && !(priceSelected[0] == startpricefilter && priceSelected[1] == endpricefilter)) {
        filterunicatpricefirst = query(productsRef,  orderBy("currPrice"), where('product.originUni', '==', uniSelected), where('product.category', '==', catSelected), where("ongoing", "==", true), startAt(priceSelected[0]), endAt(priceSelected[1]), limit(3));
        filterunicatpricelast = query(productsRef,  orderBy("currPrice"), where('product.originUni', '==', uniSelected), where('product.category', '==', catSelected), where("ongoing", "==", true), startAt(priceSelected[0]), endAt(priceSelected[1]),  startAfter(lastDoc), limit(3));
    }



    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getProducts();
        });
       unsubscribe;

       return () => {
        setProducts([])// Reset changes
        setIsLoading(false);
        setIsMoreLoading(false);
        setLastDoc(null);
        setSearch('');
      };
    }, [navigation]);

    const getProducts = async () => {
        setIsLoading(true);
    // Query the first page of docs
    //console.log((priceSelected[0] == 0 && priceSelected[1] == 500000));
    if (!search == '') {
        var first = searchnamefirst;
    }
    else if (filterchecker && (uniSelected.length && !catSelected.length && (priceSelected[0] == startpricefilter && priceSelected[1] == endpricefilter))) {
        var first = filterunifirst;
    }
    else if (filterchecker && (!uniSelected.length && catSelected.length && (priceSelected[0] == startpricefilter && priceSelected[1] == endpricefilter))) {
        var first = filtercatfirst;
    }
    else if (filterchecker && (!uniSelected.length && !catSelected.length && !(priceSelected[0] == startpricefilter && priceSelected[1] == endpricefilter))) {
        var first = filterpricefirst;
    }
    else if (filterchecker && (uniSelected.length && catSelected.length && (priceSelected[0] == startpricefilter && priceSelected[1] == endpricefilter))) {
        var first = filterunicatfirst;
    }
    else if (filterchecker && (uniSelected.length && !catSelected.length && !(priceSelected[0] == startpricefilter && priceSelected[1] == endpricefilter))) {
        var first = filterunipricefirst;
    }
    else if (filterchecker && (!uniSelected.length && catSelected.length && !(priceSelected[0] == startpricefilter && priceSelected[1] == endpricefilter))) {
        var first = filtercatpricefirst;
    }
    else if (filterchecker && (uniSelected.length && catSelected.length && !(priceSelected[0] == startpricefilter && priceSelected[1] == endpricefilter))) {
        var first = filterunicatpricefirst;
    }
    else {
        var first = defaultfirst;
    }
    
    const documentSnapshots = await getDocs(first);

    // Get the last visible document
    const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
    //console.log("last", lastVisible);

        if (!documentSnapshots.empty) {
            let newProducts = [];

            setLastDoc(lastVisible);

            for (let i = 0; i < documentSnapshots.docs.length; i++) {

                //Do not push and display if bids duration exceeded
                if (documentSnapshots.docs[i].data().endingAt == moment().tz('Singapore').format('DD/MM/YYYY') && documentSnapshots.docs[i].data().ongoing) {
                    updateDoc(doc(db ,'auctions', documentSnapshots.docs[i].data().auctionId), { 
                        ongoing: false,
                        updatedAt: moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss')
                    })

                //Send notifications if Bid Ends
                if (documentSnapshots.docs[i].data().leadBuyerId) {
                    console.log(documentSnapshots.docs[i].data().leadBuyerId, "AAAAAAAAAAA")
                    //Send Seller Bid End Success message
                    new NotificationView().createNotification(documentSnapshots.docs[i].data().product.ownerId, "The Bid Duration is over! Congratulations, the highest bidder has won your auction! Click here to view Buyer's Contact Information", documentSnapshots.docs[i].data().auctionId);
                    console.log(documentSnapshots.docs[i].data().auctionId, "BBBBBBBBBBBBBBBBBBBBBBBBB")
                    //Send Buyer Bid End Success message
                    new NotificationView().createNotification(documentSnapshots.docs[i].data().leadBuyerId, "The Bid Duration is over! Congratulations, you have won the auction as the highest bidder! Click here to view Seller's Contact Information", documentSnapshots.docs[i].data().auctionId);
                    console.log(666666666666)
                    //Send to all other unsuccessful buyers (if there are other bidders)
                    if (documentSnapshots.docs[i].data().allBiddersId.length) {
                        console.log(77777777777777, documentSnapshots.docs[i].data().allBiddersId.length)
                        for (let j = 0; j < documentSnapshots.docs[i].data().allBiddersId.length; j++) {
                            if (documentSnapshots.docs[i].data().allBiddersId[j] != documentSnapshots.docs[i].data().leadBuyerId) {
                                await new NotificationView().createNotification(documentSnapshots.docs[i].data().allBiddersId[j], "The Bid Duration is over! We're sorry to inform you that this product listing is closed and you've been outbidded.", documentSnapshots.docs[i].data().auctionId);
                            }
                        }
                        console.log(999999999)
                    }
                }
                else {
                    console.log(33333333333333)
                    //Send Seller unsuccessful auction (No Bidders but bid has ended)
                    new NotificationView().createNotification(documentSnapshots.docs[i].data().product.ownerId, "The Bid Duration is over! Unfortunately, there are no bidders for this product yet. Click here to view or delete your product.", documentSnapshots.docs[i].data().auctionId);
                    }
                console.log(444444444444)
                }
                else {
                    //push products if there is still bid duration
                    newProducts.push(documentSnapshots.docs[i].data());
                }

            }
            setProducts(newProducts);
        } else {
            setLastDoc(null);
            setProducts([]);
            //alert('No Products are Found. Please Refresh/Clear Filter and try again.');
        }

        setIsLoading(false);
    }

    const getMore = async () => {
        

        if (lastDoc) {
            setIsMoreLoading(true);
        
        setTimeout(async () => {
        // Construct a new query starting at this document,
        // get the next 25 cities.
        
    if (!search == '') {
        var next = searchnamelast;
    }
    else if (filterchecker && (uniSelected.length && !catSelected.length && (priceSelected[0] == startpricefilter && priceSelected[1] == endpricefilter))) {
        var next = filterunilast;
    }
    else if (filterchecker && (!uniSelected.length && catSelected.length && (priceSelected[0] == startpricefilter && priceSelected[1] == endpricefilter))) {
        var next = filtercatlast;
    }
    else if (filterchecker && (!uniSelected.length && !catSelected.length && !(priceSelected[0] == startpricefilter && priceSelected[1] == endpricefilter))) {
        var next = filterpricelast;
    }
    else if (filterchecker && (uniSelected.length && catSelected.length && (priceSelected[0] == startpricefilter && priceSelected[1] == endpricefilter))) {
        var next = filterunicatlast;
    }
    else if (filterchecker && (uniSelected.length && !catSelected.length && !(priceSelected[0] == startpricefilter && priceSelected[1] == endpricefilter))) {
        var next = filterunipricelast;
    }
    else if (filterchecker && (!uniSelected.length && catSelected.length && !(priceSelected[0] == startpricefilter && priceSelected[1] == endpricefilter))) {
        var next = filtercatpricelast;
    }
    else if (filterchecker && (uniSelected.length && catSelected.length && !(priceSelected[0] == startpricefilter && priceSelected[1] == endpricefilter))) {
        var next = filterunicatpricelast;
    }
    else {
        var next = defaultlast;
    }  
        
    const documentSnapshots = await getDocs(next);

        if (!documentSnapshots.empty) {
            let newProducts = products;
             // Get the last visible document
            const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
            setLastDoc(lastVisible);

            for (let i = 0; i < documentSnapshots.docs.length; i++) {

                //Do not push and display if bids duration exceeded
                if (documentSnapshots.docs[i].data().endingAt == moment().tz('Singapore').format('DD/MM/YYYY') && documentSnapshots.docs[i].data().ongoing) {
                    updateDoc(doc(db ,'auctions', documentSnapshots.docs[i].data().auctionId), { 
                        ongoing: false,
                        updatedAt: moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss')
                    })

                //Send notifications if Bid Ends
                if (documentSnapshots.docs[i].data().leadBuyerId) {

                    //Send Seller Bid End Success message
                    new NotificationView().createNotification(documentSnapshots.docs[i].data().product.ownerId, "The Bid Duration is over! Congratulations, the highest bidder has won your auction! Click here to view Buyer's Contact Information", documentSnapshots.docs[i].data().auctionId);
                    
                    //Send Buyer Bid End Success message
                    new NotificationView().createNotification(documentSnapshots.docs[i].data().leadBuyerId, "The Bid Duration is over! Congratulations, you have won the auction as the highest bidder! Click here to view Seller's Contact Information", documentSnapshots.docs[i].data().auctionId);
                    console.log("NIKEEEEEEEE")
                    //Send to all other unsuccessful buyers (if there are other bidders)
                    if (documentSnapshots.docs[i].data().allBiddersId) {
                        console.log(134567891)
                        for (let j = 0; j < documentSnapshots.docs[i].data().allBiddersId.length; j++) {
                            if (documentSnapshots.docs[i].data().allBiddersId[j] != documentSnapshots.docs[i].data().leadBuyerId) {
                                await new NotificationView().createNotification(documentSnapshots.docs[i].data().allBiddersId[j], "The Bid Duration is over! We're sorry to inform you that this product listing is closed and you've been outbidded.", documentSnapshots.docs[i].data().auctionId);
                            }
                        }
                        console.log(888888888888)
                    }
                }
                else {
                    console.log(33333333333333)
                    //Send Seller unsuccessful auction (No Bidders but bid has ended)
                    new NotificationView().createNotification(documentSnapshots.docs[i].data().product.ownerId, "The Bid Duration is over! Unfortunately, there are no bidders for this product yet. Click here to view or delete your product.", documentSnapshots.docs[i].data().auctionId);
                    }
                console.log(444444444444)
                }
                else {
                    //push products if there is still bid duration
                    newProducts.push(documentSnapshots.docs[i].data());
                }

            }

            setProducts(newProducts);
            if (documentSnapshots.docs.length < 3) {
                setLastDoc(null);
            }
        } else {
            setLastDoc(null);
        }
        setIsMoreLoading(false);
    }, 1000);

}
    onEndReachedCalledDuringMomentum = true;

    }

    const renderList = ({auctionId, leadBuyerId, anomName, currPrice, product, createdAt, ongoing, allBiddersId, endingAt}) => {
        //check for any bidders in auction. If none, set it to empty array.
        if (!allBiddersId) {
            allBiddersId = [];
        }
        //rename category to full
        var category = '';
        switch (product.category) {
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
        return (
            <View style = {styles.list}>
                <Image source = {{uri : product.pictureUri}} style = {styles.listImage} />
                <View style = {styles.listingContainer}>
                        <Text style= {styles.name}>{product.name}</Text>
                </View>
               
                    <View style = {styles.descriptionContainer}>
                        <Text style = {styles.description}>Description:</Text>
                        <Text style = {styles.descriptiontext}>{product.description}</Text>
                    </View>
                    
           
                <View style = {{flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between', marginBottom: 5,}}>
                    <View>
                        <View style = {styles.currentpriceContainer}>
                            <Text style = {styles.dollarsign}>$</Text>
                            <Text style = {styles.currentprice}>{currPrice}</Text>
                            <Ionicons style={styles.lockIcon} name={'caret-up-circle-outline'} size={27} color={colors.red} />
                        </View>
                        <View style = {styles.selleranonymouscontainer}>
                        <Ionicons style={styles.lockIcon} name={'eye-off-outline'} size={20} color={colors.red} />
                        <TouchableOpacity onPress={() => {
                            //alert("Seller Review Page")
                            navigation.navigate('ViewReviews', {reviewerId : product.ownerId, reviewerName : anomName});
                       
                            }}> 
                            <Text style = {styles.selleranonymous}> {anomName} </Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {styles.uninamecontainer}>
                            <Ionicons style={styles.lockIcon} name={'school-outline'} size={16} color={colors.black} />
                            <Text style = {styles.uniname}> {product.originUni}</Text>
                        </View>
                        <View style = {styles.catnamecontainer}>
                            <Ionicons style={styles.lockIcon} name={'list-circle-outline'} size={16} color={colors.black} />
                            <Text style = {styles.catname}> {category}</Text>
                        </View>
                        <View style = {styles.date_publishedcontainer}>
                            <Ionicons style={styles.lockIcon} name={'calendar-outline'} size={16} color={colors.black} />
                            <Text style = {styles.date_published}> {createdAt}</Text>
                        </View>
                    </View>
                    <View>
                    <View style = {styles.activedaycontainer}>
                                <Text style = {styles.activeday}>
                                    Bid Ending in:
                                </Text>
                                <Text style = {styles.activedaytext}>
                                    {checkDaysLeft(endingAt)} Days
                                </Text>
                    </View>
                    <View style = {styles.bidcontainer}>
                        <TouchableOpacity 
                            style = 
                            {
                                // will add in 'Continue Bidding' once database is done
                                (auth.currentUser.uid == product.ownerId && ongoing)
                                ? styles.ABcustomBtnBG
                                : (auth.currentUser.uid != product.ownerId && allBiddersId.includes(auth.currentUser.uid) && ongoing)
                                ? styles.CBcustomBtnBG
                                : (auth.currentUser.uid != product.ownerId && !(allBiddersId.includes(auth.currentUser.uid)) && ongoing)
                                ? styles.PABcustomBtnBG
                                : styles.VCcustomBtnBG
                            } 
                            onPress={() => 
                            {
                                 // will add in 'Continue Bidding' once database is done
                                 (auth.currentUser.uid == product.ownerId && ongoing)
                                 ? navigation.navigate("SellerBid", {auctionId})
                                 : (auth.currentUser.uid != product.ownerId && allBiddersId.includes(auth.currentUser.uid) && ongoing)
                                 ? navigation.navigate("BuyerBid", {auctionId})
                                 : (auth.currentUser.uid != product.ownerId && !(allBiddersId.includes(auth.currentUser.uid)) && ongoing)
                                 ? navigation.navigate("BuyerBid", {auctionId})
                                 : navigation.navigate("ExchangeContact", {auctionId})
                            }}>
                            <Text style ={styles.customBtnText}>
                                {
                                    // will add in 'Continue Bidding' once database is done
                                    (auth.currentUser.uid == product.ownerId && ongoing)
                                    ? 'Accept Bid'
                                    : (auth.currentUser.uid != product.ownerId && allBiddersId.includes(auth.currentUser.uid) && ongoing)
                                    ? 'Continue Bid'
                                    : (auth.currentUser.uid != product.ownerId && !(allBiddersId.includes(auth.currentUser.uid)) && ongoing)
                                    ? 'Place a Bid'
                                    : 'View Listing'

                                }
                                </Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </View>
            </View>
        )
    }

    const renderFooter = () => {
        if (!isMoreLoading) return true;
        return (
            <ActivityIndicator size = "large" color = "#4D330C" style={{ marginBottom: 10 }}/>
        )
    }

    const onRefresh = () => {
        setTimeout(() => {
            getProducts();
          }, 1000);
    }

    const alertemptylist = () => {
        return (
            <View>
                <Text style = {styles.alertnotice}>There are currently no products found. Please Refresh or Clear Filter and try again.</Text>
            </View>
        )
    }

    const checkDaysLeft = (endingDate) => {

        var given = moment(endingDate, 'DD/MM/YYYY') ;
        var current = moment(moment().tz('Singapore').format('DD/MM/YYYY'), 'DD/MM/YYYY')
        
        //Difference in number of days
        var diffDays = moment.duration(given.diff(current)).asDays();
        console.log(diffDays);

        return diffDays;
    }

    return (
        <View style={styles.container}>
            <View style = {styles.header}>
              <Image style = {styles.logo} source = {require('../assets/StuBid-Logo-Original-ver.png')} resizeMode = "contain" /> 
            </View>
            <View style = {styles.searchandfilter}>
            <TextInput style = {styles.searchinput}
                 placeholder='Search for Products' 
                 placeholderTextColor={colors.white}
                 value = {search}  
                 onChangeText={(value) => setSearch(value)}
                 />
            <TouchableOpacity style = {styles.customsearchBtnBG}
             onPress={() =>
              {
                if (search == '') {
                    alert("Search Field is empty!");
                } else {
                    onRefresh();
                }
                }}>
                <Text style ={styles.customsearchBtnText}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.customfilterBtnBG}
             onPress={() =>
              {
                navigation.navigate("Filter");
              }
                }>
            <Ionicons style={styles.filterIcon} name={'filter-outline'} size={24} color={colors.white} />
            </TouchableOpacity>
            </View>
            <View style={styles.container}>
            <Text style = {styles.title}>   Recent Aunction</Text>
            <FlatList 
                contentContainerStyle={{ paddingBottom: 70 }}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={alertemptylist}
                refreshControl = {
                    <RefreshControl
                    refreshing={isLoading}
                    onRefresh={onRefresh} />
                }
                initialNumToRender = {3}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin = {() => {onEndReachedCalledDuringMomentum = false}}
                onEndReached = {() => {
                    if (!onEndReachedCalledDuringMomentum && !isMoreLoading) {
                        getMore();
                    }
                }}
                data={products}
                keyExtractor={item =>  item.auctionId.toString()}
                renderItem={({item}) => renderList(item)} />
            </View>
        </View>
        
    );
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

    logo: {
        width: 250,
        height: 250,
        marginTop: -30,
    },

    searchandfilter : {
        flexDirection: 'row',
        marginTop: -70,
        alignSelf: 'center',
    },

    searchinput: {
        backgroundColor: colors.darkbrown,
        width: '60%',
        fontSize: 16,
        color: colors.white,
        padding: 10,
        borderRadius: 5,
    },

    customsearchBtnText: {
    
        color: colors.white,
        textAlign: "center",
        fontSize: 16,
        fontWeight: 'bold',
    },

    customsearchBtnBG: {
        width: '20%',
        padding: 10,
        borderRadius: 5,
        backgroundColor: colors.activeday,
    },


    customfilterBtnBG: {
        width: '10%',
        padding: 10,
        backgroundColor: colors.gold,
        borderRadius: 5,
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
        paddingHorizontal: 15,
        marginBottom: 20,
        borderWidth: 0.2,
        borderColor: colors.darkbrown,
        borderRadius: 15,
        
    },

    listImage: {
        width: 300,
        height: 300,
        alignSelf: 'center',
    },

    listingContainer: {
        color: colors.darkbrown,
        alignItems: 'stretch',
        height: 30,
        marginVertical: 10,
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

    PABcustomBtnBG: {
        backgroundColor: colors.black,
        padding: 15,
        borderRadius: 50,
    },

    ABcustomBtnBG: {
        backgroundColor: colors.green,
        padding: 15,
        borderRadius: 50,
    },

    VCcustomBtnBG: {
        backgroundColor: colors.gold,
        padding: 15,
        borderRadius: 50,
    },

    CBcustomBtnBG: {
        backgroundColor: colors.red,
        padding: 15,
        borderRadius: 50,
    },


    bidcontainer: {
        alignItems: 'center',
        justifyCOntent: 'space-between',
    },

    activedaycontainer: {
        backgroundColor: colors.activeday,
        padding: 5,
        height: 55,
        borderRadius: 5,
        alignSelf: 'center',
        marginVertical: 10,
    },

    activeday: {
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
        marginTop: 5,
    },

    activedaytext: {
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
    },

    alertnotice : {
        color: colors.red,
        fontFamily: 'Montserrat-Black',
        textAlign: 'center',
        marginTop: 150,
    }
})

export default Homepage;