import React, {useState, useEffect, Profiler} from 'react';
import {View, ScrollView, Text, TouchableOpacity, Image, StyleSheet, FlatList, ActivityIndicator, RefreshControl} from 'react-native';
import colors from '../config/colors.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, query, orderBy, startAfter, limit, getDocs, getFirestore, startAt, endAt, where, doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore"; 
import { auth , db} from '../config/config.js';
import { TextInput } from 'react-native-gesture-handler';
import moment from "moment-timezone";
import { StackActions } from '@react-navigation/native';
import { AsyncStorage } from 'react-native';
import NotificationView from '../views/NotificationView.js';

const MyProfilepage = ({navigation}) => {
    let onEndReachedCalledDuringMomentum = false;

    // initize pers info state hook
    const [userfullname, setUserfullname] = useState('');
    const [useremail, setUseremail] = useState('');
    const [useruni, setUseruni] = useState('');
    const [userhp, setUserhp] = useState('');
    const [userbio, setUserBio] = useState('');

    //initialise tabchange
    const [tabchange, setTabchange] = useState( tabchange || [true,false,false,false]);

     //initialise loading state hook
     const [isLoading, setIsLoading] = useState(false);
     const [isMoreLoading, setIsMoreLoading] = useState(false);
     const [lastDoc, setLastDoc] = useState(null); //contain last document of snapshot, will be used to get more product data
     const [products, setProducts] = useState([]);

    //Setup Firebase
    const db = getFirestore();
    const profileRef = collection(db, 'users');
    const productsRef = collection(db, 'auctions');

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
        const unsubscribe = navigation.addListener('focus', () => {
            AsyncStorage.getItem('tabchanges', (err, value) => {
                if (err) {
                    console.log(err)
                } else {
                    setTabchange(JSON.parse(value)) // boolean false
                }
            })
        
            getProducts();
        });
       unsubscribe;

    }, [navigation]);

    useEffect(() => {
        getprofileinfo();
        getProducts();
        AsyncStorage.setItem('tabchanges', JSON.stringify(tabchange))
    }, [tabchange]);

    

    async function mybidTabpressed() {
        setTabchange([true,false,false,false])
        console.log(111)
    }

    async function myauctionTabpressed() {
        setTabchange([false,true,false,false])
        console.log(222)
    }

    async function soldcollectionTabpressed()  {
        setTabchange([false,false,true,false])
        console.log(333)
    }

    async function boughtcollectionTabpressed()  {
        setTabchange([false,false,false,true])
        console.log(444)
    }

    //get first 3 products
    const getProducts = async () => {
        setIsLoading(true);

    // Query the first 3 page of docs

    //My Auctions
    if (!tabchange[0] && tabchange[1] && !tabchange[2] && !tabchange[3]) {
        var first = query(productsRef, orderBy("createdAt", "desc"), where("product.ownerId", "==", auth.currentUser.uid), where("ongoing", "==", true), limit(3));
    } 
    //Sold Collection
    else if (!tabchange[0] && !tabchange[1] && tabchange[2] && !tabchange[3]) {
        var first = query(productsRef, orderBy("createdAt", "desc"), where("ongoing", "==", false), where("product.ownerId", "==", auth.currentUser.uid), limit(3)); 
    }
    //Bought Collection
    else if (!tabchange[0] && !tabchange[1] && !tabchange[2] && tabchange[3]) {
        var first = query(productsRef, orderBy("createdAt", "desc"), where("ongoing", "==", false), where("leadBuyerId", "==", auth.currentUser.uid), limit(3)); 
    }
    //My Bids
    else {
        var first = query(productsRef, orderBy("createdAt", "desc"), where("allBiddersId", "array-contains", auth.currentUser.uid), where("ongoing", "==", true), limit(3));
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
                    updateDoc(doc(db ,'auctions', documentSnapshots.docs[i].data().auctionDocId), { 
                        ongoing: false,
                        updatedAt: moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss')
                    })

                //Send notifications if Bid Ends
                if (documentSnapshots.docs[i].data().leadBuyerId) {
                    console.log(2222222222222)
                    //Send Seller Bid End Success message
                    new NotificationView().createNotification(documentSnapshots.docs[i].data().product.ownerId, "The Bid Duration is over! Congratulations, the highest bidder has won your auction! Click here to view Buyer's Contact Information", documentSnapshots.docs[i].data().auctionDocId);
            
                    //Send Buyer Bid End Success message
                    new NotificationView().createNotification(documentSnapshots.docs[i].data().leadBuyerId, "The Bid Duration is over! Congratulations, you have won the auction as the highest bidder! Click here to view Seller's Contact Information", documentSnapshots.docs[i].data().auctionDocId);
            
                    //Send to all other unsuccessful buyers (if there are other bidders)
                    if (documentSnapshots.docs[i].data().allBiddersId) {
                        for (let i = 0; i < documentSnapshots.docs[i].data().allBiddersId.length; i++) {
                            if (documentSnapshots.docs[i].data().allBiddersId[i] != documentSnapshots.docs[i].data().leadBuyerId) {
                                new NotificationView().createNotification(documentSnapshots.docs[i].data().allBiddersId[i], "The Bid Duration is over! We're sorry to inform you that this product listing is closed and you've been outbidded.", documentSnapshots.docs[i].data().auctionDocId);
                            }
                        }
                    }
                }
                else {
                    console.log(33333333333333)
                    //Send Seller unsuccessful auction (No Bidders but bid has ended)
                    new NotificationView().createNotification(documentSnapshots.docs[i].data().product.ownerId, "The Bid Duration is over! Unfortunately, there are no bidders for this product yet. Click here to view or delete your product.", documentSnapshots.docs[i].data().auctionDocId);
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

    //get more products 
    const getMore = async () => {

        if (lastDoc) {
            setIsMoreLoading(true);
        
    setTimeout(async () => {
    // Construct a new query starting at this document,
        
    // Query the next 3 page of docs

    //My Auctions
    if (!tabchange[0] && tabchange[1] && !tabchange[2] && !tabchange[3]) {
        var next = query(productsRef, orderBy("createdAt", "desc"), where("product.ownerId", "==", auth.currentUser.uid), where("ongoing", "==", true), startAfter(lastDoc), limit(3));
    } 
    //Sold Collection
    else if (!tabchange[0] && !tabchange[1] && tabchange[2] && !tabchange[3]) {
        var next = query(productsRef, orderBy("createdAt", "desc"), where("ongoing", "==", false), where("product.ownerId", "==", auth.currentUser.uid), startAfter(lastDoc), limit(3)); 
    }
    //Bought Collection
    else if (!tabchange[0] && !tabchange[1] && !tabchange[2] && tabchange[3]) {
        var next = query(productsRef, orderBy("createdAt", "desc"), where("ongoing", "==", false), where("leadBuyerId", "==", auth.currentUser.uid), startAfter(lastDoc), limit(3)); 
    }
    //My Bids
    else {
        var next = query(productsRef, orderBy("createdAt", "desc"), where("allBiddersId", "array-contains", auth.currentUser.uid), where("ongoing", "==", true), startAfter(lastDoc), limit(3));
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
                    updateDoc(doc(db ,'auctions', documentSnapshots.docs[i].data().auctionDocId), { 
                        ongoing: false,
                        updatedAt: moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss')
                    })

                //Send notifications if Bid Ends
                if (documentSnapshots.docs[i].data().leadBuyerId) {
                    console.log(2222222222222)
                    //Send Seller Bid End Success message
                    new NotificationView().createNotification(documentSnapshots.docs[i].data().product.ownerId, "The Bid Duration is over! Congratulations, the highest bidder has won your auction! Click here to view Buyer's Contact Information", documentSnapshots.docs[i].data().auctionDocId);
            
                    //Send Buyer Bid End Success message
                    new NotificationView().createNotification(documentSnapshots.docs[i].data().leadBuyerId, "The Bid Duration is over! Congratulations, you have won the auction as the highest bidder! Click here to view Seller's Contact Information", documentSnapshots.docs[i].data().auctionDocId);
            
                    //Send to all other unsuccessful buyers (if there are other bidders)
                    if (documentSnapshots.docs[i].data().allBiddersId) {
                        for (let i = 0; i < documentSnapshots.docs[i].data().allBiddersId.length; i++) {
                            if (documentSnapshots.docs[i].data().allBiddersId[i] != documentSnapshots.docs[i].data().leadBuyerId) {
                                new NotificationView().createNotification(documentSnapshots.docs[i].data().allBiddersId[i], "The Bid Duration is over! We're sorry to inform you that this product listing is closed and you've been outbidded.", documentSnapshots.docs[i].data().auctionDocId);
                            }
                        }
                    }
                }
                else {
                    console.log(33333333333333)
                    //Send Seller unsuccessful auction (No Bidders but bid has ended)
                    new NotificationView().createNotification(documentSnapshots.docs[i].data().product.ownerId, "The Bid Duration is over! Unfortunately, there are no bidders for this product yet. Click here to view or delete your product.", documentSnapshots.docs[i].data().auctionDocId);
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

      const renderList = ({auctionId, auctionDocId, anomName, currPrice, product, createdAt, ongoing, allBiddersId, updatedAt, endingAt}) => {
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
                <View style = {{flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between'}}>
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
                    <View style = {styles.activedaycontainer}>
                        <Text style = {styles.activeday}>
                           {checkDaysLeft(endingAt) && ongoing  ? 'Bid Ending in:' : 'Auction Closed:'}
                        </Text>
                        <Text style = {styles.activedaytext}>
                            {checkDaysLeft(endingAt) && ongoing ? checkDaysLeft(endingAt) + ' Days': updatedAt.substring(0,10)} 
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
                <Text style = {styles.alertnotice}>There are currently no products in this section.</Text>
            </View>
        )
    }

    const checkDaysLeft = (endingDate) => {

        var given = moment(endingDate, 'DD/MM/YYYY') ;
        var current = moment(moment().tz('Singapore').format('DD/MM/YYYY'), 'DD/MM/YYYY')
        
        //Difference in number of days
        var diffDays = moment.duration(given.diff(current)).asDays();
        //console.log(diffDays);
        return diffDays;
    }

    return (
        <View
        style={styles.container}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        showsVerticalScrollIndicator={false}>
        <Image
          style={styles.userImg}
          source={require('../assets/StuBid-Logo-Original-ver.png')}
        />
        <Text style={styles.userName}>{userfullname}</Text>
        <View style = {styles.userinfoWrapper}>
            <Ionicons style={styles.lockIcon} name={'school-outline'} size={16} color={colors.black} />
            <Text style={styles.userinfo}> {useruni}</Text>
        </View>
        <View style = {styles.userinfoWrapper}>
        <Ionicons style={styles.lockIcon} name={'mail-outline'} size={16} color={colors.black} />
        <Text style={styles.userinfo}> {useremail}</Text>
        </View>
        <View style={styles.userBtnWrapper}>
                <TouchableOpacity
                style={styles.userReviewBtn}
                onPress={() => {
                  navigation.navigate('ViewReviews', {reviewerId : auth.currentUser.uid, reviewerName : 'Me'});
                }}>
                <Text style={styles.userBtnTxt}>View Reviews</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.userBtn}
                onPress={() => {
                  navigation.navigate('EditProfile');
                }}>
                <Text style={styles.userBtnTxt}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn}
               onPress={() => {
                setTimeout(()=>{
                    auth.signOut(); 
                  },5000);
                  const popAction = StackActions.pop();
                  navigation.dispatch(popAction);
                navigation.navigate("LogoutSuccess");
                }}>
                <Text style={styles.userBtnTxt}>Logout</Text>
              </TouchableOpacity>
        </View>
        <View>
        <ScrollView style={styles.TabsWrapper}  contentContainerStyle={{flexGrow: 1,}} horizontal={true} >

            <TouchableOpacity
                style={styles.TabsBtn}
                onPress={() => {
                 mybidTabpressed()
                }}>
                <Text style={tabchange[0] ? styles.TabsTextSelected: styles.TabsText}>My Bids</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.TabsBtn}
                onPress={() => {
                 myauctionTabpressed()
                }}>
                <Text style={tabchange[1] ? styles.TabsTextSelected: styles.TabsText}>My Auctions</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.TabsBtn}
                onPress={() => {
                  soldcollectionTabpressed()
                }}>
                <Text style={tabchange[2] ? styles.TabsTextSelected: styles.TabsText}>Sold Collection</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.TabsBtn}
                onPress={() => {
                  boughtcollectionTabpressed()
                }}>
                <Text style={tabchange[3] ? styles.TabsTextSelected: styles.TabsText}>Bought Collection</Text>
            </TouchableOpacity>

        </ScrollView>
        </View>
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
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 20,
      },

      userImg: {
        height: 250,
        width: 250,
        borderRadius: 75,
        alignSelf: 'center',
        marginBottom: -80,
        marginTop: -50
      },

      userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'center',
      },

      aboutUser: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
      },

      userBtnWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginVertical: 10,
        color: colors.darkbrown,
      },

      userReviewBtn: {
        backgroundColor: colors.gold,
        borderWidth: 2,
        borderRadius: 3,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 5,
        borderColor: colors.activeday,
      },

      userBtn: {
        backgroundColor: colors.red,
        borderWidth: 2,
        borderRadius: 3,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 5,
        borderColor: colors.activeday,
      },

      userBtnTxt: {
        color: colors.white,
        fontWeight: 'bold',
      },

      userinfoWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        color: colors.darkbrown,
      },

      userinfo: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
      }, 

      TabsWrapper: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: colors.darkbrown,
        marginTop: 10,
      },

      TabsBtn: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginHorizontal: 5,
      },

      TabsText: {
        color: colors.white,
        fontWeight: 'bold',
      },

      TabsTextSelected: {
        color: colors.gold,
        fontWeight: 'bold',
      },

      list: {
        width: '100%',
        flexDirection: 'column',
        paddingHorizontal: 15,
        marginBottom: 20,
        borderWidth: 0.2,
        borderColor: colors.darkbrown,
        
        
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
        borderRadius: 5,
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

    alertnotice :{
        color: colors.red,
        fontFamily: 'Montserrat-Black',
        textAlign: 'center',
        marginTop: 150,
    }

    
})

export default MyProfilepage;